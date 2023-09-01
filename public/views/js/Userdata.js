// Obtener el ID del usuario desde el LocalStorage
const userData = JSON.parse(localStorage.getItem('userData'));
const userId = userData._id;

// Obtener los datos del usuario desde el servidor y rellenar los campos
$.ajax({
  url: 'http://localhost:8080/users/' + userId,
  type: 'GET',
  success: function(response) {
    const data = response.data[0];

    // Obtener el primer nombre y el primer apellido
    const primerNombre = data.Nombre.split(' ')[0];
    const primerApellido = data.Apellidos.split(' ')[0];

    $('#DocumentoUsuario').text(data.Documento);
    $('#NombreCompleto').text(primerNombre + ' ' + primerApellido);
    $('#NombreUsuario').text(primerNombre);
    $('#ApellidosUsuario').text(primerApellido);
    $('#CelularUsuario').text(data.Celular);
    $('#CorreoUsuario').text(data.Correo);
    $('#DireccionUsuario').text(data.Direccion);
  },
  error: function(xhr, status, error) {
    console.log(error);
  }
});
