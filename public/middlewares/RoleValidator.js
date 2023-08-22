// RoleValidator.js

const { validationResult } = require("express-validator");
const Role = require("../models/RoleModel");

const validateRole = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }

  const { nombre } = req.body;
  const regex = /^[a-zA-Z\s]+$/;

  if (!regex.test(nombre)) {
    return res.status(400).json({ message: "El nombre del rol contiene caracteres no válidos" });
  }

  next();
};

const checkDuplicateRole = async (nombre = '', roleId) => {
  const existingRole = await Role.findOne({ nombre });

  if (existingRole && existingRole._id.toString() !== roleId) {
    throw new Error(`El rol ${nombre} ya existe en la base de datos`);
  }
};

module.exports = {
  validateRole,
  checkDuplicateRole,
};
