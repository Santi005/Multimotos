const User = require("../models/UserModel");
const Role = require("../models/RoleModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const checkExistingCorreo = async (correo, userId) => {
  try {
    console.log("Verificando correo:", correo);
    const user = await User.findOne({ Correo: correo, _id: { $ne: userId } });
    console.log("Resultado:", user !== null);
    return user !== null; // Devuelve true si el correo existe, false si no existe
  } catch (error) {
    console.error(error);
    return false;
  }
};

const checkExistingDocumento = async (documento, userId) => {
  try {
    console.log("Verificando documento:", documento);
    const user = await User.findOne({ Documento: documento, _id: { $ne: userId } });
    console.log("Resultado:", user !== null);
    return user !== null; // Devuelve true si el documento existe, false si no existe
  } catch (error) {
    console.error(error);
    return false;
  }
};


const getUsers = async (req, res) => {
  const allUsers = await User.find();

  res.json({
    ok: 200,
    allUsers
  });
};

const postUser = async (req, res) => {
  const { Documento, Nombre, Apellidos, Celular, Correo, Direccion, Rol, Estado, Contrasena } = req.body;

  // Verifica si el correo ya está registrado en la base de datos
  console.log("Verificando correo existente:", Correo);
  const isCorreoRegistered = await checkExistingCorreo(Correo);
  console.log("Correo existente:", isCorreoRegistered);

  if (isCorreoRegistered) {
    return res.status(400).json({
      ok: 400,
      mensaje: "El correo electrónico ya está registrado.",
    });
  }

  // Verifica si el documento ya está registrado en la base de datos
  console.log("Verificando documento existente:", Documento);
  const isDocumentoRegistered = await checkExistingDocumento(Documento);
  console.log("Documento existente:", isDocumentoRegistered);

  if (isDocumentoRegistered) {
    return res.status(400).json({
      ok: 400,
      mensaje: "El número de documento ya está registrado.",
    });
  }

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
  const { Documento, Correo } = req.body;

  // Verifica si el nuevo correo ya está registrado en la base de datos
  const isCorreoRegistered = await checkExistingCorreo(Correo, userId);
  if (isCorreoRegistered) {
    return res.status(400).json({
      ok: 400,
      mensaje: "El correo electrónico ya está registrado."
    });
  }

  // Verifica si el nuevo documento ya está registrado en la base de datos
  const isDocumentoRegistered = await checkExistingDocumento(Documento, userId);
  if (isDocumentoRegistered) {
    return res.status(400).json({
      ok: 400,
      mensaje: "El número de documento ya está registrado."
    });
  }

  // Realiza la actualización en la base de datos
  const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });

  res.json({
    ok: 200,
    mensaje: "Usuario actualizado correctamente.",
    user: updatedUser
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

// Función para obtener la cantidad total de usuarios
const getTotalUsuarios = async (req, res) => {
  try {
    const totalUsuarios = await User.countDocuments();
    res.json({ totalUsuarios });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Función para obtener la cantidad total de usuarios con el rol "Cliente"
const getTotalClientes = async (req, res) => {
  try {
    const rolClienteObjectId = "64defa9c74fb54f6dfe372e9"; 
    const totalClientes = await User.countDocuments({ Rol: rolClienteObjectId });
    res.json({ totalClientes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getUsers,
  postUser,
  putUser,
  deleteUser,
  searchUser,
  getRoles,
  checkExistingCorreo, 
  checkExistingDocumento, 
  getTotalUsuarios,
  getTotalClientes
};

