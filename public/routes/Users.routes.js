// User.routes.js

const { Router } = require("express");
const { check } = require("express-validator");
const {
  ValidatorPath,
} = require("../middlewares/UserValidator");

const {
  getUsers,
  postUser,
  putUser,
  deleteUser,
  searchUser,
  getRoles,
  checkExistingCorreo, 
  checkExistingDocumento,
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

    // Validación personalizada para verificar que el correo no esté registrado
    check("Correo").custom(async (value) => {
      const exists = await checkExistingCorreo(value);
      if (exists) {
        throw new Error("El correo electrónico ya está registrado.");
      }
      return true;
    }),

    // Validación personalizada para verificar que el documento no esté registrado
    check("Documento").custom(async (value) => {
      const exists = await checkExistingDocumento(value);
      if (exists) {
        throw new Error("El número de documento ya está registrado.");
      }
      return true;
    }),

    ValidatorPath
  ],
  postUser
);

route.put("/:id", putUser);

route.delete("/:id", deleteUser);

route.get("/roles", getRoles);

route.get("/check-email/:correo", async (req, res) => {
  const { correo } = req.params;
  try {
    const exists = await checkExistingCorreo(correo);
    res.json({ exists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al verificar el correo electrónico." });
  }
});

route.get("/check-documento/:documento", async (req, res) => {
  const { documento } = req.params;
  try {
    const exists = await checkExistingDocumento(documento);
    res.json({ exists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al verificar el número de documento." });
  }
});


module.exports = route;
