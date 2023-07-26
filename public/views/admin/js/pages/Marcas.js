
//Método listar -------------------------------------------
const PAGE_SIZE = 5; // Tamaño de página
let currentPage = 1; // Página actual
let totalPages = 0; // Total de páginas
let marksData = []; // Almacena los datos de todas las marcas
let filteredMarksData = []; // Almacena los datos de las marcas filtradas

const listMarks = () => {
    fetch('http://localhost:8080/marks/')
        .then(response => response.json())
        .then(data => {

            if(Array.isArray(data.allMarks)) {
                marksData = data.allMarks;

                // Obtiene la búsqueda del usuario
                const searchValue = $('#search-input-mark').val().toLowerCase();

                if (searchValue !== '') {
                    // Filtra las marcas
                    filteredMarksData = marksData.filter(mark => {
                        return mark.NombreMarca.toLowerCase().includes(searchValue);
                    });
                } else {
                    // Muestra todas las marcas si no hay una búsqueda
                    filteredMarksData = [...marksData];
                }

                // Calcula el total de marcas y total de páginas
                const totalMarks = filteredMarksData.length;
                totalPages = Math.ceil(totalMarks / PAGE_SIZE);

                // Ajusta el número de página según la búsqueda
                if (currentPage > totalPages) {
                    currentPage = totalPages;
                }

                // Calcula el índice inicial y final de las marcas a mostrar en la página
                const startIndex = (currentPage - 1) * PAGE_SIZE;
                const endIndex = Math.min(startIndex + PAGE_SIZE, totalMarks);

                // Limpiar la tabla antes de cargar los nuevos datos
                const tableBody = document.getElementById('MarksTable').getElementsByTagName('tbody')[0];
                tableBody.innerHTML = '';

                if (filteredMarksData.length > 0) {
                    // Recorre las marcas que se van a mostrar en la página actual y genera la tabla
                    for (let i = startIndex; i < endIndex; i++) {
                        const mark = filteredMarksData[i];

                        // Verifica si la marca existe antes de acceder a sus propiedades
                        if (mark) {
                            let imageTags = mark.Imagenes.map(image => `<img src="${window.location.origin}/public/uploads/${image}" alt="${image}" width="100">`).join('');
                            let row = `
                                <tr id='${mark._id}'>
                                    <td>${i + 1}</td>
                                    <td>${mark.NombreMarca}</td>
                                    <td>${imageTags}</td>
                                    <td>
                                        <i onclick ="EditMark('${mark._id}', '${mark.NombreMarca}', '${mark.Imagenes}')" 
                                        class="fas fa-edit fa-lg marcas" style="color:#f62d51;" ></i>

                                        &nbsp;&nbsp;&nbsp;

                                        <i onclick ="DeleteMark('${mark._id}')" 
                                        class="fas fa-minus-circle fa-lg marcas"  style="color:#f62d51;" ></i>
                                    </td>
                                </tr>
                            `;
                            tableBody.innerHTML += row;
                        }
                    }
                } else {
                    // Muestra un mensaje cuando no se encuentran marcas
                    tableBody.innerHTML = `
                        <tr>
                            <td colspan="4">No se encontraron marcas.</td>
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

                    // Se agrega a cada página para cambiar la página actual y listar las marcas correspondientes
                    li.addEventListener('click', () => {
                        currentPage = i;
                        listMarks();
                    });

                    paginationContainer.appendChild(li);
                }
            }
        })
        .catch(error => {
            console.log(error);
        });
};

// Método buscar
// Se ejecuta cuando se usa el input de búsqueda
$('#search-input-mark').on('input', function () {
    currentPage = 1; // Reinicia la página al hacer una nueva búsqueda
    listMarks(); // Lista las marcas buscadas
});

// Llama a la función listMarks cuando la página se haya cargado completamente
document.addEventListener('DOMContentLoaded', () => {
    listMarks();
});

//-----------------------------------------------------------


//Método validar marca repetida -------------------------------------------
$(document).ready(function() {
    // Función de validación de marca
    function validarMarca() {
        let nombreMarca = $('#NombreMarca').val().trim();
        let inputMarca = $('#NombreMarca');

        if (nombreMarca === '') {
            inputMarca.addClass('is-invalid').removeClass('is-valid');
            $('#errorAdd').text('El campo de nombre de marca no puede estar vacío').removeClass('d-none');
            $('#errorAddFile').text('El campo de imagen no puede estar vacío').removeClass('d-none');
            return false;
        }

        // Validar existencia de la marca (agrega tu lógica de validación aquí)
        // ...

        inputMarca.removeClass('is-invalid').addClass('is-valid');
        $('#errorAdd').addClass('d-none');
        $('#errorAddFile').addClass('d-none');
        return true;
    }

    // Reinicializar la validación al abrir el modal de marca
    $('#AgregarMarca').on('shown.bs.modal', function () {
        reiniciarValidacionMarca();
    });

    // Evento de entrada para la validación en tiempo real de la marca
    $('#NombreMarca').on('input', validarMarca);

    // Evento de clic en el botón de confirmar de marca
    $('#BtnConfirmarAdd').on('click', () => {
        // Llamada a la función de validación de marca
        if (validarMarca()) {
            // Verificar si el nombre de marca ya está registrado
            const nombreMarca = $('#NombreMarca').val();
            const archivoImagen = $('#FormFileAdd')[0].files[0];
            const formData = new FormData();
            formData.append('NombreMarca', nombreMarca);
            formData.append('Imagenes', archivoImagen);

            $.ajax({
                url: 'http://localhost:8080/marks/',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (json) {
                    console.log(json);
                    reiniciarValidacionMarca();
                    $('#NombreMarca').val('');
                    $('#FormFileAdd').val('');
                    $('#AgregarMarca').modal('hide');
                    location.reload();
                }
            });
        }
    });

    // Función para reinicializar la validación de marca
    function reiniciarValidacionMarca() {
        $('#NombreMarca').val(''); // Limpiar el valor del campo de entrada
        $('#NombreMarca').removeClass('is-invalid is-valid'); // Eliminar las clases de validación
        $('#FormFileAdd').removeClass('is-invalid is-valid'); // Eliminar las clases de validación
        $('#errorAdd').addClass('d-none').text(''); // Ocultar el mensaje de error y eliminar el texto
        $('#errorAddFile').addClass('d-none').text(''); // Ocultar el mensaje de error del archivo y eliminar el texto
    
        // Remover la clase 'is-invalid' del input manualmente
        $('#NombreMarca').removeClass('is-invalid');
        $('#FormFileAdd').removeClass('is-invalid');
    }
    
    
});



//-----------------------------------------------------------



//Método editar y validación de campo vacio -------------------------------------------
function EditMark(id, name, image) {
    $('#EditarMarca').modal('show');
    $('#IdEditarMarca').val(id);
    $('#InputEditarNombreMarca').val(name);
    $('#formFileEdit').val(image);
}

$(document).ready(function () {
    'use strict';

    $('.needs-validation').on('submit', function (event) {
        event.preventDefault();

        var form = this;
        if (form.checkValidity()) {
            const id = $('#IdEditarMarca').val();
            const nameMark = $('#InputEditarNombreMarca').val();
            const image = $('#formFileEdit')[0].files[0];

            const formData = new FormData();
            formData.append('NombreMarca', nameMark);

            if (image) {
                formData.append('Imagenes', image);
            }

            fetch(`http://localhost:8080/marks/${id}`, {
                method: 'PUT',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Marca editada:', data);

                    $('#EditarMarca').modal('hide');
                    location.reload();
                })
                .catch(error => {
                    console.error(error);
                });
        }
        else {
            // Agregar la clase is-invalid a los campos no válidos
            $('#InputEditarNombreMarca').addClass('is-invalid');
            $('#formFileEdit').addClass('is-invalid');
        }

        form.classList.add('was-validated');
    });

    $('#EditarMarca').on('show.bs.modal', function () {
        var form = this.querySelector('.needs-validation');
        form.classList.remove('was-validated');

        $('#InputEditarNombreMarca').removeClass('is-invalid');
        $('#formFileEdit').removeClass('is-invalid');
    });
});
//-----------------------------------------------------------


//Método eliminar -------------------------------------------
function DeleteMark(id) {
    $('#EliminarMarca').modal('show')
    $('#IdEliminarMarca').val(id); //
}

$('#BtnConfirmarDelete').on('click', () => {
    const id = $('#IdEliminarMarca').val(); // Lo cambié a JQuery - Almaceno el id de la función.

    fetch(`http://localhost:8080/marks/${id}`, {
        method: 'DELETE',
    })

        .then(res => res.json())
        .then(res => {
            $('#EliminarMarca').modal('hide');
            location.reload()
            console.log(res);
        });
});
//-----------------------------------------------------------

listMarks() 








