const listUsers = () => {
    const searchInput = $('#search-input-users');
    const tableBody = $('#UsersTable tbody');
  
    fetch('http://localhost:8080/users/')
      .then(response => response.json())
      .then(data => {
        const searchTerm = searchInput.val().toLowerCase();
  
        // Filtrar los datos basados en la búsqueda del usuario
        const filteredData = data.allUsers.filter(user => {
          const documento = user.Documento.toLowerCase();
          const nombre = user.Nombre.toLowerCase();
          const apellidos = user.Apellidos.toLowerCase();
          return (
            documento.includes(searchTerm) ||
            nombre.includes(searchTerm) ||
            apellidos.includes(searchTerm)
          );
        });
  
        // Limpiar la tabla antes de agregar los resultados filtrados
        tableBody.empty();
  
        // Obtener los roles y crear un objeto de mapeo de ID de rol a nombre de rol
        const rolesMap = {};
        fetch('http://localhost:8080/roles/')
          .then(response => response.json())
          .then(data => {
            data.data.forEach(role => {
              rolesMap[role._id] = role.nombre;
            });
  
            // Mostrar los resultados filtrados en la tabla
            if (Array.isArray(filteredData)) {
              filteredData.forEach((user, index) => {
                const rolNombre = rolesMap[user.Rol]; // Obtener el nombre del rol utilizando el ID del rol
                let row = `
                  <tr id="${user._id}">
                    <td>${index + 1}</td>
                    <td>${user.Documento}</td>
                    <td>${user.Nombre}</td>
                    <td>${user.Apellidos}</td>
                    <td>${user.Celular}</td>
                    <td>${user.Correo}</td>
                    <td>${user.Direccion}</td>
                    <td>${rolNombre}</td> // Mostrar el nombre del rol en lugar del ID del rol
                    <td>${user.Estado}</td>
                    <td>
                      <i onclick="EditUser('${user._id}', '${user.Documento}', '${user.Nombre}', '${user.Apellidos}', '${user.Celular}', '${user.Correo}', '${user.Direccion}', '${user.Rol}', '${user.Estado}')"
                        class="fas fa-edit fa-lg usuarios" style="color:#f62d51;"></i>
  
                      &nbsp;&nbsp;&nbsp;
  
                      <i onclick="DeleteUser('${user._id}')"
                        class="fas fa-minus-circle fa-lg usuarios" style="color:#f62d51;"></i>
                    </td>
                  </tr>
                `;
                tableBody.append(row);
              });
            }
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        console.error(error);
      });
  }
  

// Asignar la función de búsqueda al evento 'input' del campo de búsqueda
$('#search-input-users').on('input', listUsers);


$(document).ready(function() {
  $("#BtnConfirmarAdd").on("click", function(event) {
    event.preventDefault();
    event.stopPropagation();

    var inputAgregarDocumento = $("#InputAgregarDocumento");
    var inputAgregarNombre = $("#InputAgregarNombre");
    var inputAgregarApellidos = $("#InputAgregarApellidos");
    var inputAgregarCelular = $("#InputAgregarCelular");
    var inputAgregarCorreo = $("#InputAgregarCorreo");
    var inputAgregarDireccion = $("#InputAgregarDireccion");
    var errorDocumento = $("#errorDocumento");
    var errorNombre = $("#errorNombre");
    var errorApellidos = $("#errorApellidos");
    var errorCelular = $("#errorCelular");
    var errorCorreo = $("#errorCorreo");
    var errorDireccion = $("#errorDireccion");
    var errorAdd = $("#errorAdd");

    var documento = inputAgregarDocumento.val().trim();
    var nombre = inputAgregarNombre.val().trim();
    var apellidos = inputAgregarApellidos.val().trim();
    var celular = inputAgregarCelular.val().trim();
    var correo = inputAgregarCorreo.val().trim();
    var direccion = inputAgregarDireccion.val().trim();
    var alphanumericRegex = /^[a-zA-Z\s]*$/;
    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var celularRegex = /^\d{10}$/;

    if (documento === "") {
      errorDocumento.text("El campo no puede estar vacío.").removeClass("d-none");
      inputAgregarDocumento.addClass("is-invalid");
      return;
    } else if (documento < 0 || !/^\d{8,11}$/.test(documento)) {
      errorDocumento.text("Documento invalido.").removeClass("d-none");
      inputAgregarDocumento.addClass("is-invalid");
      return;
    } else {
      errorDocumento.text("").addClass("d-none");
      inputAgregarDocumento.removeClass("is-invalid");
    }
    

    if (nombre === "") {
      errorNombre.text("El campo no puede estar vacío.").removeClass("d-none");
      inputAgregarNombre.addClass("is-invalid");
      return;
    } else if (!alphanumericRegex.test(nombre)) {
      errorNombre.text("No se permiten caracteres especiales ni números.").removeClass("d-none");
      inputAgregarNombre.addClass("is-invalid");
      return;
    } else {
      errorNombre.text("").addClass("d-none");
      inputAgregarNombre.removeClass("is-invalid");
    }

    if (apellidos === "") {
      errorApellidos.text("El campo no puede estar vacío.").removeClass("d-none");
      inputAgregarApellidos.addClass("is-invalid");
      return;
    } else if (!alphanumericRegex.test(apellidos)) {
      errorApellidos.text("No se permiten caracteres especiales ni números.").removeClass("d-none");
      inputAgregarApellidos.addClass("is-invalid");
      return;
    } else {
      errorApellidos.text("").addClass("d-none");
      inputAgregarApellidos.removeClass("is-invalid");
    }

    if (celular === "") {
      errorCelular.text("El campo no puede estar vacío.").removeClass("d-none");
      inputAgregarCelular.addClass("is-invalid");
      return;
    } else if (!celularRegex.test(celular)) {
      errorCelular.text("El número de celular debe tener 10 dígitos.").removeClass("d-none");
      inputAgregarCelular.addClass("is-invalid");
      return;
    } else {
      errorCelular.text("").addClass("d-none");
      inputAgregarCelular.removeClass("is-invalid");
    }

    if (correo === "") {
      errorCorreo.text("El campo no puede estar vacío.").removeClass("d-none");
      inputAgregarCorreo.addClass("is-invalid");
      return;
    } else if (!emailRegex.test(correo)) {
      errorCorreo.text("El correo debe tener un formato válido (ejemplo@gmail.com).").removeClass("d-none");
      inputAgregarCorreo.addClass("is-invalid");
      return;
    } else {
      errorCorreo.text("").addClass("d-none");
      inputAgregarCorreo.removeClass("is-invalid");
    }

    if (direccion === "") {
      errorDireccion.text("El campo no puede estar vacío.").removeClass("d-none");
      inputAgregarDireccion.addClass("is-invalid");
      return;
    } else if (direccion.length > 40) {
      errorDireccion.text("La dirección no puede exceder los 40 caracteres.").removeClass("d-none");
      inputAgregarDireccion.addClass("is-invalid");
      return;
    } else {
      errorDireccion.text("").addClass("d-none");
      inputAgregarDireccion.removeClass("is-invalid");
    }

    // Todas las validaciones pasaron, proceder con el envío de datos

    var userData = {
      Documento: documento,
      Nombre: nombre,
      Apellidos: apellidos,
      Celular: celular,
      Correo: correo,
      Direccion: direccion,
      Rol: $("#InputAgregarRol").val(),
      Estado: $("#InputAgregarEstado").val(),
      Contrasena: "123"
    };

    console.log(userData);

    fetch("http://localhost:8080/users/", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 400) {
          return response.json().then(data => {
            if (data.errors && data.errors.Documento) {
              // Mostrar mensaje de error al usuario
              const errorMessage = data.errors.Documento.msg;
              alert(errorMessage);
            } else {
              throw new Error("Error de validación en el servidor");
            }
          });
        } else {
          throw new Error("Error en el servidor");
        }
      })
      .then(json => {
        $("#AgregarUsuario").modal("hide");
        location.reload();
      })
      .catch(error => {
        console.error(error);
      });
  });
});



  

