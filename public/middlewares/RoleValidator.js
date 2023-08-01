const { validationResult } = require("express-validator");
const Role = require("../models/RoleModel");

const validateRole = async (req, res, next) => {
  const errors = validationResult(req);

  // Validar si hay errores en la validación
  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }

  // Validar el nombre del rol para asegurarse de que no contenga números ni caracteres especiales
  const { nombre } = req.body;
  const regex = /^[a-zA-Z\s]+$/;

  if (!regex.test(nombre)) {
    return res.status(400).json({ message: "El nombre del rol contiene caracteres no válidos" });
  }

  // Si pasa las validaciones, continuar con el siguiente middleware
  next();
};

const checkDuplicateRole = async (nombre = '') => {
  const existingRole = await Role.findOne({ nombre });

  if (existingRole) {
    throw new Error(`El rol ${nombre} ya existe en la base de datos`);
  }
};

module.exports = {
  validateRole,
  checkDuplicateRole,
};
