const { Router } = require("express");
const { check } = require("express-validator");
const {
  ValidatorPath,
  UsuarioExisting
} = require("../middlewares/UserValidator");

const {
  getUsers,
  postUser,
  putUser,
  deleteUser,
  searchUser,
  getRoles,
} = require("../controllers/UserController");

const route = Router();

route.get("/", getUsers);

route.get("/:id", searchUser);

route.post( "/",
  [
    check("Documento", "El número de documento es obligatorio").not().isEmpty(),
    check("Nombre", "El nombre es obligatorio").not().isEmpty(),
    check("Apellidos", "Los apellidos son obligatorios").not().isEmpty(),
    check("Celular", "El número de celular es obligatorio").not().isEmpty(),
    check("Correo", "El correo electrónico es obligatorio").not().isEmpty(),
    check("Direccion", "La dirección es obligatoria").not().isEmpty(),
    check("Rol", "El rol es obligatorio").not().isEmpty(),
    check("Estado", "El estado es obligatorio").not().isEmpty(),
    check("Contrasena", "La contraseña es obligatoria").not().isEmpty(),
    ValidatorPath
  ],
  postUser
);

route.put("/:id", putUser);

route.delete("/:id", deleteUser);

route.get("/roles", getRoles);

module.exports = route;
