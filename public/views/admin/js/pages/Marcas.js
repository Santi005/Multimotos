
//Método listar -------------------------------------------

const listMarks = () => {
    fetch('http://localhost:8080/marks/')
        .then(response => response.json())
        .then(data => {

            if(Array.isArray(data.allMarks)) {
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


//Método validar marca repetida -------------------------------------------
$(document).ready(function() {
    // Evento de clic en el botón de confirmar de marca
    $('#BtnConfirmarAdd').on('click', () => {
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

    // Reinicializar el formulario al abrir el modal de marca
    $('#AgregarMarca').on('shown.bs.modal', function () {
        $('#NombreMarca').val('');
        $('#FormFileAdd').val('');
    });
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
