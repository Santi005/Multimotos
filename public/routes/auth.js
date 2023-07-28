const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

router.post('/login', async (req, res) => {
  const { correo, Contrasena } = req.body;

  try {
    console.log('Iniciando sesión...');

    const user = await User.findOne({ Correo: correo }).populate('Rol').exec();

    if (!user) {
      console.log('Correo o contraseña incorrectos.');
      return res.status(404).json({ message: 'Correo o contraseña incorrectos.' });
    }

    const isPasswordCorrect = await bcrypt.compare(Contrasena, user.Contrasena);

    if (!isPasswordCorrect) {
      console.log('Correo o contraseña incorrectos.');
      return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
    }

    const { _id, Documento, Nombre, Apellidos, Correo: correoUsuario, Rol } = user;

    console.log('Nombre del rol:', Rol.nombre);

    // Verificar los permisos del rol
    const permisos = Rol.permisos;

    const modulosAcceso = [];

    if (permisos.dashboard) {
      modulosAcceso.push('admin/index.html');
    }

    if (permisos.roles) {
      modulosAcceso.push('admin/Roles.html');
    }

    if (permisos.usuarios) {
      modulosAcceso.push('admin/usuarios.html');
    }

    if (permisos.productos) {
      modulosAcceso.push('admin/productos.html');
    }

    if (permisos.categorias) {
      modulosAcceso.push('admin/categorias.html');
    }

    if (permisos.marcas) {
      modulosAcceso.push('admin/Marcas.html');
    }

    if (permisos.ventas) {
      modulosAcceso.push('admin/Ventas.html');
    }

    if (modulosAcceso.length > 0) {
      console.log('Inicio de sesión exitoso (Administrador)');
      res.status(200).json({
        redirectUrl: modulosAcceso[0], // Redirecciona al primer módulo disponible
        token: jwt.sign({ userId: _id }, process.env.SECRETKEY, { expiresIn: '1h' }),
        user: {
          _id,
          Documento,
          Nombre,
          Apellidos,
          Correo: correoUsuario,
          Rol
        },
      });
    } else {
      console.log('Inicio de sesión exitoso (Cliente)');
      console.log('Nombre del usuario:', Nombre);

      // Almacenar el nombre del usuario en el localStorage
      res.status(200).json({
        redirectUrl: 'index.html',
        token: jwt.sign({ userId: _id }, process.env.SECRETKEY, { expiresIn: '1h' }),
        user: {
          _id,
          Documento,
          Nombre,
          Apellidos,
          Correo: correoUsuario,
          Rol: {
            nombre: Rol.nombre,
          }
        },
      });
    }
    
  } catch (err) {
    console.error('Error de inicio de sesión:', err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
