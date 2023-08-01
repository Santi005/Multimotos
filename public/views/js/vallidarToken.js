$(document).ready(function() {
    // Obtener el token desde el LocalStorage
    const token = localStorage.getItem('token');
  
    // Verificar si el token existe
    if (!token) {
      // Redireccionar al inicio de sesión
      window.location.href = 'loginvista.html';
    } 
  });