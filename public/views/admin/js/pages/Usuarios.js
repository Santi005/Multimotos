let usersData = []; 

const inputAdd = document.getElementById('autocompleteDirectionAdd');
const latitudeFieldAdd = document.getElementById('latitudeAdd');
const longitudeFieldAdd = document.getElementById('longitudeAdd');

const options = {
  componentRestrictions: { 
    country: 'CO', // Código de país para Colombia
  }
};

const autocompleteAdd = new google.maps.places.Autocomplete(inputAdd, options);

autocompleteAdd.addListener('place_changed', () => {
  const place = autocompleteAdd.getPlace();
    
  if (!place.geometry) {
    console.log("No se encontró ningún lugar para la selección.");
    return;
  }

  const latitude = place.geometry.location.lat();
  const longitude = place.geometry.location.lng();

  const selectedPlace = {
    name: place.name,
    address: place.formatted_address,
    latitude: latitude,
    longitude: longitude
  };

  latitudeFieldAdd.value = latitude
  longitudeFieldAdd.value = longitude

  console.log("Lugar seleccionado:", place);
});

const inputEdit = document.getElementById('autocompleteDirectionEdit');
const latitudeFieldEdit = document.getElementById('latitudeEdit');
const longitudeFieldEdit = document.getElementById('longitudeEdit');

const optionsEdit = {
  componentRestrictions: { 
    country: 'CO', // Código de país para Colombia
  }
};

const autocompleteEdit = new google.maps.places.Autocomplete(inputEdit, optionsEdit);

autocompleteEdit.addListener('place_changed', () => {
  const place = autocompleteEdit.getPlace();
    
  if (!place.geometry) {
    console.log("No se encontró ningún lugar para la selección.");
    return;
  }

  const latitude = place.geometry.location.lat();
  const longitude = place.geometry.location.lng();

  const selectedPlace = {
    name: place.name,
    address: place.formatted_address,
    latitude: latitude,
    longitude: longitude
  };

  latitudeFieldAdd.value = latitude
  longitudeFieldAdd.value = longitude

  console.log("Lugar seleccionado:", place);
});

const listUsers = () => {
  // Obtener los datos de roles
  fetch('http://localhost:8080/roles/')
    .then(response => response.json())
    .then(data => {
      // Crear un mapa de roles con su id como clave y nombre como valor
      const rolesMap = {};
      data.data.forEach(role => {
        rolesMap[role._id] = role.nombre;
      });

      // Obtener los datos de usuarios
      fetch('http://localhost:8080/users/')
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data.allUsers)) {
            usersData = data.allUsers;
            const tableBody = $("#UsersTable tbody");
            tableBody.empty();

            data.allUsers.forEach((user, index) => {
              const rolNombre = rolesMap[user.Rol];
              let row = `
                <tr id="${user._id}">
                  <td>${index + 1}</td>
                  <td>${user.Documento}</td>
                  <td>${user.Nombre}</td>
                  <td>${user.Apellidos}</td>
                  <td>${user.Celular}</td>
                  <td>${user.Correo}</td>
                  <td>${user.Direccion[0]}</td>
                  <td>${rolNombre}</td>
                  <td>${user.Estado}</td>
                  <td>
                    <i onclick="EditUser('${user._id}', '${user.Documento}', '${user.Nombre}', '${user.Apellidos}', '${user.Celular}', '${user.Correo}', '${user.Direccion[0]}', '${user.Direccion[1]}', '${user.Direccion[2]}', '${user.Direccion[3]}', '${user.Direccion[4]}', '${user.Direccion[5]}', '${user.Rol}', '${user.Estado}')"
                      class="bi bi-pencil-square usuarios" style="color:#f62d51; font-size: 1.3em; cursor:pointer;"></i>
                  
                        &nbsp;&nbsp;
                  
                    <i onclick="DeleteUser('${user._id}')"
                        class="bi bi-trash3 usuarios" style="color:#f62d51; font-size: 1.3em; cursor:pointer;"></i>
                  </td>
                </tr>
              `;
              tableBody.append(row);
            });

            // Inicializar el DataTable después de agregar los registros a la tabla
            $("#UsersTable").DataTable({language: {
              url: "https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
            }});  
          } else {
            console.error('Los datos recibidos no contienen un arreglo válido.');
          }
        })
        .catch(error => {
          console.error(error);
        });
    })
    .catch(error => {
      console.error(error);
    });
};



