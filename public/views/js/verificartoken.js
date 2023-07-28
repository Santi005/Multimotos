  // Función para verificar si el usuario ha iniciado sesión
  const checkIfLoggedIn = () => {
    const token = localStorage.getItem('token');
    if (token) {
      // El usuario ya ha iniciado sesión, redirige a la página que desees
      window.location.href = 'index.html'; // Cambia 'dashboard.html' por la página deseada
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Llamar a la función para verificar si el usuario ha iniciado sesión al cargar la página
    checkIfLoggedIn();

    document.getElementById('loginForm').addEventListener('submit', async (event) => {
      // Resto del código para el manejo del inicio de sesión
    });
  });