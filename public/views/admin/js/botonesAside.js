// Obtener el elemento del menú
var dashboardItem = document.getElementById('dashboardItem');
var rolesItem = document.getElementById('rolesItem');
var usuariosItem = document.getElementById('usuariosItem');
var productosItem = document.getElementById('productosItem');
var categoriasItem = document.getElementById('categoriasItem');
var marcasItem = document.getElementById('marcasItem');
var ventasItem = document.getElementById('ventasItem');
var pedidosItem = document.getElementById('pedidosItem');
// Verificar y mostrar/ocultar el elemento del menú
if (permisoDashboard) {
    dashboardItem.style.display = 'block';
} else {
    dashboardItem.style.display = 'none';
}
if (permisoRoles) {
    rolesItem.style.display = 'block';
} else {
    rolesItem.style.display = 'none';
}
if (permisoUsuarios) {
    usuariosItem.style.display = 'block';
} else {
    usuariosItem.style.display = 'none';
}
if (permisoProductos) {
    productosItem.style.display = 'block';
} else {
    productosItem.style.display = 'none';
}
if (permisoCategorias) {
    categoriasItem.style.display = 'block';
} else {
    categoriasItem.style.display = 'none';
}
if (permisoMarcas) {
    marcasItem.style.display = 'block';
} else {
    marcasItem.style.display = 'none';
}
if (permisoVentas) {
    ventasItem.style.display = 'block';
}
if (permisoVentas) {
    ventasItem.style.display = 'block';
} else {
    ventasItem.style.display = 'none';
}
if (permisoPedidos) {
    pedidosItem.style.display = 'block';
} else {
    pedidosItem.style.display = 'none';
}