// Función para abrir el modal de edición de usuario con los valores actuales
function EditUser(id, documento, nombre, apellidos, celular, correo, direccion, rol, estado) {
  $('#EditarUsuario').modal('show');
  $('#IdEditarUsuario').val(id);
  $('#InputEditarDocumento').val(documento);
  $('#InputEditarNombre').val(nombre);
  $('#InputEditarApellidos').val(apellidos);
  $('#InputEditarCelular').val(celular);
  $('#InputEditarCorreo').val(correo);
  $('#InputEditarDireccion').val(direccion);
  $('#InputEditarRol').val(rol);
  $('#InputEditarEstado').val(estado);
}

// Evento click del botón de confirmar edición
$('#BtnConfirmarEdit').on('click', () => {
  const id = $('#IdEditarUsuario').val();
  const userData = {
    Documento: $('#InputEditarDocumento').val(),
    Nombre: $('#InputEditarNombre').val(),
    Apellidos: $('#InputEditarApellidos').val(),
    Celular: $('#InputEditarCelular').val(),
    Correo: $('#InputEditarCorreo').val(),
    Direccion: $('#InputEditarDireccion').val(),
    Rol: $('#InputEditarRol').val(),
    Estado: $('#InputEditarEstado').val()
  };

  if (userData.Documento !== '') {
    fetch(`http://localhost:8080/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
      .then(response => response.json())
      .then(data => {
        console.log('Usuario editado:', data);

        $('#EditarUsuario').modal('hide');
        location.reload();
      })
      .catch(error => {
        console.error(error);
      });
  } else {
    ValidateForm();
  }
});


$('#BtnConfirmarDelete').on('click', () => {
  const id = $('#IdEliminarUsuario').val();

  fetch(`http://localhost:8080/users/${id}`, {
      method: 'DELETE'
  })
  .then(response => response.json())
  .then(data => {
      $('#EliminarUsuario').modal('hide');
      location.reload();
      console.log(data);
  })
  .catch(error => {
      console.error(error);
  });
});

