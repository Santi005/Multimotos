function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('userData'); // Eliminar el token del localStorage
    // alert("Sesión cerrada exitosamente");
    window.location.href = "../index.html"; // Redireccionar al archivo index.html
}