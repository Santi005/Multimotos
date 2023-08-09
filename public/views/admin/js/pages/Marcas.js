let marksData = [];
//Método listar -------------------------------------------

const listMarks = () => {
    fetch('http://localhost:8080/marks/')
        .then(response => response.json())
        .then(data => {

            if(Array.isArray(data.allMarks)) {
                marksData = data.allMarks;
                const tableBody = $("#MarksTable tbody");
                tableBody.empty();

                data.allMarks.forEach((mark, index) => {

                    let imageTags = mark.Imagenes.map(image => `<img src="${window.location.origin}/public/uploads/${image}" alt="${image}" width="100">`).join('');
                    let row = `
                        <tr id='${mark._id}'>
                            <td>${index + 1}</td>
                            <td>${mark.NombreMarca}</td>
                            <td>${imageTags}</td>
                            <td>
                                <i onclick ="EditMark('${mark._id}', '${mark.NombreMarca}', '${mark.Imagenes}')" 
                                class="bi bi-pencil-square marcas" style="color:#f62d51; font-size: 1.3em; cursor: pointer;" ></i>
                                &nbsp;&nbsp;&nbsp;
                                <i onclick ="DeleteMark('${mark._id}')" 
                                class="bi bi-trash3  marcas"  style="color:#f62d51; font-size: 1.3em; cursor: pointer;" ></i>
                            </td>
                        </tr>
                    `;
                    tableBody.append(row);
                })
                $("#MarksTable").DataTable({language: {
                    url: "https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
                }});
                    }
                    else {
                        console.error('Los datos recibidos no contienen un arreglo válido.');
                    }
                })
        .catch(error => {
            console.log(error);
        });
};
//-----------------------------------------------------------
$(document).ready(function() {
    const $errorAdd = $('#errorAdd'); 
    const $errorAddFile = $('#errorAddFile'); 


    function validarNombreMarca() {
        const nombreMarca = $('#NombreMarca').val();

        if (nombreMarca.trim() === '') {
            $('#NombreMarca').addClass('is-invalid');
            $errorAdd.text('Ingrese un nombre para la marca').removeClass('d-none');

            return false;
        }

        for (const marca of marksData) {
            if (marca.NombreMarca === nombreMarca) {
                $('#NombreMarca').addClass('is-invalid');
                $errorAdd.text('El nombre de la marca ya está en uso').removeClass('d-none');

                return false;
            }
        }

        $('#NombreMarca').removeClass('is-invalid');
        $errorAdd.addClass('d-none');
        return true;
    }


    function validarArchivoImagen() {
        const archivoImagen = $('#FormFileAdd')[0].files[0];
        
        if (!archivoImagen) {
            $('#FormFileAdd').addClass('is-invalid');
            $errorAddFile.text('Ingrese una imagen').removeClass('d-none');

            return false;
        } else {
            $('#FormFileAdd').removeClass('is-invalid');

            return true;
        }  
    }

    function validarCampos() {
        const esNombreValido = validarNombreMarca();
        const esImagenValida = validarArchivoImagen();
        
        return esNombreValido && esImagenValida;
    }
    

    $('#NombreMarca').on('input', validarNombreMarca);
    $('#FormFileAdd').on('change', validarArchivoImagen);

    $('#BtnConfirmarAdd').on('click', () => {
        if (!validarCampos()) {
            return; // Evitar enviar el formulario si la validación falla
        }
        
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
                $('#NombreMarca').val('');
                $('#FormFileAdd').val('');
                $('#AgregarMarca').modal('hide');
                location.reload();
            }
        });
    });

    $('#AgregarMarca').on('show.bs.modal', function () {
        $('#NombreMarca').val('');
        $('#FormFileAdd').val('');

        // Reiniciar validaciones y ocultar mensajes de error
        $('#NombreMarca').removeClass('is-invalid');
        $('#FormFileAdd').removeClass('is-invalid');
        $errorAdd.addClass('d-none');
        $errorAddFile.addClass('d-none');

    });
});
//-----------------------------------------------------------

//Método editar y validación de campo vacio -------------------------------------------
function EditMark(id, name, image) {
    $('#EditarMarca').modal('show');
    $('#IdEditarMarca').val(id);
    $('#InputEditarNombreMarca').val(name);
    
    // Almacena la imagen original al mostrar el modal de edición
    $('#formFileEdit').data('original-image', image);
}
$('.needs-validation').on('submit', function (event) {
    event.preventDefault();

    var form = this;
    if (form.checkValidity()) {
        const id = $('#IdEditarMarca').val();
        const nameMark = $('#InputEditarNombreMarca').val();
        const image = $('#formFileEdit')[0].files[0];
        const originalImage = $('#formFileEdit').data('original-image'); // Obtiene la imagen original
        const $errorEdit = $('#errorEdit'); 


        const formData = new FormData();
        formData.append('NombreMarca', nameMark);

        // Agrega la imagen original si no se proporciona una nueva imagen
        if (!image && originalImage) {
            formData.append('Imagenes', originalImage);
        } else if (image) {
            formData.append('Imagenes', image);
        }
        const $rows = $('#MarksTable tbody tr');
        for (let i = 0; i < $rows.length; i++) {
          const nombreMarcaEnTabla = $rows.eq(i).find('td:eq(1)').text().trim(); // Asumiendo que el nombre de categoría está en la segunda columna de la tabla (índice 1)
          if (nombreMarcaEnTabla === nameMark) {
            $('#InputEditarNombreMarca').addClass('is-invalid').removeClass('is-valid');
            $('#errorEdit').text('El nombre de categoría ya está en uso.').removeClass('d-none');
            return false;
          }
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

    form.classList.add('was-validated');
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
