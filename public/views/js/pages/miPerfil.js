fetch(`http://localhost:8080/users/${userId}`)
  .then((response) => response.json())
  .then((data) => {
    const datos = data.data[0];

    $("#nombreSaludo").text(datos.Nombre);
    $("#documento").text(datos.Documento);
    $("#nombre").text(datos.Nombre);
    $("#apellidos").text(datos.Apellidos);
    $("#celular").text(datos.Celular);
    $("#correo").text(datos.Correo);
    $("#direccion").text(
      `${datos.Direccion[0]}, ${datos.Direccion[1]} ${datos.Direccion[2]} #${datos.Direccion[3]} - ${datos.Direccion[4]}, ${datos.Direccion[5]}`
    );

    $("#InputEditarDocumento").val(datos.Documento);
    $("#InputEditarNombre").val(datos.Nombre);
    $("#InputEditarApellidos").val(datos.Apellidos);
    $("#InputEditarCelular").val(datos.Celular);
    $("#InputEditarCorreo").val(datos.Correo);
    var citySelect = document.getElementById("city");
    var adressTypeSelect = document.getElementById("addressTypeSelect");
    $("#adressRoad").val(datos.Direccion[2]);
    $("#addressNumber1").val(datos.Direccion[3]);
    $("#addressNumber2").val(datos.Direccion[4]);
    $("#detalles").val(datos.Direccion[5]);

    for (var i = 0; i < citySelect.options.length; i++) {
      if (citySelect.options[i].value === datos.Direccion[0]) {
        citySelect.selectedIndex = i;
        break;
      }
    }

    for (var i = 0; i < adressTypeSelect.options.length; i++) {
      if (adressTypeSelect.options[i].value === datos.Direccion[1]) {
        adressTypeSelect.selectedIndex = i;
        break;
      }
    }

    $("#EditarUsuario").on("hidden.bs.modal", function () {
      $("#InputEditarDocumento").val(datos.Documento);
      $("#InputEditarNombre").val(datos.Nombre);
      $("#InputEditarApellidos").val(datos.Apellidos);
      $("#InputEditarCelular").val(datos.Celular);
      $("#InputEditarCorreo").val(datos.Correo);
      var citySelect = document.getElementById("city");
      var adressTypeSelect = document.getElementById("addressTypeSelect");
      $("#adressRoad").val(datos.Direccion[2]);
      $("#addressNumber1").val(datos.Direccion[3]);
      $("#addressNumber2").val(datos.Direccion[4]);
      $("#detalles").val(datos.Direccion[5]);

      for (var i = 0; i < citySelect.options.length; i++) {
        if (citySelect.options[i].value === datos.Direccion[0]) {
          citySelect.selectedIndex = i;
          break;
        }
      }

      for (var i = 0; i < adressTypeSelect.options.length; i++) {
        if (adressTypeSelect.options[i].value === datos.Direccion[1]) {
          adressTypeSelect.selectedIndex = i;
          break;
        }
      }

      $(".invalid-feedback").text("");
      $(".is-invalid").removeClass("is-invalid");
    });
  });

