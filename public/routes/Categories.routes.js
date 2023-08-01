const {Router} = require("express");
const {check} = require("express-validator");
const {ValidatorPath, CategoriaExisting} = require("../middlewares/CategoryValidator");

const {getCategory, postCategory, putCategory, deleteCategory, searchCategory} = require("../controllers/CategoryController");

const route = Router();

route.get('/', getCategory);

route.get('/:id', searchCategory);

route.post('/',
[
  check('NombreCategoria', 'El nombre es obligatorio').not().isEmpty(),
  ValidatorPath
], 
postCategory)

route.put('/:id', putCategory);

route.delete('/:id', deleteCategory);


module.exports = route;