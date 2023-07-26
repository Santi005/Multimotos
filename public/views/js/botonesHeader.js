document.addEventListener("DOMContentLoaded", function() {
    var loginButton = document.getElementById("loginButton");
    var logoutButton = document.getElementById("logoutButton");
    var token = localStorage.getItem("token");

    if (token) {
        // Si hay un token en el almacenamiento local, mostrar el botón de Cerrar Sesión
        loginButton.style.display = "none";
        logoutButton.style.display = "inline-block";
    } else {
        // Si no hay un token en el almacenamiento local, mostrar el botón de Iniciar Sesión
        loginButton.style.display = "inline-block";
        logoutButton.style.display = "none";
    }
});