//Agregar

$(document).ready(function() {
  const $InputAgregarDocumento = $('#InputAgregarDocumento');
  const $InputAgregarNombre = $('#InputAgregarNombre');
  const $InputAgregarApellidos = $('#InputAgregarApellidos');
  const $InputAgregarCelular = $('#InputAgregarCelular');
  const $InputAgregarCorreo = $('#InputAgregarCorreo');
  const $errorDocumento = $('#errorDocumento');
  const $errorNombre = $('#errorNombre');
  const $errorApellidos = $('#errorApellidos');
  const $errorCelular = $('#errorCelular');
  const $errorCorreo = $('#errorCorreo');
  const $errorAdd = $('#errorAdd');
  const $modalAgregarUsuario = $('#AgregarUsuario');
  const $btnConfirmarAgregar = $('#BtnConfirmarAdd');

    // Función de validación para el campo de Documento
    function validarDocumento() {
      const documento = $InputAgregarDocumento.val().trim();
      if (documento === "" || !/^\d{8,11}$/.test(documento)) {
        $errorDocumento.text("Documento inválido.").removeClass("d-none");
        $InputAgregarDocumento.addClass("is-invalid");
      } else {
        $errorDocumento.text("").addClass("d-none");
        $InputAgregarDocumento.removeClass("is-invalid");
      }
      for (const user of usersData) {
        if (user.Documento === documento) { 
          $errorDocumento.text('El documento ya está en uso').removeClass('d-none');
          $InputAgregarDocumento.addClass('is-invalid').removeClass('is-valid');
          return false;
        }
      }
    }

      // Función de validación para el campo de Nombre
  function validarNombre() {
    const nombre = $InputAgregarNombre.val().trim();
    const alphanumericRegex = /^[a-zA-Z\s]*$/;
    if (nombre === "" || !alphanumericRegex.test(nombre)) {
      $errorNombre.text("Nombre inválido. Solo se permiten letras y espacios.").removeClass("d-none");
      $InputAgregarNombre.addClass("is-invalid");
    } else if (nombre.length > 25) {
    $errorNombre.text("El nombre no puede tener más de 25 caracteres.").removeClass("d-none");
    $InputAgregarNombre.addClass("is-invalid");
    } else {
      $errorNombre.text("").addClass("d-none");
      $InputAgregarNombre.removeClass("is-invalid");
    }
  }

  // Función de validación para el campo de Apellidos
  function validarApellidos() {
    const apellidos = $InputAgregarApellidos.val().trim();
    const alphanumericRegex = /^[a-zA-Z\s]*$/;
    if (apellidos === "" || !alphanumericRegex.test(apellidos)) {
      $errorApellidos.text("Apellidos inválidos. Solo se permiten letras y espacios.").removeClass("d-none");
      $InputAgregarApellidos.addClass("is-invalid");
    } else if (apellidos.length > 25) {
    $errorApellidos.text("Los apellidos no pueden tener más de 25 caracteres.").removeClass("d-none");
    $InputAgregarApellidos.addClass("is-invalid");
    } else {
      $errorApellidos.text("").addClass("d-none");
      $InputAgregarApellidos.removeClass("is-invalid");
    }
  }

  // Función de validación para el campo de Celular
  function validarCelular() {
    const celular = $InputAgregarCelular.val().trim();
    const celularRegex = /^\d{10}$/;
    if (celular === "" || !celularRegex.test(celular)) {
      $errorCelular.text("Celular inválido. Debe tener 10 dígitos.").removeClass("d-none");
      $InputAgregarCelular.addClass("is-invalid");
    } else {
      $errorCelular.text("").addClass("d-none");
      $InputAgregarCelular.removeClass("is-invalid");
    }
  }

  // Función de validación para el campo de Correo
  function validarCorreo() {
    const correo = $InputAgregarCorreo.val().trim();
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (correo === "" || !emailRegex.test(correo)) {
      $errorCorreo.text("Correo inválido. Formato válido: ejemplo@ejemplo.com.").removeClass("d-none");
      $InputAgregarCorreo.addClass("is-invalid");
    } else if (correo.length > 250) {
    $errorCorreo.text("El correo no puede tener más de 250 caracteres.").removeClass("d-none");
    $InputAgregarCorreo.addClass("is-invalid");
    } else {
      $errorCorreo.text("").addClass("d-none");
      $InputAgregarCorreo.removeClass("is-invalid");
    }
    for (const user of usersData) {
      if (user.Correo === correo) { 
        $errorCorreo.text('El correo ya está en uso').removeClass('d-none');
        $InputAgregarCorreo.addClass('is-invalid').removeClass('is-valid');
        return false;
      }
    }
  }

  // // Función de validación para el campo de Dirección
  // function validarDireccionCompletaEditar() {
  //   const city = $('#citySelect').val();
  //   const addressType = $('#addressTypeSelect').val();
  //   const adressTypeNumber = $('#adressRoad').val();
  //   const addressNumber1 = $('#addressNumber1').val();
  //   const addressNumber2 = $('#addressNumber2').val();
  //   const detalles = $('#InputDetalles').val();
  
  //   if (city === "" || addressType === "" || adressTypeNumber === "" || addressNumber1 === "" || addressNumber2 === "") {
  //     $('#errorEditarDireccion').text("Por favor completa todos los campos de la dirección.").removeClass("d-none");
  //     return false;
  //   } else {
  //     $('#errorEditarDireccion').text("").addClass("d-none");
  //     return true;
  //   }
  // }

    $InputAgregarDocumento.on('input', validarDocumento);
    $InputAgregarNombre.on('input', validarNombre);
    $InputAgregarApellidos.on('input', validarApellidos);
    $InputAgregarCelular.on('input', validarCelular);
    $InputAgregarCorreo.on('input', validarCorreo);



  // Función para validar todos los campos
  function validarCampos() {
    validarDocumento();
    validarNombre();
    validarApellidos();
    validarCelular();
    validarCorreo();
    // validarDireccionCompletaEditar();
  }

  // Función para agregar un usuario
  async function agregarUsuario() {
    // Obtener los valores de los campos
    const documento = $('#InputAgregarDocumento').val().trim();
    const nombre = $('#InputAgregarNombre').val().trim();
    const apellidos = $('#InputAgregarApellidos').val().trim();
    const celular = $('#InputAgregarCelular').val().trim();
    const correo = $('#InputAgregarCorreo').val().trim();
    const rol = $('#InputAgregarRol').val();
    const estado = $('#InputAgregarEstado').val();

    // Objeto de datos del usuario
    const userData = {
      Documento: documento,
      Nombre: nombre,
      Apellidos: apellidos,
      Celular: celular,
      Correo: correo,
      Direccion: getFullAddress(),
      Rol: rol,
      Estado: estado,
      Contrasena: "123"
    };

    await Swal.fire('Usuario agregado');

    // Realizar la solicitud POST para agregar el usuario
    fetch('http://localhost:8080/users/', {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        // Cerrar el modal y recargar la página
        $modalAgregarUsuario.modal('hide');
        location.reload();
      })
      .catch((error) => {
        console.error('Error al agregar el usuario:', error);
      });
  }

  // Reinicializar la validación al cerrar el modal
  $modalAgregarUsuario.on('hidden.bs.modal', function () {
    // Restablecer valores y estilos de los campos
    $InputAgregarDocumento.val('');
    $InputAgregarNombre.val('');
    $InputAgregarApellidos.val('');
    $InputAgregarCelular.val('');
    $InputAgregarCorreo.val('');
    $InputAgregarDocumento.removeClass('is-invalid is-valid');
    $InputAgregarNombre.removeClass('is-invalid is-valid');
    $InputAgregarApellidos.removeClass('is-invalid is-valid');
    $InputAgregarCelular.removeClass('is-invalid is-valid');
    $InputAgregarCorreo.removeClass('is-invalid is-valid');
    $errorDocumento.addClass('d-none');
    $errorNombre.addClass('d-none');
    $errorApellidos.addClass('d-none');
    $errorCelular.addClass('d-none');
    $errorCorreo.addClass('d-none');
    // $errorDireccion.addClass('d-none');
    $errorAdd.addClass('d-none');
  });

  // Evento de clic en el botón de confirmar
  $btnConfirmarAgregar.on('click', () => {
    validarCampos(); // Validar campos antes de agregar
    // Llamar a la función para agregar el usuario solo si no hay errores de validación
    if (
      !$InputAgregarDocumento.hasClass("is-invalid") &&
      !$InputAgregarNombre.hasClass("is-invalid") &&
      !$InputAgregarApellidos.hasClass("is-invalid") &&
      !$InputAgregarCelular.hasClass("is-invalid") &&
      !$InputAgregarCorreo.hasClass("is-invalid")
    ) {
      // Función para agregar un usuario
      agregarUsuario();
    }
  });
});




