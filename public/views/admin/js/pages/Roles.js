let rolesData = []; 

const listRoles = () => {
  fetch('http://localhost:8080/roles/')
    .then((response) => response.json())
    .then((data) => {
      // Asegúrate de que data.data sea un arreglo válido
      if (Array.isArray(data.data)) {
        rolesData = data.data;
        const tableBody = $("#RolesTable tbody");
        tableBody.empty(); // Limpiar la tabla antes de agregar los resultados filtrados

        data.data.forEach((role, index) => {
          let row = `
            <tr id='${role._id}'>
              <td>${index + 1}</td>
              <td>${role.nombre}</td>
              <td>${role.estado}</td>
              <td>
              <i onclick="editRole('${role._id}', '${role.nombre}', '${role.estado}', '${role.permisos.dashboard}',
              '${role.permisos.roles}', '${role.permisos.usuarios}', '${role.permisos.productos}', 
              '${role.permisos.categorias}', '${role.permisos.marcas}', '${role.permisos.ventas}')" 
              class="bi bi-pencil-square role" style="color:#f62d51; font-size: 1.3em; cursor: pointer;"></i>
              &nbsp; &nbsp; 
              <i onclick="deleteRole('${role._id}')"
              class="bi bi-trash3 roles"  style="color:#f62d51;font-size: 1.3em; cursor: pointer;"></i>
              </td>
            </tr>
          `;
          tableBody.append(row);
        });

        // Inicializar el DataTable después de agregar los registros a la tabla
        $("#RolesTable").DataTable({language: {
          url: "https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
        }});
      } else {
        console.error('Los datos recibidos no contienen un arreglo válido.');
      }
    })
    .catch(error => {
      console.error(error);
    })
}

const showRoleDetails = (roleId) => {
  fetch(`http://localhost:8080/roles/${roleId}`)
    .then((response) => response.json())
    .then((role) => {
      // Mostrar los detalles del rol, incluidos los permisos
      editRole(role._id, role.nombre, role.estado, role.permisos);
    })
    .catch((error) => {
      console.error(error);
    });
};

// Asignar la función de búsqueda al evento 'input' del campo de búsqueda
$("#search-input-roles").on("input", listRoles);

$(document).ready(function() {
  const $inputAgregarNombreRol = $('#InputAgregarNombreRol');
  const $errorAdd = $('#errorAdd');
  const $modalAgregarRol = $('#AgregarRol');
  const $btnConfirmarAgregar = $('#BtnConfirmarAgregar');

  // Función de validación
  function validarRol() {
    const roleName = $inputAgregarNombreRol.val().trim();
    const alphanumericRegex = /^[a-zA-Z\s]*$/;

    if (roleName === '') {
      $inputAgregarNombreRol.addClass('is-invalid').removeClass('is-valid');
      $errorAdd.text('El campo no puede estar vacío.').removeClass('d-none');
      return false;
    } else if (!alphanumericRegex.test(roleName)) {
      $inputAgregarNombreRol.addClass('is-invalid').removeClass('is-valid');
      $errorAdd.text('No se permiten caracteres especiales ni números.').removeClass('d-none');
      return false;
    }

    for (const role of rolesData) {
      if (role.nombre === roleName) {
        $inputAgregarNombreRol.addClass('is-invalid').removeClass('is-valid');
        $errorAdd.text('El nombre de rol ya está en uso').removeClass('d-none');
        return false;
      }
    }

    $inputAgregarNombreRol.removeClass('is-invalid').addClass('is-valid');
    $errorAdd.addClass('d-none');
    return true;
  }

  // Función para agregar un rol
  function agregarRol() {
    const roleName = $inputAgregarNombreRol.val().trim();
    const estado = $('#SelectAgregarEstadoRol').val();
    const dashboard = $("#CheckDashboard").is(":checked");
    const roles = $("#CheckRoles").is(":checked");
    const usuarios = $("#CheckUsuarios").is(":checked");
    const productos = $("#CheckProductos").is(":checked");
    const categorias = $("#CheckCategorias").is(":checked");
    const marcas = $("#CheckMarcas").is(":checked");
    const ventas = $("#CheckVentas").is(":checked");

    let roleData = {
      nombre: roleName,
      estado: estado,
      permisos: {
        dashboard: dashboard,
        roles: roles,
        usuarios: usuarios,
        productos: productos,
        categorias: categorias,
        marcas: marcas,
        ventas: ventas,
      },
    };

    fetch('http://localhost:8080/roles', {
      method: 'POST',
      body: JSON.stringify(roleData),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        $modalAgregarRol.modal('hide');
        location.reload();
      })
      .catch((error) => {
        console.error('Error al agregar el rol:', error);
      });
  }

  // Reinicializar la validación al cerrar el modal
  $modalAgregarRol.on('hidden.bs.modal', function () {
    $inputAgregarNombreRol.val('');
    $inputAgregarNombreRol.removeClass('is-invalid is-valid');
    $errorAdd.addClass('d-none');
  });

  // Evento de entrada para la validación en tiempo real
  $inputAgregarNombreRol.on('input', validarRol);

  // Evento de clic en el botón de confirmar
  $btnConfirmarAgregar.on('click', () => {
    if (validarRol()) {
      agregarRol();
    }
  });
});

//EDITAR-------------------------------------------------------

