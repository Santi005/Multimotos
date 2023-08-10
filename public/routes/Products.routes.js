const {Router} = require("express");
const {check} = require("express-validator")
const {ValidatorPath, ProductExisting} = require("../middlewares/ProductValidator");
const {fileUpload, incrementStock, decrementarStock, getProduct, postProducts, putProduct, deleteProduct, searchProduct} = require("../controllers/ProductController");
const {Product} = require("../models/ProductsModel");

const route = Router();

route.get('/', getProduct);

route.get('/:id', searchProduct);

route.post('/',
fileUpload,
[
    check('NombreProducto', 'El nombre es obligatorio').not().isEmpty(),
    check("Descripcion", "La descripción es obligatoria").not().isEmpty(),
    check("Descripción", "La descripción debe de tener máximo 80 caracteres ").isLength({max:80}),
    check('Stock', 'El stock es obligatorio').not().isEmpty(),
    check('Categoria', 'La categoría es obligatoria').not().isEmpty(),
    check('Marca', 'La marca es obligatoria').not().isEmpty(),
    check('Precio', 'El precio es obligatorio').not().isEmpty(),
    ValidatorPath
],   
postProducts
);

route.put('/:id', fileUpload, putProduct);

route.delete('/:id', deleteProduct);


route.put('/:id/incrementar-stock', incrementStock);

route.put('/:id/decrementar-stock', decrementarStock)

module.exports = route;