//EDITAR
  // Variables para almacenar el documento y el correo actuales
let currentDocumento = "";
let currentCorreo = "";
// Función para abrir el modal de edición de usuario con los valores actuales
function EditUser(id, documento, nombre, apellidos, celular, correo, ciudad, typeadress, road, adress1, adress2, detalles, rol, estado) {
  console.log("EditUser - ID:", id);
  currentDocumento = documento;
  currentCorreo = correo;
  console.log("currentCorreo:", currentCorreo);
  console.log("currentDocumento:", currentDocumento);

  $('#EditarUsuario').modal('show');
  $('#IdEditarUsuario').val(id);
  $('#InputEditarDocumento').val(documento);
  $('#InputEditarNombre').val(nombre);
  $('#InputEditarApellidos').val(apellidos);
  $('#InputEditarCelular').val(celular);
  $('#InputEditarCorreo').val(correo);
  // $('#InputEditarDireccion').val(direccion);
  $('#InputEditarRol').val(rol);
  $('#InputEditarEstado').val(estado);
  var cityEditar = document.getElementById("cityEditar");
  var addressTypeSelectEditar = document.getElementById("addressTypeSelectEditar");
  $('#adressRoadEditar').val(road);
  $('#addressNumber1Editar').val(adress1);
  $('#addressNumber2Editar').val(adress2);
  $('#detallesEditar').val(detalles);

  console.log(ciudad);

  for (var i = 0; i < cityEditar.options.length; i++) {
    if (cityEditar.options[i].value === ciudad) {
      cityEditar.selectedIndex = i;
      break;
    }
  }

  for (var i = 0; i < addressTypeSelectEditar.options.length; i++) {
    if (addressTypeSelectEditar.options[i].value === typeadress) {
      addressTypeSelectEditar.selectedIndex = i;
      break;
    }
  }

  // Agregar eventos 'input' para validación en tiempo real
  $('#InputEditarDocumento').on('input', validarDocumentoEditar);
  $('#InputEditarNombre').on('input', validarNombreEditar);
  $('#InputEditarApellidos').on('input', validarApellidosEditar);
  $('#InputEditarCelular').on('input', validarCelularEditar);
  $('#InputEditarCorreo').on('input', validarCorreoEditar);
  // $('#InputEditarDireccion').on('input', validarDireccionEditar);
}

