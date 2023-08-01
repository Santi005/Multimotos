const listRoles = () => {
  fetch('http://localhost:8080/roles/')
    .then((response) => response.json())
    .then((data) => {
      // Asegúrate de que data.data sea un arreglo válido
      if (Array.isArray(data.data)) {
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
  $("#BtnConfirmarAgregar").on("click", function(event) {
    event.preventDefault();
    event.stopPropagation();

    var inputAgregarNombreRol = $("#InputAgregarNombreRol");
    var error = $("#errorAdd");

    var roleName = inputAgregarNombreRol.val().trim();
    var alphanumericRegex = /^[a-zA-Z\s]*$/;

    if (roleName === "") {
      error.text("El campo no puede estar vacío.").removeClass("d-none");
      inputAgregarNombreRol.addClass("is-invalid");
      return;
    } else if (!alphanumericRegex.test(roleName)) {
      error.text("No se permiten caracteres especiales ni números.").removeClass("d-none");
      inputAgregarNombreRol.addClass("is-invalid");
      return;
    } else {
      error.text("").addClass("d-none");
      inputAgregarNombreRol.removeClass("is-invalid");
      $("#AgregarRol").modal("hide");

      var estado = $("#SelectAgregarEstadoRol").val();
      var dashboard = $("#CheckDashboard").is(":checked");
      var roles = $("#CheckRoles").is(":checked");
      var usuarios = $("#CheckUsuarios").is(":checked");
      var productos = $("#CheckProductos").is(":checked");
      var categorias = $("#CheckCategorias").is(":checked");
      var marcas = $("#CheckMarcas").is(":checked");
      var ventas = $("#CheckVentas").is(":checked");

      var roleData = {
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

      fetch("http://localhost:8080/roles", {
        method: "POST",
        body: JSON.stringify(roleData),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((json) => {
          location.reload();
          // Manejar la respuesta de la solicitud de agregar el rol
        })
        .catch((error) => {
          console.error(error);
        });
    }
  });
});



$(document).ready(function() {
  $("#BtnConfirmarEdit").on("click", function(event) {
    event.preventDefault();
    event.stopPropagation();

    var inputEditarNombreRol = $("#InputNombreRol");
    var error = $("#errorEdit");

    var roleName = inputEditarNombreRol.val().trim();
    var alphanumericRegex = /^[a-zA-Z\s]*$/; // Expresión regular para permitir solo letras y espacios

    if (roleName === "") {
      error.text("El campo no puede estar vacío.").removeClass("d-none");
      inputEditarNombreRol.addClass("is-invalid");
      return;
    } else if (!alphanumericRegex.test(roleName)) {
      error.text("No se permiten caracteres especiales ni números.").removeClass("d-none");
      inputEditarNombreRol.addClass("is-invalid");
      return;
    } else {
      error.text("").addClass("d-none");
      inputEditarNombreRol.removeClass("is-invalid");
      $("#EditarRol").modal("hide");

      var id = $("#IdEditarRol").val();
      var estado = $("#InputEstadoRol").val();
      var dashboard = $("#CheckDashboardEditar").is(":checked");
      var roles = $("#CheckRolesEditar").is(":checked");
      var usuarios = $("#CheckUsuariosEditar").is(":checked");
      var productos = $("#CheckProductosEditar").is(":checked");
      var categorias = $("#CheckCategoriasEditar").is(":checked");
      var marcas = $("#CheckMarcasEditar").is(":checked");
      var ventas = $("#CheckVentasEditar").is(":checked");

      var roleData = {
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
        method: "PUT",
        body: JSON.stringify(roleData),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((json) => {
          location.reload();
          // Manejar la respuesta de la solicitud de edición del rol
        })
        .catch((error) => {
          console.error(error);
        });
    }
  });
});


function editRole(id, name, estado, dashboard, roles, usuarios, productos, categorias, marcas, ventas) {
  console.log('Dashboard:', dashboard);
  $("#EditarRol").modal("show");
  $("#IdEditarRol").val(id);
  $("#InputNombreRol").val(name);

  // Establecer el valor del estado actual seleccionando la opción correspondiente
  $("#InputEstadoRol").val(estado);

  // Establecer el estado de cada checkbox de permisos
  $("#CheckDashboardEditar").prop("checked", dashboard === 'true');
  $("#CheckRolesEditar").prop("checked", roles === 'true');
  $("#CheckUsuariosEditar").prop("checked", usuarios === 'true');
  $("#CheckProductosEditar").prop("checked", productos === 'true');
  $("#CheckCategoriasEditar").prop("checked", categorias === 'true');
  $("#CheckMarcasEditar").prop("checked", marcas === 'true');
  $("#CheckVentasEditar").prop("checked", ventas === 'true');

  console.log("Valores de permisos:", {
    dashboard: dashboard,
    roles: roles,
    usuarios: usuarios,
    productos: productos,
    categorias: categorias,
    marcas: marcas,
    ventas: ventas,
  });
}

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