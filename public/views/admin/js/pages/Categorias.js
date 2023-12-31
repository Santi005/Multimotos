let categoriesData = [];

const listCategories = () => {
    fetch('http://localhost:8080/categories/')
    .then(response => response.json())
    .then(data => {

      if (Array.isArray(data.allCategories)) {
        categoriesData = data.allCategories;
        const tableBody = $('#CategoriesTable tbody');
        tableBody.empty();

        data.allCategories.forEach((category, index) => {
          let row = `
            <tr id='${category._id}'>
              <td>${index + 1}</td>
              <td>${category.NombreCategoria}</td>
              <td>
                <i data-bs-toggle="tooltip" data-bs-placement="top" title="Editar" onclick ="EditCategory('${category._id}', '${category.NombreCategoria}')" class="bi bi-pencil-square categorias" style="color:#f62d51; font-size: 1.3em; cursor: pointer;"></i>
                  &nbsp;&nbsp;
                <i data-bs-toggle="tooltip" data-bs-placement="top" title="Eliminar" onclick ="DeleteCategory('${category._id}')" class="bi bi-trash3 categorias"  style="color:#f62d51; font-size: 1.3em; cursor: pointer;"></i>
              </td>
            </tr>
          `;
          tableBody.append(row);
        });
        $("#CategoriesTable").DataTable({language: {
          url: "https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
        }});
      } 
      else {
        console.error('Los datos recibidos no contienen un arreglo válido.');
      }
    })
    .catch(error => {
      console.error(error);
    })
}


//AGREGAR-----------------------------------------------
$(document).ready(function() {
  const $inputCategoria = $('#InputAgregarNombreCategoria');
  const $errorAdd = $('#errorAdd');
  const $modalAgregarCategoria = $('#AgregarCategoria');
  const $btnConfirmarAdd = $('#BtnConfirmarAdd');

  // Función de validación
  function validarCategoria() {
    let nombreCategoria = $inputCategoria.val().trim();

    if (nombreCategoria === '') {
      $inputCategoria.addClass('is-invalid').removeClass('is-valid');
      $errorAdd.text('Ingrese un nombre para la categoría').removeClass('d-none');
      return false;
    } 

    for (const categoria of categoriesData) {
      if (categoria.NombreCategoria.toLowerCase() === nombreCategoria.toLowerCase()) {
        $inputCategoria.addClass('is-invalid').removeClass('is-valid');
        $errorAdd.text('El nombre de categoría ya está en uso').removeClass('d-none');
        return false;
      }      
    }

    $inputCategoria.removeClass('is-invalid').addClass('is-valid');
    $errorAdd.addClass('d-none');
    return true;
  
  }

  // Función para agregar una categoría
  async function agregarCategoria() {
    let _datos = {
      NombreCategoria: $inputCategoria.val()
    };
    await Swal.fire('Categoría agregada')
    location.reload();
    fetch('http://localhost:8080/categories/', {
      method: "POST",
      body: JSON.stringify(_datos),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then(response => response.json())
    .then(json => {

      $modalAgregarCategoria.modal('hide');
      location.reload();
    })
    .catch(error => {
      console.error('Error al agregar la categoría:', error);
    });
  }

  // Reinicializar la validación al cerrar el modal
  $modalAgregarCategoria.on('hidden.bs.modal', function () {
    $inputCategoria.val(''); // Limpiar el valor del campo de entrada
    $inputCategoria.removeClass('is-invalid is-valid'); // Eliminar las clases de validación
    $errorAdd.addClass('d-none'); // Ocultar el mensaje de error
  });

  // Evento de entrada para la validación en tiempo real
  $inputCategoria.on('input', validarCategoria);

  // Evento de clic en el botón de confirmar
  $btnConfirmarAdd.on('click', () => {
    if (validarCategoria()) {
      agregarCategoria();
    }
  });
});
//---------------------------------------------------------


//EDITAR-------------------------------------------------------

function validarEdicionCategoria(nombreCategoria) {
  if (nombreCategoria === '') {
    $('#InputEditarNombreCategoria').addClass('is-invalid').removeClass('is-valid');
    $('#errorEdit').text('Ingrese un nombre para la categoría').removeClass('d-none');
    return false;
  }

  const $rows = $('#CategoriesTable tbody tr');
  for (let i = 0; i < $rows.length; i++) {
    const nombreCategoriaEnTabla = $rows.eq(i).find('td:eq(1)').text().trim();
    if (nombreCategoriaEnTabla.toLowerCase() === nombreCategoria.toLowerCase()) {
      $('#InputEditarNombreCategoria').addClass('is-invalid').removeClass('is-valid');
      $('#errorEdit').text('El nombre de categoría ya está en uso.').removeClass('d-none');
      return false;
    }
  }

  $('#InputEditarNombreCategoria').removeClass('is-invalid').addClass('is-valid');
  $('#errorEdit').addClass('d-none');
  return true;
}



 function EditCategory(id, name) {
  $('#IdEditarCategoria').val(id); 
  $('#InputEditarNombreCategoria').val(name); 
  $('#EditarCategoria').modal('show');
}

$(document).ready(function () {
  $('#InputEditarNombreCategoria').on('input', function  () {
    const nombreCategoria = $(this).val().trim();
    validarEdicionCategoria(nombreCategoria);
  });
});

$('#BtnConfirmarEdit').on('click',async () => {
  const nombreCategoria = $('#InputEditarNombreCategoria').val().trim();
  validarEdicionCategoria(nombreCategoria);

  if ( $('.is-invalid').length === 0) {
    // Realizar el proceso de edición si no hay errores de validación
    const id = $('#IdEditarCategoria').val();
    const nameCategory = $('#InputEditarNombreCategoria').val();

    await Swal.fire('Categoría editada')
    location.reload();
    fetch(`http://localhost:8080/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ NombreCategoria: nameCategory })
    })
    
    .then(response => {
      if (!response.ok) {
        throw new Error('El nombre de la categoría ya está en uso');
      }
      return response.json();
    })
    .then(data => {
      console.log('Categoría editada:', data);
      $('#EditarCategoria').modal('hide');
      location.reload();
    })
    .catch(error => {
      console.error(error);
      $('#InputEditarNombreCategoria').addClass('is-invalid').removeClass('is-valid');
      $('#errorEdit').text(error.message).removeClass('d-none');
    });
  }
});

$('#EditarCategoria').on('hidden.bs.modal', function () {
  $('#InputEditarNombreCategoria').val('');
  $('#InputEditarNombreCategoria').removeClass('is-invalid is-valid');
  $('#errorEdit').addClass('d-none');
});
//------------------------------------------------------------

//ELIMINAR---------------------------------------------------
function DeleteCategory(id) {
  $('#EliminarCategoria').modal('show');
  $('#IdEliminarCategoria').val(id);
  $('#errorDelete').addClass('d-none'); 
  }
  
  $('#BtnConfirmarDelete').on('click',  () => {
  const id = $('#IdEliminarCategoria').val();
  
  
  fetch(`http://localhost:8080/categories/${id}`, {
    method: 'DELETE',
  })
  .then((res) => res.json())
  .then(async (res) => {
    if (!res.ok) {
      $('#errorDelete').text('La categoría no se puede eliminar ya que está asociada a un producto').removeClass('d-none');
    } 
    else  {
      $('#EliminarCategoria').modal('hide');
      await Swal.fire('Categoría eliminada')
      location.reload();
    }
  });
});
//---------------------------------------------------------------