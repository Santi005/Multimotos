const { Schema, model } = require("mongoose");
const bcrypt = require('bcrypt');
const Rol = require('./RoleModel');

const UserModel = new Schema({
  Documento: {
    type: String,
    required: ["El número de documento es obligatorio."]
  },
  Nombre: {
    type: String,
    required: ["El nombre es obligatorio."]
  },
  Apellidos: {
    type: String,
    required: ["Los apellidos son obligatorios."]
  },
  Celular: {
    type: String,
    required: ["El número de celular es obligatorio."]
  },
  Correo: {
    type: String,
    required: ["El correo electrónico es obligatorio."]
  },
  Direccion: {
    type: [String],
    required: ["La dirección es obligatoria."]
  },
  Rol: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: ["El rol es obligatorio."],
  },
  Estado: {
    type: String,
    required: ["El estado es obligatorio."]
  },
  Contrasena: {
    type: String,
    required: ["La contraseña es obligatoria."]
  },
});

// Middleware para encriptar la contraseña antes de guardarla en la base de datos
UserModel.pre('save', async function(next) {
  try {
    // Generar un hash de la contraseña utilizando bcrypt
    const hashedPassword = await bcrypt.hash(this.Contrasena, 10);
    // Reemplazar la contraseña sin encriptar con el hash generado
    this.Contrasena = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = model("User", UserModel);
