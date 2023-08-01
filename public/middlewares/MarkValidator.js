const {validationResult} = require("express-validator");
const Mark = require("../models/MarkModel");

const ValidatorPath = (req, res, next) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(400).json(errors)
  }

  next();
}


const MarkExisting = async (req, res, next) => {
  const { NombreMarca } = req.body;
  const mark = await Mark.findOne({ NombreMarca });
  
  if (mark) {
    return res.status(400).json({ error: `La marca ${NombreMarca} ya existe en la base de datos` });
  }
  
  next();
}


module.exports = {
  ValidatorPath,
  MarkExisting
}