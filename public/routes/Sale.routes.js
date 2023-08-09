const { Router } = require('express');
const { check } = require('express-validator');
const { ValidatorPath, SaleExisting } = require('../middlewares/SaleValidator');

const { getSale, postSale, desactivateSale, activateSale, searchSale, getDocument, updateSaleToSend, updateSaleToDelivered, updateSaleToPending, updateSaleToReturn, updateSaleToCancelled } = require('../controllers/SaleController');

const route = Router();

route.get('/', getSale);

route.get('/:id', searchSale);

route.get('/compras/:document', getDocument);

route.post('/',
[
    ValidatorPath,
], postSale);

route.put('/desactivate/:id', desactivateSale);

route.put('/activate/:id', activateSale);

route.put('/updateToSend/:id', updateSaleToSend);

route.put('/updateToDelivered/:id', updateSaleToDelivered);

route.put('/updateToPending/:id', updateSaleToPending);

route.put('/updateToReturn/:id', updateSaleToReturn);

route.put('/updateToCacelled/:id', updateSaleToCancelled);

module.exports = route;