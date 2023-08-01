const {validationResult} = require("express-validator");
const Product = require("../models/ProductsModel");
const res = require("express/lib/response");

const ValidatorPath = (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json(errors)
    }

    next();
}

const ProductExisting = async(req, res, next) => {
    const {NombreProducto} = req.body;
    const product = await Product.findOne({NombreProducto});

    if(product){
        return res.status(400).json({error: `El producto ${NombreProducto} ya existe en la base de datos.`});
    }

    next();
}

module.exports = {
    ValidatorPath,
    ProductExisting 
}