// Función de validación para la edición de roles
// Función de validación para la edición de roles
function validarEdicionRol() {
  let roleName = $('#InputNombreRol').val().trim();
  let roleId = $('#IdEditarRol').val(); // Obtener el ID del rol en edición

  if (roleName === '') {
    $('#InputNombreRol').addClass('is-invalid').removeClass('is-valid');
    $('#errorEdit').text('El campo no puede estar vacío.').removeClass('d-none');
    return false;
  }

  const $rows = $('#RolesTable tbody tr');
  for (let i = 0; i < $rows.length; i++) {
    const roleIdInTable = $rows.eq(i).find('td:eq(0)').text().trim(); // Asumiendo que el ID de rol está en la primera columna de la tabla (índice 0)
    const roleNameInTable = $rows.eq(i).find('td:eq(1)').text().trim(); // Asumiendo que el nombre de rol está en la segunda columna de la tabla (índice 1)
    
    if (roleNameInTable === roleName && roleIdInTable !== roleId) { // Verificar el nombre del rol y el ID
      $('#InputNombreRol').addClass('is-invalid').removeClass('is-valid');
      $('#errorEdit').text('El nombre de rol ya está en uso').removeClass('d-none');
      return false;
    }
  }

  $('#InputNombreRol').removeClass('is-invalid').addClass('is-valid');
  $('#errorEdit').addClass('d-none');
  return true;
}

// Función para mostrar el modal de edición de rol
function editRole(id, name, estado, dashboard, roles, usuarios, productos, categorias, marcas, ventas) {
  $('#IdEditarRol').val(id);
  $('#InputNombreRol').val(name);
  $('#InputEstadoRol').val(estado);
  $('#CheckDashboardEditar').prop('checked', dashboard === 'true');
  $('#CheckRolesEditar').prop('checked', roles === 'true');
  $('#CheckUsuariosEditar').prop('checked', usuarios === 'true');
  $('#CheckProductosEditar').prop('checked', productos === 'true');
  $('#CheckCategoriasEditar').prop('checked', categorias === 'true');
  $('#CheckMarcasEditar').prop('checked', marcas === 'true');
  $('#CheckVentasEditar').prop('checked', ventas === 'true');
  
  $('#EditarRol').modal('show');
}

// Evento de entrada para la validación en tiempo real
$('#InputNombreRol').on('input', validarEdicionRol);

// Evento de clic en el botón de confirmar
$('#BtnConfirmarEdit').on('click', () => {
  const id = $('#IdEditarRol').val();
  const roleName = $('#InputNombreRol').val().trim();
  const estado = $('#InputEstadoRol').val();
  const dashboard = $('#CheckDashboardEditar').is(':checked');
  const roles = $('#CheckRolesEditar').is(':checked');
  const usuarios = $('#CheckUsuariosEditar').is(':checked');
  const productos = $('#CheckProductosEditar').is(':checked');
  const categorias = $('#CheckCategoriasEditar').is(':checked');
  const marcas = $('#CheckMarcasEditar').is(':checked');
  const ventas = $('#CheckVentasEditar').is(':checked');

  // Obtener el nombre original del rol antes de abrir el modal
  const originalRoleName = $('#InputNombreRol').val().trim();
  // Verificar si el nombre ha cambiado
  if (roleName !== originalRoleName) {
    // Realizar la validación del nuevo nombre si ha cambiado
    if (!validarEdicionRol()) {
      return; // No continuar si la validación falla
    }
  }

  const roleData = {
    nombre: roleName,
    estado: estado,
    permisos: {
      dashboard: dashboard,
      roles: roles,
      usuarios: usuarios,
      productos: productos,
      categorias: categorias,
      marcas: marcas,
      ventas: ventas,
    },
  };

  fetch(`http://localhost:8080/roles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(roleData),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error('El nombre del rol ya está en uso');
    }
    return response.json();
  })
  .then((json) => {
    location.reload();
    // Manejar la respuesta de la solicitud de edición del rol
  })
  .catch((error) => {
    console.error(error);
    $('#InputNombreRol').addClass('is-invalid').removeClass('is-valid');
    $('#errorEdit').text(error.message).removeClass('d-none');
  });
});



// Limpiar campos y mensajes de error al cerrar el modal
$('#EditarRol').on('hidden.bs.modal', function () {
  $('#InputNombreRol').val('');
  $('#InputEstadoRol').val('');
  $('#CheckDashboardEditar').prop('checked', false);
  $('#CheckRolesEditar').prop('checked', false);
  $('#CheckUsuariosEditar').prop('checked', false);
  $('#CheckProductosEditar').prop('checked', false);
  $('#CheckCategoriasEditar').prop('checked', false);
  $('#CheckMarcasEditar').prop('checked', false);
  $('#CheckVentasEditar').prop('checked', false);
  $('#InputNombreRol').removeClass('is-invalid is-valid');
  $('#errorEdit').addClass('d-none');
});




//FIN EDITAR-------------------------------------------------------

function deleteRole(id) {
  $("#EliminarRol").modal("show");
  $("#IdEliminarRol").val(id);
}

$("#BtnConfirmarDelete").on("click", () => {
  const id = $("#IdEliminarRol").val();
  fetch(`http://localhost:8080/roles/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((json) => {
      $("#EliminarRol").modal("hide");
      location.reload();
    });
});












