const { validationResult } = require("express-validator");
const User = require("../models/UserModel");

const ValidatorPath = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }

  next();
};

const UsuarioExisting = async (Documento = '') => {
  const userExisting = await User.findOne({ Documento });

  if (userExisting) {
    throw new Error(`El usuario con número de documento ${Documento} ya existe en la base de datos.`);
  }
};

module.exports = {
  ValidatorPath,
  UsuarioExisting
};
