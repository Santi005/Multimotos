const { Router } = require("express");
const { check } = require("express-validator");
const { ValidatorPath, MarkExisting } = require("../middlewares/MarkValidator");
const { fileUpload, getMark, postMark, putMark, deleteMark, searchMark } = require("../controllers/MarkController");

const route = Router();

route.get('/', getMark);

route.get('/:id', searchMark);

route.post('/', 
  fileUpload, // Middleware de carga de archivos
  [
    check('NombreMarca', 'El nombre es obligatorio').not().isEmpty(),
    ValidatorPath
  ],
  postMark
);

route.put('/:id', fileUpload, putMark ); // Middleware de carga de archivos

route.delete('/:id', deleteMark);


module.exports = route;
