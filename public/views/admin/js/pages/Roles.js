let rolesData = []; 

const listRoles = () => {
  fetch('http://localhost:8080/roles/')
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data.data)) {
        rolesData = data.data;
        const tableBody = $("#RolesTable tbody");
        tableBody.empty(); 

        data.data.forEach((role, index) => {
          let row = `
            <tr id='${role._id}'>
              <td>${index + 1}</td>
              <td>${role.nombre}</td>
              <td>${role.estado}</td>
              <td>
          `;
        
          // Verificar si el rol es "Administrador", "Cliente" o "Empleado"
          if (role.nombre !== "Administrador" && role.nombre !== "Cliente" && role.nombre !== "Empleado") {
            row += `
              <i onclick="editRole('${role._id}', '${role.nombre}', '${role.estado}', '${role.permisos.dashboard}',
              '${role.permisos.roles}', '${role.permisos.usuarios}', '${role.permisos.productos}', 
              '${role.permisos.categorias}', '${role.permisos.marcas}', '${role.permisos.ventas}', '${role.permisos.pedidos}')" 
              class="bi bi-pencil-square role" style="color:#f62d51; font-size: 1.3em; cursor: pointer;"></i>
              &nbsp; &nbsp; 
              <i onclick="deleteRole('${role._id}')"
              class="bi bi-trash3 roles"  style="color:#f62d51;font-size: 1.3em; cursor: pointer;"></i>
            `;
          }
        
          row += `
              </td>
            </tr>
          `;
        
          tableBody.append(row);
        });
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
    } else if (roleName.length > 25) {
      $inputAgregarNombreRol.addClass('is-invalid').removeClass('is-valid');
      $errorAdd.text("El nombre del rol puede tener más de 25 caracteres.").removeClass("d-none");
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
  async function agregarRol() {
    const roleName = $inputAgregarNombreRol.val().trim();
    const estado = $('#SelectAgregarEstadoRol').val();
    const dashboard = $("#CheckDashboard").is(":checked");
    const roles = $("#CheckRoles").is(":checked");
    const usuarios = $("#CheckUsuarios").is(":checked");
    const productos = $("#CheckProductos").is(":checked");
    const categorias = $("#CheckCategorias").is(":checked");
    const marcas = $("#CheckMarcas").is(":checked");
    const ventas = $("#CheckVentas").is(":checked");
    const pedidos = $("#CheckPedidos").is(":checked");

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
        pedidos: pedidos,
      },
    };

    await Swal.fire('Rol agregado');

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




//INICIO EDITAR-------------------------------------------------------

// Función de validación para la edición de roles
function validarEdicionRol() {
  let roleName = $('#InputNombreRol').val().trim();
  let roleId = $('#IdEditarRol').val();

  if (roleName === '') {
    $('#InputNombreRol').addClass('is-invalid').removeClass('is-valid');
    $('#errorEdit').text('El campo no puede estar vacío.').removeClass('d-none');
    return false;
  } else if (roleName.length > 25) {
    $('#InputNombreRol').addClass('is-invalid').removeClass('is-valid');
    $('#errorEdit').text('El nombre del rol puede tener más de 25 caracteres.').removeClass('d-none');
    return false;
  }

  const originalRoleName = $('#InputNombreRol').data('original-name');

  if (roleName !== originalRoleName) {
    const $rows = $('#RolesTable tbody tr');
    for (let i = 0; i < $rows.length; i++) {
      const roleIdInTable = $rows.eq(i).find('td:eq(0)').text().trim();
      const roleNameInTable = $rows.eq(i).find('td:eq(1)').text().trim();

      if (roleNameInTable === roleName && roleIdInTable !== roleId) {
        $('#InputNombreRol').addClass('is-invalid').removeClass('is-valid');
        $('#errorEdit').text('El nombre de rol ya está en uso').removeClass('d-none');
        return false;
      }
    }
  }

  $('#InputNombreRol').removeClass('is-invalid').addClass('is-valid');
  $('#errorEdit').addClass('d-none');
  return true;
}

$('#InputNombreRol').on('input', validarEdicionRol);

// Función para mostrar el modal de edición de rol
function editRole(id, name, estado, dashboard, roles, usuarios, productos, categorias, marcas, ventas, pedidos) {
  $('#IdEditarRol').val(id);
  $('#InputNombreRol').val(name).data('original-name', name);
  $('#InputEstadoRol').val(estado).data('original-estado', estado);
  $('#CheckDashboardEditar').prop('checked', dashboard === 'true');
  $('#CheckRolesEditar').prop('checked', roles === 'true');
  $('#CheckUsuariosEditar').prop('checked', usuarios === 'true');
  $('#CheckProductosEditar').prop('checked', productos === 'true');
  $('#CheckCategoriasEditar').prop('checked', categorias === 'true');
  $('#CheckMarcasEditar').prop('checked', marcas === 'true');
  $('#CheckVentasEditar').prop('checked', ventas === 'true');
  $('#CheckPedidosEditar').prop('checked', pedidos === 'true');
  $('#EditarRol').modal('show');
}

// Evento de clic en el botón de confirmar (Guardar)
$('#BtnConfirmarEdit').on('click', async () => {
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
  const pedidos = $('#CheckPedidosEditar').is(':checked');
  
  const originalRoleName = $('#InputNombreRol').data('original-name');
  const originalRoleEstado = $('#InputEstadoRol').data('original-estado');
  
  if (roleName !== originalRoleName || estado !== originalRoleEstado) {
    if (!validarEdicionRol()) {
      return;
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
      pedidos: pedidos,
    },
  };

  await Swal.fire('Rol editado');

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
  })
  .catch((error) => {
    console.error(error);
    $('#InputNombreRol').addClass('is-invalid').removeClass('is-valid');
    $('#errorEdit').text(error.message).removeClass('d-none');
  });
});

// Limpiar campos y mensajes de error al cerrar el modal
$('#EditarRol').on('hidden.bs.modal', function () {
  $('#InputNombreRol').val('').removeData('original-name');
  $('#InputEstadoRol').val('');
  $('#CheckDashboardEditar').prop('checked', false);
  $('#CheckRolesEditar').prop('checked', false);
  $('#CheckUsuariosEditar').prop('checked', false);
  $('#CheckProductosEditar').prop('checked', false);
  $('#CheckCategoriasEditar').prop('checked', false);
  $('#CheckMarcasEditar').prop('checked', false);
  $('#CheckVentasEditar').prop('checked', false);
  $('#CheckPedidosEditar').prop('checked', false);
  $('#InputNombreRol').removeClass('is-invalid is-valid');
  $('#errorEdit').addClass('d-none');
});

$('#EditarRol').on('show.bs.modal', function (event) {
  const button = $(event.relatedTarget); // Botón que activó el modal
  const originalName = button.data('original-name');
  $('#InputNombreRol').data('original-name', originalName);
});

//FIN EDITAR-------------------------------------------------------



function deleteRole(id) {
  $("#EliminarRol").modal("show");
  $("#IdEliminarRol").val(id);
}

$("#BtnConfirmarDelete").on("click", async () => {
  const id = $("#IdEliminarRol").val();
  await Swal.fire('Producto eliminado');

  fetch(`http://localhost:8080/roles/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((json) => {
      $("#EliminarRol").modal("hide");
      location.reload();
    });
});












