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
                            <i onclick ="EditCategory('${category._id}', '${category.NombreCategoria}')" class="bi bi-pencil-square categorias" style="color:#f62d51; cursor: pointer;"></i>
                                &nbsp;&nbsp;
                            <i onclick ="DeleteCategory('${category._id}')" class="bi bi-trash3 categorias"  style="color:#f62d51; cursor: pointer;"></i>
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
            $errorAdd.text('El campo de nombre de categoría no puede estar vacío').removeClass('d-none');
            return false;
        }

        for (const categoria of categoriesData) {
            if (categoria.NombreCategoria === nombreCategoria) {
                $inputCategoria.addClass('is-invalid').removeClass('is-valid');
                $errorAdd.text('El nombre de categoría ya está en uso').removeClass('d-none');
                return false;
            }
        }

        // Opcional: Validar otros criterios (por ejemplo, longitud mínima, caracteres permitidos, etc.)

        $inputCategoria.removeClass('is-invalid').addClass('is-valid');
        $errorAdd.addClass('d-none');
        return true;
    }

    // Función para agregar una categoría
    function agregarCategoria() {
        let _datos = {
            NombreCategoria: $inputCategoria.val()
        };

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
            // Manejar el error aquí (opcional)
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

    //Agregar
    // Evento de clic en el botón de confirmar
    $btnConfirmarAdd.on('click', () => {
        // Llamada a la función de validación
        if (validarCategoria()) {
            agregarCategoria();
        }
    });
});
//---------------------------------------------------------


//EDITAR-------------------------------------------------------

function validarEdicionCategoria() {
    let nombreCategoria = $('#InputEditarNombreCategoria').val().trim();

    if (nombreCategoria === '') {
        $('#InputEditarNombreCategoria').addClass('is-invalid').removeClass('is-valid');
        $('#errorEdit').text('El campo de nombre de categoría no puede estar vacío').removeClass('d-none');
        return false;
    }

        const $rows = $('#tablaCategorias tbody tr');
    for (let i = 0; i < $rows.length; i++) {
        const nombreCategoriaEnTabla = $rows.eq(i).find('td:eq(1)').text().trim(); // Asumiendo que el nombre de categoría está en la segunda columna de la tabla (índice 1)
        if (nombreCategoriaEnTabla === nombreCategoria) {
            $('#InputEditarNombreCategoria').addClass('is-invalid').removeClass('is-valid');
            $('#errorEdit').text('El nombre de categoría ya está en uso en otra fila de la tabla').removeClass('d-none');
            return false;
        }
    }

    // Opcional: Puedes agregar otras validaciones aquí según tus necesidades.

    $('#InputEditarNombreCategoria').removeClass('is-invalid').addClass('is-valid');
    $('#errorEdit').addClass('d-none');
    return true;
}


function EditCategory(id, name) { // Agregué un nuevo parámetro y dividí la función del evento del click del modal.
    $('#EditarCategoria').modal('show');
    $('#IdEditarCategoria').val(id); // Se asigna el id.
    $('#InputEditarNombreCategoria').val(name); // Se asigna el nombre.
}


$('#BtnConfirmarEdit').on('click', () => {
    if (validarEdicionCategoria()) {
        const id = $('#IdEditarCategoria').val();
        const nameCategory = $('#InputEditarNombreCategoria').val();

        fetch(`http://localhost:8080/categories/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ NombreCategoria: nameCategory })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Categoría editada:', data);

            $('#EditarCategoria').modal('hide');
            location.reload();
        })
        .catch(error => {
            console.error(error);
        });
    }
});

$('#EditarCategoria').on('hidden.bs.modal', function () {
    $('#InputEditarNombreCategoria').val(''); // Limpiar el valor del campo de entrada
    $('#InputEditarNombreCategoria').removeClass('is-invalid is-valid'); // Eliminar las clases de validación
    $('#errorEdit').addClass('d-none'); // Ocultar el mensaje de error
});
//------------------------------------------------------------

//ELIMINAR---------------------------------------------------
function DeleteCategory(id){
    $('#EliminarCategoria').modal('show')
    $('#IdEliminarCategoria').val(id); //
}

$('#BtnConfirmarDelete').on('click', () => {
    const id = $('#IdEliminarCategoria').val(); // Lo cambié a JQuery - Almaceno el id de la función.

    fetch(`http://localhost:8080/categories/${id}`, {
        method: 'DELETE',
    })
    
    .then(res => res.json())
    .then(res=> {
        $('#EliminarCategoria').modal('hide');
        console.log(res);
        location.reload()
    });
});

//---------------------------------------------------------------