const mongoose = require('mongoose');

const permisosSchema = new mongoose.Schema({
  dashboard: { type: Boolean, default: true },
  roles: { type: Boolean, default: false },
  usuarios: { type: Boolean, default: false },
  productos: { type: Boolean, default: false },
  categorias: { type: Boolean, default: false },
  marcas: { type: Boolean, default: false },
  ventas: { type: Boolean, default: false },
  pedidos: { type: Boolean, default: false },
});

const rolesSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  estado: { type: String},
  permisos: permisosSchema,
  usuarios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }] // Relación con la colección de usuarios
});

const Rol = mongoose.model('Role', rolesSchema);

module.exports = Rol;
