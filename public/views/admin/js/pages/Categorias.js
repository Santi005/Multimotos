
//LISTAR, BUSCAR Y PAGINACIÓN---------------------------------------------

const PAGE_SIZE = 5; // Tamaño de página
let currentPage = 1; // Página actual
let totalPages = 0; // Total de páginas
let categoriesData = []; // Almacena los datos de todas las categorías
let filteredCategoriesData = []; // Almacena los datos de las categorías filtradas

const listCategories = () => {






    
    //limpiar la tabla


    fetch('http://localhost:8080/categories/')
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data.allCategories)) {
                categoriesData = data.allCategories;

                // Obtiene la búsqueda del usuario
                const searchValue = $('#search-input-categories').val().toLowerCase();

                if (searchValue !== '') {
                    // Filtra las categorías
                    filteredCategoriesData = categoriesData.filter(category => {
                        return category.NombreCategoria.toLowerCase().includes(searchValue);
                    });
                } else {
                    // Muestra todas las categorías si no hay una búsqueda
                    filteredCategoriesData = [...categoriesData];
                }

                // Calcula el total de categorías y total de páginas
                const totalCategories = filteredCategoriesData.length;
                totalPages = Math.ceil(totalCategories / PAGE_SIZE);

                // Ajusta el número de página según la búsqueda
                if (currentPage > totalPages) {
                    currentPage = totalPages;
                }

                // Calcula el índice inicial y final de las categorías a mostrar en la página
                const startIndex = (currentPage - 1) * PAGE_SIZE;
                const endIndex = Math.min(startIndex + PAGE_SIZE, totalCategories);

                // Limpiar la tabla antes de cargar los nuevos datos
                const tableBody = document.getElementById('CategoriesTable').getElementsByTagName('tbody')[0];
                tableBody.innerHTML = '';

                if (filteredCategoriesData.length > 0) {
                    // Recorre las categorías que se van a mostrar en la página actual y genera la tabla
                    for (let i = startIndex; i < endIndex; i++) {
                        const category = filteredCategoriesData[i];

                        // Verifica si la categoría existe antes de acceder a sus propiedades
                        if (category) {
                            let row = `
                                <tr id='${category._id}'>
                                    <td>${i + 1}</td>
                                    <td>${category.NombreCategoria}</td>
                                    <td>
                                        <i onclick ="EditCategory('${category._id}', '${category.NombreCategoria}')" class="fas fa-edit fa-lg categorias" style="color:#f62d51;"></i>
                                        &nbsp;&nbsp;&nbsp;
                                        <i onclick ="DeleteCategory('${category._id}')" class="fas fa-minus-circle fa-lg categorias"  style="color:#f62d51;"></i>
                                    </td>
                                </tr>
                            `;
                            tableBody.innerHTML += row;
                        }
                    }
                } else {
                    // Muestra un mensaje cuando no se encuentran categorías
                    tableBody.innerHTML = `
                        <tr>
                            <td colspan="3">No se encontraron categorías.</td>
                        </tr>
                    `;
                }

                // Crea la sección de paginación
                const paginationContainer = document.getElementsByClassName('pagination')[0];
                paginationContainer.innerHTML = '';

                // Recorre el número total de páginas y crea el enlace para cambiar de página
                for (let i = 1; i <= totalPages; i++) {
                    const li = document.createElement('li');
                    const link = document.createElement('button');
                    link.href = '#';
                    link.style.fontSize = '15px';
                    link.style.backgroundColor = '#EBEBEA';
                    link.style.marginLeft = '4px';
                    link.classList.add('btn');

                    link.innerHTML = i;
                    li.appendChild(link);

                    // Agrega la clase 'active' a la página actual
                    if (i === currentPage) {
                        li.classList.add('active');
                    }

                    // Se agrega a cada página para cambiar la página actual y listar las categorías correspondientes
                    li.addEventListener('click', () => {
                        currentPage = i;
                        listCategories();
                    });

                    paginationContainer.appendChild(li);
                }
            }
        })
        .catch(error => {
            console.error(error);
        });
};

// Método buscar
// Se ejecuta cuando se usa el input de búsqueda
$('#search-input-categories').on('input', function () {
    currentPage = 1; // Reinicia la página al hacer una nueva búsqueda
    listCategories(); // Lista las categorías buscadas
});

// Llama a la función listCategories cuando la página se haya cargado completamente
document.addEventListener('DOMContentLoaded', () => {
    listCategories();
});

//-----------------------------------------------------



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


listCategories()