// Evento Click del Botón de Confirmación
$('#BtnConfirmarEdit').on('click', () => {
  validarCamposEditar();
  
  const newDocumento = $('#InputEditarDocumento').val();
  const newCorreo = $('#InputEditarCorreo').val();

  if (
    !$('#InputEditarDocumento').hasClass("is-invalid") &&
    !$('#InputEditarNombre').hasClass("is-invalid") &&
    !$('#InputEditarApellidos').hasClass("is-invalid") &&
    !$('#InputEditarCelular').hasClass("is-invalid")
    // !$('#InputEditarDireccion').hasClass("is-invalid")
  ) {
    if (newDocumento === currentDocumento) {
      // No se han realizado cambios en el documento, validar solo el correo si es necesario
      validarCorreoIfNecessary(newCorreo);
    } else {
      validarDocumentoExistente(newDocumento, (documentoValido) => {
        if (documentoValido) {
          validarCorreoIfNecessary(newCorreo);
        }
      });
    }
  }
});


// Función de validación para el campo de Documento en el formulario de edición
function validarDocumentoEditar() {
  const documento = $('#InputEditarDocumento').val().trim();
  if (documento === "" || !/^\d{8,11}$/.test(documento)) {
    $('#errorEditarDocumento').text("Documento inválido.").removeClass("d-none");
    $('#InputEditarDocumento').addClass("is-invalid");
  } else {
    $('#errorEditarDocumento').text("").addClass("d-none");
    $('#InputEditarDocumento').removeClass("is-invalid");
  }
}

      // Función de validación para el campo de Nombre
