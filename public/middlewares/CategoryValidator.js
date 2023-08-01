const {validationResult} = require("express-validator");
const Category = require("../models/CategoryModel");

const ValidatorPath = (req, res, next) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(400).json(errors)
  }

  next();
}


const CategoriaExisting = async (NombreCategoria = '') => {
  const CategoriaExisting = await Categoria.findOne({NombreCategoria});

  if(CategoriaExisting){
    throw new Error(`La categoría ${NombreCategoria}, ya existe en la base de datos`);
  }
}

module.exports = {
  ValidatorPath,
  CategoriaExisting
}