const User = require("../models/UserModel");
const Role = require("../models/RoleModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const getUsers = async (req, res) => {
  const allUsers = await User.find();

  res.json({
    ok: 200,
    allUsers
  });
};

const postUser = async (req, res) => {
  const { Documento, Nombre, Apellidos, Celular, Correo, Direccion, Rol, Estado, Contrasena } = req.body;
  console.log('HOLAAAA')
  const user = new User({ Documento, Nombre, Apellidos, Celular, Correo, Direccion, Rol, Estado, Contrasena });

  await user.save();

  res.json({
    ok: 200,
    mensaje: "Usuario registrado correctamente.",
    user
  });
};

const putUser = async (req, res) => {
  const userId = req.params.id;
  const { Documento, Nombre, Apellidos, Celular, Correo, Direccion, Rol, Estado, Contrasena } = req.body;

  const userUpdate = await User.findByIdAndUpdate(userId, {
    Documento,
    Nombre,
    Apellidos,
    Celular,
    Correo,
    Direccion,
    Rol,
    Estado,
    Contrasena
  });

  res.json({
    ok: 200,
    mensaje: "Usuario actualizado correctamente."
  });
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;
  const deletedUser = await User.findByIdAndDelete(userId);

  res.json({
    ok: 200,
    mensaje: "Usuario eliminado correctamente."
  });
};

const searchUser = async (req, res) => {
  console.log('hola en usuarios')
  const { id } = req.params;
  const data = await User.find({ _id: id });

  res.json({
    ok: 200,
    data
  });
};

const getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.json({
      ok: 200,
      data: roles,
    });
  } catch (error) {
    res.status(500).json({
      ok: 500,
      message: "Error al obtener los roles",
      error: error.message,
    });
  }
};


module.exports = {
  getUsers,
  postUser,
  putUser,
  deleteUser,
  searchUser,
  getRoles,
};