function validarNombreEditar() {
  const nombre = $('#InputEditarNombre').val().trim();
  const alphanumericRegex = /^[a-zA-Z\s]*$/;
  
  if (nombre === "" || !alphanumericRegex.test(nombre)) {
    $('#errorEditarNombre').text("Nombre inválido. Solo se permiten letras y espacios.").removeClass("d-none");
    $('#InputEditarNombre').addClass("is-invalid");
  } else if (nombre.length > 25) {
    $('#errorEditarNombre').text("El nombre no puede tener más de 25 caracteres.").removeClass("d-none");
    $('#InputEditarNombre').addClass("is-invalid");
  } else {
    $('#errorEditarNombre').text("").addClass("d-none");
    $('#InputEditarNombre').removeClass("is-invalid");
  }
}

  // Función de validación para el campo de Apellidos
  function validarApellidosEditar() {
    const apellidos = $('#InputEditarApellidos').val().trim();
    const alphanumericRegex = /^[a-zA-Z\s]*$/;
      if (apellidos === "" || !alphanumericRegex.test(apellidos)) {
      $('#errorEditarApellidos').text("Apellidos inválidos. Solo se permiten letras y espacios").removeClass("d-none");
      $('#InputEditarApellidos').addClass("is-invalid");
    } else if (apellidos.length > 25) {
    $('#errorEditarApellidos').text("Los apellidos no pueden tener más de 25 caracteres.").removeClass("d-none");
    $('#InputEditarApellidos').addClass("is-invalid");
    } else {
      $('#errorEditarApellidos').text("").addClass("d-none");
      $('#InputEditarApellidos').removeClass("is-invalid");
    }
  }

  // Función de validación para el campo de Celular
  function validarCelularEditar() {
    const celular = $('#InputEditarCelular').val().trim();
    const celularRegex = /^\d{10}$/;
    if (celular === "" || !celularRegex.test(celular)) {
      $('#errorEditarCelular').text("Celular inválido. Debe tener 10 dígitos.").removeClass("d-none");
      $('#InputEditarCelular').addClass("is-invalid");
    } else {
      $('#errorEditarCelular').text("").addClass("d-none");
      $('#InputEditarCelular').removeClass("is-invalid");
    }
  }

  // Función de validación para el campo de Correo
  function validarCorreoEditar() {
    const correo = $('#InputEditarCorreo').val().trim();
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (correo === "" || !emailRegex.test(correo)) {
      $('#errorEditarCorreo').text("Correo inválido. Formato válido: ejemplo@ejemplo.com.").removeClass("d-none");
      $('#InputEditarCorreo').addClass("is-invalid");
    } else if (correo.length > 250) {
    $('#errorEditarCorreo').text("El correo no puede tener más de 250 caracteres.").removeClass("d-none");
    $('#InputEditarCorreo').addClass("is-invalid");
    } else {
      $('#errorEditarCorreo').text("").addClass("d-none");
      $('#InputEditarCorreo').removeClass("is-invalid");
    }
  }

  // Función de validación para el campo de Dirección
  // function validarDireccionEditar() {
  //   const direccion = $('#InputEditarDireccion').val().trim();
  //   if (direccion === "") {
  //     $('#errorEditarDireccion').text("El campo de dirección no puede estar vacío.").removeClass("d-none");
  //     $('#InputEditarDireccion').addClass("is-invalid");
  //   } else if (direccion.length > 150) {
  //   $('#errorEditarDireccion').text("La direccion no puede tener más de 150 caracteres.").removeClass("d-none");
  //   $('#InputEditarDireccion').addClass("is-invalid");
  //   } else {
  //     $('#errorEditarDireccion').text("").addClass("d-none");
  //     $('#InputEditarDireccion').removeClass("is-invalid");
  //   }
  // }

// Función para validar los cambios editados (documento y correo)
function validarCambiosEditados() {
  const newDocumento = $('#InputEditarDocumento').val();
  const newCorreo = $('#InputEditarCorreo').val();

  validarDocumentoExistente(newDocumento, (documentoValido) => {
    if (documentoValido) {
      validarCorreoIfNecessary(newCorreo);
    }
  });
}

function validarCorreoIfNecessary(newCorreo) {
  const currentCorreo = $('#InputEditarCorreo').val();

  if (newCorreo !== currentCorreo) {
    validarCorreoExistente(newCorreo, (correoValido) => {
      if (correoValido) {
        editarUsuario();
      }
    });
  } else {
    editarUsuario();
  }
}

