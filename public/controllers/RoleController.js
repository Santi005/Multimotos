const Role = require("../models/RoleModel");
const User = require("../models/UserModel");

const getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.json({
      ok: 200,
      data: roles,
    });
  } catch (error) {
    res.status(500).json({
      ok: 500,
      message: "Error al obtener los roles",
      error: error.message,
    });
  }
};

const postRole = async (req, res) => {
  try {
    const { nombre, estado, permisos } = req.body;
    const role = new Role({ nombre, estado, permisos });
    await role.save();
    res.json({
      ok: 200,
      message: "Rol creado correctamente",
      data: role,
    });
  } catch (error) {
    res.status(500).json({
      ok: 500,
      message: "Error al crear el rol",
      error: error.message,
    });
  }
};

const putRole = async (req, res) => {
  try {
    const roleId = req.params.id;
    const { nombre, estado, permisos } = req.body;

    // Obtener el rol antes de la actualización
    const role = await Role.findById(roleId);

    // Verificar si el estado del rol cambió a "inactivo"
    if (estado === "Inactivo" && role.estado !== "Inactivo") {
      // Cambiar el estado de los usuarios asociados al rol a "inactivo"
      await User.updateMany({ Rol: roleId }, { Estado: "Inactivo" });
    }

    // Actualizar el rol
    const updatedRole = await Role.findByIdAndUpdate(
      roleId,
      { nombre, estado, permisos },
      { new: true }
    );

    res.json({
      ok: 200,
      message: "Rol actualizado correctamente",
      data: updatedRole,
    });
  } catch (error) {
    res.status(500).json({
      ok: 500,
      message: "Error al actualizar el rol",
      error: error.message,
    });
  }
};


const deleteRole = async (req, res) => {
  try {
    const roleId = req.params.id;

    // Verificar si existen usuarios asociados al rol
    const usuarios = await User.find({ Rol: roleId });
    if (usuarios.length > 0) {
      // Mostrar una alerta indicando que no se puede eliminar el rol
      return res.status(400).json({
        ok: false,
        message: "No se puede eliminar el rol porque tiene usuarios asociados",
      });
    }

    // Verificar si el nombre del rol es 'Administrador' o 'Cliente'
    const role = await Role.findById(roleId);
    if (role.nombre === 'Administrador' || role.nombre === 'Cliente') {
      return res.status(400).json({
        ok: false,
        message: "No se puede eliminar el rol",
      });
    }

    // Si no hay usuarios asociados y no es un rol 'Administrador' o 'Cliente', eliminar el rol
    await Role.findByIdAndDelete(roleId);
    res.json({
      ok: true,
      message: "Rol eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al eliminar el rol",
      error: error.message,
    });
  }
};



const getRole = async (req, res) => {
  try {
    const roleId = req.params.id;
    const role = await Role.findById(roleId);

    res.json({
      ok: 200,
      data: role,
    });
  } catch (error) {
    res.status(500).json({
      ok: 500,
      message: "Error al obtener el rol",
      error: error.message,
    });
  }
};

module.exports = {
  getRoles,
  postRole,
  putRole,
  deleteRole,
  getRole,
};
