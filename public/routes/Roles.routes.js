const { Router } = require("express");
const { check } = require("express-validator");
const { validateRole } = require("../middlewares/RoleValidator");
const { getRoles, postRole, putRole, deleteRole } = require("../controllers/RoleController");

const route = Router();

route.get("/", getRoles);

route.post(
  "/",
  [
    check("nombre", "El nombre del rol es obligatorio").not().isEmpty(),
    validateRole,
  ],
  postRole
);

route.put("/:id", putRole);

route.delete("/:id", deleteRole);

module.exports = route;