function validarCorreoIfNecessary(newCorreo) {
  if (newCorreo !== currentCorreo) {
    validarCorreoExistente(newCorreo, (correoValido) => {
      if (correoValido) {
        editarUsuario();
      }
    });
  } else {
    editarUsuario();
  }
}


  function validarDocumentoExistente(documento, callback) {
    // Hacer una solicitud fetch al backend para verificar si el documento está registrado
    fetch(`http://localhost:8080/users/check-documento/${documento}`)
      .then(response => response.json())
      .then(data => {
        if (data.exists) {
          mostrarErrorDocumentoExistente();
          callback(false);
        } else {
          ocultarErrorDocumentoExistente();
          callback(true);
        }
      })
      .catch(error => {
        console.error("Error al verificar documento:", error);
        callback(false);
      });
  }
  

  // Función para validar si el nuevo correo ya está registrado
  function validarCorreoExistente(correo, callback) {
    // Hacer una solicitud fetch al backend para verificar si el documento está registrado
    fetch(`http://localhost:8080/users/check-email/${correo}`)
      .then(response => response.json())
      .then(data => {
        if (data.exists) {
          mostrarErrorCorreoExistente();
          callback(false);
        } else {
          ocultarErrorCorreoExistente();
          callback(true);
        }
      })
      .catch(error => {
        console.error("Error al verificar correo:", error);
        callback(false);
      });
    }

  // Funciones para mostrar y ocultar mensajes de error en documento o correo existentes
  function mostrarErrorDocumentoExistente() {
    $('#errorEditarDocumento').text('El documento ya está registrado en otro usuario.').removeClass('d-none');
    $('#InputEditarDocumento').addClass('is-invalid');
  }

  function ocultarErrorDocumentoExistente() {
    $('#errorEditarDocumento').text('').addClass('d-none');
    $('#InputEditarDocumento').removeClass('is-invalid');
  }

  function mostrarErrorCorreoExistente() {
    $('#errorEditarCorreo').text('El correo ya está registrado en otro usuario.').removeClass('d-none');
    $('#InputEditarCorreo').addClass('is-invalid');
  }

  function ocultarErrorCorreoExistente() {
    $('#errorEditarCorreo').text('').addClass('d-none');
    $('#InputEditarCorreo').removeClass('is-invalid');
  }



// Función para validar el formulario de edición en tiempo real
function validarCamposEditar() {
  validarDocumentoEditar();
  validarNombreEditar();
  validarApellidosEditar();
  validarCelularEditar();
  validarCorreoEditar();
  // validarDireccionEditar();
}

// Función para editar un usuario
async function editarUsuario() {
  const id = $('#IdEditarUsuario').val();
  const userData = {
    Documento: $('#InputEditarDocumento').val(),
    Nombre: $('#InputEditarNombre').val(),
    Apellidos: $('#InputEditarApellidos').val(),
    Celular: $('#InputEditarCelular').val(),
    Correo: $('#InputEditarCorreo').val(),
    Direccion: getFullAddressEditar(),
    Rol: $('#InputEditarRol').val(),
    Estado: $('#InputEditarEstado').val()
  };

  await Swal.fire('Usuario editado');

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
    location.reload(); // Recargar la página después de la edición
  })
  .catch(error => {
    console.error(error);
  });
}



// ELIMINAR --------

$('#BtnConfirmarDelete').on('click', async () => {
  const id = $('#IdEliminarUsuario').val();
  await Swal.fire('Usuario eliminado');
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

function getFullAddress() {
  let direccionCompleta = [];

  const direccionAdd = $('#autocompleteDirectionAdd').val();
  const latitudAdd = $('#latitudeAdd').val();
  const longitudAdd = $('#longitudeAdd').val();

  direccionCompleta.push(direccionAdd, latitudAdd, longitudAdd);

  return direccionCompleta;
}

function getFullAddressEditar() {
  let direccionCompleta = [];

  const direccionEdit = $('#autocompleteDirectionEdit').val();
  const latitudEdit = $('#latitudeEdit').val();
  const longitudEdit = $('#longitudeEdit').val();

  direccionCompleta.push(direccionEdit, latitudEdit, longitudEdit);

  return direccionCompleta;
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