$("#BtnConfirmarEdit").on("click", async function () {
  // Reiniciar los mensajes de error
  $(".invalid-feedback").text("");
  $(".is-invalid").removeClass("is-invalid");

  try {
    const response = await fetch(`http://localhost:8080/users/${userId}`);
    const userDataFromDB = await response.json();
    const user = userDataFromDB.data[0];

    const documento = $("#InputEditarDocumento").val();
    const nombre = $("#InputEditarNombre").val();
    const apellidos = $("#InputEditarApellidos").val();
    const celular = $("#InputEditarCelular").val();
    const correo = $("#InputEditarCorreo").val();
    const ciudad = $("#city").val();
    const tipoVia = $("#addressTypeSelect").val();
    const direccionNumero = $("#adressRoad").val();
    const direccionNumero1 = $("#addressNumber1").val();
    const direccionNumero2 = $("#addressNumber2").val();
    const detallesDireccion = $("#detalles").val();

    const direccion = [
      ciudad,
      tipoVia,
      direccionNumero,
      direccionNumero1,
      direccionNumero2,
      detallesDireccion,
    ];

    let isValid = true;

    // Validar documento
    if (documento === "") {
      $("#InputEditarDocumento").addClass("is-invalid");
      isValid = false;
    } else if (
      documento.length < 8 ||
      documento.length > 11 ||
      isNaN(documento)
    ) {
      $("#errorEditarDocumento").text(
        "El documento debe tener entre 8 y 11 dígitos numéricos"
      );
      $("#InputEditarDocumento").addClass("is-invalid");
      isValid = false;
    }

    // Validar celular
    if (celular === "") {
      $("#errorEditarCelular").text("El campo Celular es obligatorio");
      $("#InputEditarCelular").addClass("is-invalid");
      isValid = false;
    } else if (celular.length !== 10 || isNaN(celular)) {
      $("#errorEditarCelular").text(
        "El celular debe tener 10 dígitos numéricos"
      );
      $("#InputEditarCelular").addClass("is-invalid");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const camposModificados =
      documento !== user.Documento ||
      nombre !== user.Nombre ||
      apellidos !== user.Apellidos ||
      celular !== user.Celular ||
      correo !== user.Correo ||
      // Verificar si los campos de dirección han cambiado
      JSON.stringify(direccion) !== JSON.stringify(user.Direccion);

    if (!camposModificados) {
      console.log("No se han realizado cambios en los campos");
      return;
    }

    // Verificar si el documento ha cambiado y validar si es necesario
    if (documento !== user.Documento) {
      const documentoValido = await validarDocumentoExistente(documento);
      if (!documentoValido) {
        return;
      }
    }

    // Verificar si el correo ha cambiado y validar si es necesario
    if (correo !== user.Correo) {
      const correoValido = await validarCorreoExistente(correo);
      if (!correoValido) {
        return;
      }
    }

    const userDataUpdated = {
      Documento: documento,
      Nombre: nombre,
      Apellidos: apellidos,
      Celular: celular,
      Correo: correo,
      Direccion: direccion,
    };

    // Actualizar los datos del usuario en la base de datos
    const updateResponse = await fetch(
      `http://localhost:8080/users/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDataUpdated),
      }
    );

    const updateData = await updateResponse.json();
    if (updateData.ok) {
      console.log("Datos actualizados correctamente:", updateData.message);
      location.reload();
    }
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
  }
});

function isValidEmail(email) {
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Función para validar si el nuevo documento ya está registrado
async function validarDocumentoExistente(documento) {
  try {
    const response = await fetch(
      `http://localhost:8080/users/check-documento/${documento}`
    );
    const data = await response.json();

    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
      didOpen: (toast) => {
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: "error",
      title: "Este documento ya está asociado a una cuenta.",
    });

    return !data.exists;
  } catch (error) {
    console.error("Error al verificar documento:", error);
    return false;
  }
}

// Función para validar si el nuevo correo ya está registrado
async function validarCorreoExistente(correo) {
  try {
    const response = await fetch(
      `http://localhost:8080/users/check-email/${correo}`
    );
    const data = await response.json();

    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
      didOpen: (toast) => {
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: "error",
      title: "Este correo ya está asociado a una cuenta.",
    });

    return !data.exists;
  } catch (error) {
    console.error("Error al verificar correo:", error);
    return false;
  }
}

console.log(userData);

function getTokenFromURL() {
    const url = window.location.href;
    const tokenIndex = url.indexOf('?');
    if (tokenIndex === -1) {
      console.log('Token no encontrado en la URL');
      return null;
    }
    const token = url.substring(tokenIndex + 1);
    console.log('Token:', token);
    return token;
  }

// Agregar evento al botón "Guardar" del modal
$("#BtnGuardarContrasena").on("click", async function () {
    // Reiniciar los mensajes de error
    $(".invalid-feedback").text("");
    $(".is-invalid").removeClass("is-invalid");
  
    const contrasenaActual = $("#InputContrasenaActual").val();
    const nuevaContrasena = $("#InputNuevaContrasena").val();
    const confirmarNuevaContrasena = $("#InputConfirmarNuevaContrasena").val();
  
    // Validaciones
    if (nuevaContrasena !== confirmarNuevaContrasena) {
      $("#errorContrasena").text("Las contraseñas no coinciden.");
      $("#InputNuevaContrasena, #InputConfirmarNuevaContrasena").addClass("is-invalid");
      return;
    }
  
    // Aquí puedes realizar la validación de la contraseña actual, por ejemplo, usando la función de resetPasswordForm
  
    // Llamar a la función de cambio de contraseña con la nueva contraseña
    const success = await changePassword(nuevaContrasena);
  
    if (success) {
      // Aquí puedes mostrar un mensaje de éxito o hacer lo que consideres necesario
      console.log("Contraseña cambiada exitosamente.");
      $("#CambiarContrasenaModal").modal("hide"); // Cerrar el modal
    } else {
      // Aquí puedes mostrar un mensaje de error o hacer lo que consideres necesario
      console.error("No se pudo cambiar la contraseña.");
    }
  });
  
  // Función para cambiar la contraseña
  async function changePassword(newPassword) {
    try {
      // Hacer la solicitud al servidor para cambiar la contraseña
      const token = getTokenFromURL(); // Asegúrate de obtener el token correcto
      const response = await fetch(`/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: newPassword })
      });
  
      const data = await response.json();
      return data.success; // Devuelve true si el cambio de contraseña fue exitoso, false si no lo fue
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      return false;
    }
  }

var prevScrollPos = window.pageYOffset;
window.addEventListener("scroll", function () {
  var currentScrollPos = window.pageYOffset;
  var header = document.querySelector(".header");

  if (prevScrollPos > currentScrollPos) {
    header.style.top = "0";
  } else {
    header.style.top = "-400px";
  }
  prevScrollPos = currentScrollPos;
});