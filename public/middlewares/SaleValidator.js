const { validationResult } = require('express-validator');

const Sale = require('../models/SaleModel');

const ValidatorPath = (req, res, next) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json(errors)
    }

    next();
}

const SaleExisting = async (Factura = '') => {

    const SaleExisting = await Sale.findOne({ Factura });

    if(SaleExisting) {
        throw new Error(`La factura ${Factura}, ya existe en la base de datos`)
    }
}

module.exports = {
    ValidatorPath,
    SaleExisting
}