function DeleteUser(id) {
  $('#EliminarUsuario').modal('show');
  $('#IdEliminarUsuario').val(id);
}

function ValidateForm() {
  $(document).ready(function() {
      $('#AgregarUsuario').on('shown.bs.modal', function() {
          resetForm('Agregar');
      });

      $('#BtnConfirmarAdd').on('click', function(event) {
          const InputAgregarDocumento = $('#InputAgregarDocumento');
          const error = $('#errorAdd');

          if (InputAgregarDocumento.val().trim() === '') {
              error.removeClass('d-none');
              InputAgregarDocumento.addClass('is-invalid');
              event.stopPropagation();
          } else {
              error.addClass('d-none');
              InputAgregarDocumento.removeClass('is-invalid');
          }
      });

      $('#EditarUsuario').on('shown.bs.modal', function() {
          resetForm('Editar');
      });

      $('#BtnConfirmarEdit').on('click', function(event) {
          const InputEditarDocumento = $('#InputEditarDocumento');
          const error = $('#errorEdit');

          if (InputEditarDocumento.val().trim() === '') {
              error.removeClass('d-none');
              InputEditarDocumento.addClass('is-invalid');
              event.stopPropagation();
          } else {
              error.addClass('d-none');
              InputEditarDocumento.removeClass('is-invalid');
          }
      });
  });
}

function resetForm(modalType) {
  let InputDocumento;
  let error;

  if (modalType === 'Agregar') {
      InputDocumento = $('#InputAgregarDocumento');
      error = $('#errorAdd');
  } else if (modalType === 'Editar') {
      InputDocumento = $('#InputEditarDocumento');
      error = $('#errorEdit');
  }

  InputDocumento.val('');
  error.addClass('d-none');
  InputDocumento.removeClass('is-invalid');
}

listUsers();
