//LISTAR
let productsData = [];

function listProducts(){
    fetch('http://localhost:8080/products/')
    .then(response => response.json())
    .then(data => {
        
        productsData = data.products;
        const tableBody = $("#ProductsTable tbody");
        tableBody.empty();
        productosConImagenes = {};


        data.products.forEach((product, index) => {
            //Toma la imagen
            let imageTags = product.Imagenes.map(image => `<img src="${window.location.origin}/public/uploads/${image}" alt="${image}" width="100" height="80">`).join('');
            
            let amount = $('#InputAumentarStock').val();

            //Validación de estado

            productosConImagenes[product._id] = product.Imagenes;

            let row = `
                        <tr id="${product._id}">
                            <td>${index + 1}</td>
                            <td>${product.NombreProducto}</td>
                            <td>${product.Categoria.NombreCategoria}</td>
                            <td>${product.Marca.NombreMarca}</td>
                            <td>${product.Precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
                            <td>${product.Estado}</td>
                            <td style="text-align:center;">
                            <div class="d-flex justify-content-center">
                                <i data-bs-toggle="tooltip" data-bs-placement="top" data-bs-class="btn" title="Editar" onclick="EditProduct('${product._id}', '${product.NombreProducto}', '${product.Descripcion}', '${product.Categoria}', '${product.Marca}', '${product.Precio}', '${product.Imagenes}')" class="bi bi-pencil-square productos" style="color:#f62d51; font-size: 1.3em; cursor: pointer;"></i>
                                &nbsp;&nbsp;&nbsp;
                                <i data-bs-toggle="tooltip" data-bs-placement="top" title="Eliminar" onclick="DeleteProduct('${product._id}')" class="bi bi-trash3 productos" style="color:#f62d51; font-size: 1.3em; cursor: pointer;"></i>
                                &nbsp;&nbsp;&nbsp;
                                <i data-bs-toggle="tooltip" data-bs-placement="top" title="Agregar stock" onclick="incrementarStock('${product._id}', '${amount}')" class="bi bi-box-seam productos" style="color:#f62d51; font-size: 1.3em; cursor: pointer;"></i>
                                &nbsp;&nbsp;&nbsp;
                                <a data-bs-toggle="tooltip" data-bs-placement="top" title="Ver detalles" class="productos" data-bs-toggle="modal" data-bs-target="#VerImagenes" id="Carrusel"><i class="bi bi-eye" style="color: #f62d51; font-size: 1.3em;"></i></a>&nbsp;&nbsp;&nbsp;
                                </div>
                                </td>
                        </tr>
                    `;
                    
                    
                    tableBody.append(row);


                    
        })
        if ($.fn.DataTable.isDataTable("#ProductsTable")) {
            $("#ProductsTable").DataTable().destroy();
        }
        
        $("#ProductsTable").DataTable({
            language: {
                url: "https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
            }
        });
    })
    .catch(error=>{
        console.error(error);
    })
}



$(document).on('click', '#Carrusel', function () {
    const idProducto = $(this).closest('tr').attr('id');

    if (productosConImagenes[idProducto]) {
        const product = productsData.find(p => p._id === idProducto);
        const imagenes = productosConImagenes[idProducto];
        mostrarInformacionYImagenes(product, imagenes);
    }
});

function mostrarInformacionYImagenes(product, imagenes) {


    // Actualiza la información del producto en el modal
    document.getElementById('productoNombre').textContent = product.NombreProducto;
    document.getElementById('productoDescripcion').textContent = product.Descripcion;
    document.getElementById('productoCategoria').textContent = product.Categoria.NombreCategoria;
    document.getElementById('productoMarca').textContent = product.Marca.NombreMarca;
    document.getElementById('productoPrecio').textContent = product.Precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
    document.getElementById('productoCantidad').textContent = product.Stock;
    document.getElementById('productoEstado').textContent = product.Estado;



    const carouselIndicators = $('#carouselIndicators');
    carouselIndicators.empty();

    const imagenCarrusel = $('#imagenCarrusel');
    imagenCarrusel.empty();

    imagenes.forEach((imagen, index) => {
        const indicatorClass = index === 0 ? 'active' : '';
    
        const indicator = `
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${index}" class="${indicatorClass}" aria-label="Slide ${index}"></button>
        `;
        carouselIndicators.append(indicator);
    
        const imageTag = `
            <div class="carousel-item ${indicatorClass}">
                <img src="${window.location.origin}/public/uploads/${imagen}"  class="d-block" alt="Imagen ${index}">
            </div>
        `;
        imagenCarrusel.append(imageTag);
    });
    
    

    const modal = new bootstrap.Modal(document.getElementById('VerImagenes'));
    modal.show();
}

//AGREGAR
$('#AgregarProducto').on('hidden.bs.modal', () => {
    // Limpiar estilos y mensajes de error
    $('#AddNombreProducto').removeClass('is-invalid');
    $('#errorAddNombre').addClass('d-none');
    
    $('#AddDescripcionProducto').removeClass('is-invalid');
    $('#errorAddDescripcion').addClass('d-none');
    
    $('#AddCantidadProducto').removeClass('is-invalid');
    $('#errorAddCantidad').addClass('d-none');
    
    $('#AddCategoriaProducto').removeClass('is-invalid');
    $('#errorAddCategoria').addClass('d-none');
    
    $('#AddMarcaProducto').removeClass('is-invalid');
    $('#errorAddMarca').addClass('d-none');
    
    $('#AddPrecioProducto').removeClass('is-invalid');
    $('#errorAddPrecio').addClass('d-none');
    
    $('#formFileAdd').removeClass('is-invalid');
    $('#errorAddFile').addClass('d-none');
});





$(document).ready(() => {
    // Agregar eventos input y change para validar en tiempo real
    $('#AddNombreProducto').on('input change', () => validateField($('#AddNombreProducto'), $('#errorAddNombre')));
    $('#AddDescripcionProducto').on('input change', () => validateField($('#AddDescripcionProducto'), $('#errorAddDescripcion')));
    $('#AddCantidadProducto').on('input change', () => validateField($('#AddCantidadProducto'), $('#errorAddCantidad')));
    $('#AddPrecioProducto').on('input change', () => validateField($('#AddPrecioProducto'), $('#errorAddPrecio')));
    $('#formFileAdd').on('input change', () => validateFileField($('#formFileAdd'), $('#errorAddFile')));
});

function validateField(inputElement, errorElement, errorMessage) {
    if (!inputElement.val()) {
        errorElement.text(errorMessage).removeClass('d-none');
        inputElement.addClass('is-invalid');
    } else {
        errorElement.addClass('d-none');
        inputElement.removeClass('is-invalid');
    }
}

function validateFileField(inputElement, errorElement, errorMessage) {
    const archivosImagen = inputElement[0].files;
    if (archivosImagen.length === 0) {
        errorElement.text(errorMessage).removeClass('d-none');
        inputElement.addClass('is-invalid');
    } else {
        errorElement.addClass('d-none');
        inputElement.removeClass('is-invalid');
    }
}

$('#BtnConfirmarAdd').on('click', () => {
    const nombreProducto = $('#AddNombreProducto').val();
    const descripcion = $('#AddDescripcionProducto').val();
    const stock = $('#AddCantidadProducto').val();
    const categoria = $('#AddCategoriaProducto').val();
    const marca = $('#AddMarcaProducto').val();
    const precio = $('#AddPrecioProducto').val();
    const archivosImagen = $('#formFileAdd')[0].files;
    
    // Realizar validación del formulario
    if (!nombreProducto || !descripcion || !stock || !precio || archivosImagen.length === 0) {
        // Validar el campo de Nombre de Producto
        if (!nombreProducto.trim()) {
            $('#errorAddNombre').text('Ingrese un nombre para el producto.').removeClass('d-none');
            $('#AddNombreProducto').addClass('is-invalid');
        } else {
            $('#errorAddNombre').addClass('d-none');
            $('#AddNombreProducto').removeClass('is-invalid');
        }
        
        // Validar el campo de Descripción
        if (!descripcion.trim()) {
            $('#errorAddDescripcion').text('Ingrese una descripción para el producto.').removeClass('d-none');
            $('#AddDescripcionProducto').addClass('is-invalid');
        } else {
            $('#errorAddDescripcion').addClass('d-none');
            $('#AddDescripcionProducto').removeClass('is-invalid');
        }
        
        // Validar el campo de Cantidad
        if (!stock.trim()) {
            $('#errorAddCantidad').text('Ingrese una cantidad para el producto.').removeClass('d-none');
            $('#AddCantidadProducto').addClass('is-invalid');
        } else {
            $('#errorAddCantidad').addClass('d-none');
            $('#AddCantidadProducto').removeClass('is-invalid');
        }
        
        // Validar el campo de Precio
        if (!precio.trim()) {
            $('#errorAddPrecio').text('Ingrese un precio para el producto.').removeClass('d-none');
            $('#AddPrecioProducto').addClass('is-invalid');
        } else {
            $('#errorAddPrecio').addClass('d-none');
            $('#AddPrecioProducto').removeClass('is-invalid');
        }
        
        // Validar el campo de Imagen
        if (archivosImagen.length === 0) {
            $('#errorAddFile').text('Debe seleccionar al menos una imagen para el producto.').removeClass('d-none');
            $('#formFileAdd').addClass('is-invalid');
        } else {
            $('#errorAddFile').addClass('d-none');
            $('#formFileAdd').removeClass('is-invalid');
        }
        
        return
    }

    for (const producto of productsData) {
        if (producto.NombreProducto === nombreProducto) {
            $('#AddNombreProducto').addClass('is-invalid');
            $('#errorAddNombre').text('El nombre del producto ya está en uso').removeClass('d-none');

            return false;
        }
    }
    

    
    // Si la validación pasa, proceder a crear FormData y enviar la solicitud
    const formData = new FormData();
    formData.append('NombreProducto', nombreProducto);
    formData.append('Descripcion', descripcion);
    formData.append('Stock', stock);
    formData.append('Categoria', categoria);
    formData.append('Marca', marca);
    formData.append('Precio', precio);
    
    for (let i = 0; i < archivosImagen.length; i++) {
        formData.append('Imagenes', archivosImagen[i]);
    }
    
    // Enviar los datos del formulario al servidor
    fetch('http://localhost:8080/products/', {
        method: 'POST',
        body: formData,
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        if (data.ok == 200) {
            listProducts();
        }
    })
    .catch((error) => {
        console.error(error);
    });
});



const fileInput = document.getElementById('formFileAdd');

fileInput.addEventListener('change', () => {
    const imagenesMaximas = 5;
    if (fileInput.files.length > imagenesMaximas) {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            didOpen: (toast) => {
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
          
          Toast.fire({
            icon: 'error',
            title: `Sólo se permiten ${imagenesMaximas} imagenes.`
          });
        fileInput.value = '';
    }
});






//EDITAR


function EditProduct(id, name, description, category, mark, price, images) {
    $('#EditarProducto').modal('show');
    $('#IdEditarProducto').val(id);
    $('#EditNombreProducto').val(name);
    $('#EditDescripcionProducto').val(description);
    $('#EditPrecioProducto').val(price);
    $('#EditformFile').val();



    // Obtener el elemento de selección de marca
    const marcaProductoSelect = document.getElementById('EditMarcaProducto');

    // Establecer la opción seleccionada en el elemento de selección de marca
    for (let i = 0; i < marcaProductoSelect.options.length; i++) {
        if (marcaProductoSelect.options[i].value === mark) {
            marcaProductoSelect.selectedIndex = i;
            break;
        }
    }

    // Obtener el elemento de selección de categoría
    const categoriaProductoSelect = document.getElementById('EditCategoriaProducto');

    // Establecer la opción seleccionada en el elemento de selección de categoría
    for (let i = 0; i < categoriaProductoSelect.options.length; i++) {
        if (categoriaProductoSelect.options[i].value === category) {
            categoriaProductoSelect.selectedIndex = i;
            break;
        }
    }

}
$(document).ready(() => {

function resetValidation() {
    $('#EditNombreProducto').removeClass('is-invalid');
    $('#errorEditNombre').addClass('d-none');

    $('#EditDescripcionProducto').removeClass('is-invalid');
    $('#errorEditDescripcion').addClass('d-none');

    $('#EditPrecioProducto').removeClass('is-invalid');
    $('#errorEditPrecio').addClass('d-none');
}

$('#EditarProducto').on('hidden.bs.modal', () => {
    resetValidation();
});

$('#EditNombreProducto').on('blur', function () {
    if ($(this).data('interactive') === 'true') {
        validarNombreUnico($(this).val());
    }
});

$('#EditNombreProducto').on('focus', function () {
    $(this).data('interactive', 'true');
});


function resetFieldValidation(fieldId, errorId) {
    $(fieldId).removeClass('is-invalid');
    $(errorId).addClass('d-none');
}

$('#EditarProducto').on('hidden.bs.modal', () => {
    resetValidation();
});

$('#EditNombreProducto').on('input', () => {
    resetFieldValidation('#EditNombreProducto', '#errorEditNombre');
});

$('#EditDescripcionProducto').on('input', () => {
    resetFieldValidation('#EditDescripcionProducto', '#errorEditDescripcion');
});

$('#EditPrecioProducto').on('input', () => {
    resetFieldValidation('#EditPrecioProducto', '#errorEditPrecio');
});

function isNameUnique(nameProduct) {
    const $rows = $('#ProductsTable tbody tr');
    for (let i = 0; i < $rows.length; i++) {
        const nombreProductoEnTabla = $rows.eq(i).find('td:eq(1)').text().trim();
        if (nombreProductoEnTabla === nameProduct) {
            return false;
        }
    }
    return true;
}


$('#BtnConfirmarEdit').on('click', async (event) => {    
    event.preventDefault();

    let isValid = true; // Variable para rastrear la validez de los campos

    // Obtén los valores de los campos
    const idEdit = $('#IdEditarProducto').val();
    const nameProductEdit = $('#EditNombreProducto').val();
    const descriptionEdit = $('#EditDescripcionProducto').val();
    const priceEdit = $('#EditPrecioProducto').val();
    const marcaEdit = $('#EditMarcaProducto').val();
    const categoriaEdit = $('#EditCategoriaProducto').val();


    // Realiza la validación de los campos
    if ($('#EditNombreProducto').data('interactive') === 'true') {
        if (!nameProductEdit.trim()) {
            $('#errorEditNombre').text('Ingrese un nombre para el producto.').removeClass('d-none');
            $('#EditNombreProducto').addClass('is-invalid');
            isValid = false;
        } else if (!isNameUnique(nameProductEdit)) {
            $('#errorEditNombre').text('El nombre del producto ya está en uso.').removeClass('d-none');
            $('#EditNombreProducto').addClass('is-invalid');
            isValid = false;
        } else {
            $('#errorEditNombre').addClass('d-none');
            $('#EditNombreProducto').removeClass('is-invalid');
        }
    }
    
    if (!descriptionEdit.trim()) {
        $('#errorEditDescripcion').text('Ingrese una descripción para el producto.').removeClass('d-none');
        $('#EditDescripcionProducto').addClass('is-invalid');
        isValid = false;
    } else {
        $('#errorEditDescripcion').addClass('d-none');
        $('#EditDescripcionProducto').removeClass('is-invalid');
    }
    
    if (!priceEdit.trim()) {
        $('#errorEditPrecio').text('Ingrese un precio para el producto.').removeClass('d-none');
        $('#EditPrecioProducto').addClass('is-invalid');
        isValid = false;
    } else {
        $('#errorEditPrecio').addClass('d-none');
        $('#EditPrecioProducto').removeClass('is-invalid');
    }

    if (!isValid) {
        return; // Detener el envío del formulario si no es válido
    }

    const imagesEdit = $('#EditformFile')[0].files;
    

    const formData = new FormData();
    formData.append('NombreProducto', nameProductEdit);
    formData.append('Descripcion', descriptionEdit);
    formData.append('Precio', priceEdit);

    // Verificar si se ha seleccionado una nueva imagen
    if (imagesEdit.length > 0) {
        for (let i = 0; i < imagesEdit.length; i++) {
            formData.append('Imagenes', imagesEdit[i]);
        }
    }

    formData.append('Marca', marcaEdit);
    formData.append('Categoria', categoriaEdit);

    try {
        const response = await fetch(`http://localhost:8080/products/${idEdit}`, {
            method: 'PUT',
            body: formData
        });

        const data = await response.json();
        console.log('Producto editado:', data);

        if (data.ok == 200) {
            listProducts();
            $('#EditarProducto').modal('hide'); // Cerrar el modal
            location.reload(); // Recargar la página
        }
    } catch (error) {
        console.error(error);
    }
});

});



const fileInputEdit = document.getElementById('EditformFile');

fileInputEdit.addEventListener('change', () => {
    const imagenesMaximas = 5;
    if (fileInputEdit.files.length > imagenesMaximas) {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            didOpen: (toast) => {
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
          
          Toast.fire({
            icon: 'error',
            title: `Sólo se permiten ${imagenesMaximas} imagenes.`
          });
        fileInputEdit.value = '';
    }
});

//ELIMINAR
function DeleteProduct(id) {
    $('#EliminarProducto').modal('show');
    $('#IdEliminarProducto').val(id);
}

$('#BtnConfirmarDelete').on('click', () => {
    const id = $('#IdEliminarProducto').val();

    fetch(`http://localhost:8080/products/${id}`, {
        method: 'DELETE',
    })
    .then(res => res.json())
    .then(data => {
        $('#EliminarProducto').modal("hide");
        console.log(data);
        if (data.ok == 200) {
            listProducts(); // Actualizar la lista de productos después de eliminar
        }
    });
    
});


//AUMENTAR STOCK
function incrementarStock(id, amount) {
    $('#IdAumentarStock').val(id);
    $('#InputAumentarStock').val(amount);
    $('#AumentarStock').modal('show');
}

$('#BtnConfirmaEditStock').on('click', () => {
    const id = $('#IdAumentarStock').val();
    amount = $('#InputAumentarStock').val(); // Obtener el valor de amount desde el input

    const data = { amount: amount };

    fetch(`http://localhost:8080/products/${id}/incrementar-stock`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if(data.ok == 200){
                listProducts()
            }
            // Realiza cualquier acción adicional necesaria después de incrementar el stock
        })
        .catch(error => {
            console.error(error);
            // Maneja el error de alguna manera adecuada
        });
});

function mascara(o, f) {
    v_obj = o;
    v_fun = f;
    setTimeout(execmascara, 1);
}

function execmascara() {
    v_obj.value = v_fun(v_obj.value);
}

function cpf(v) {
    v = v.replace(/[^\d]/g, ''); // Eliminar todos los caracteres no numéricos
    v = v.replace(/^0+/g, ''); // Eliminar ceros iniciales
    
    if (v.length > 3) {
        // Agregar puntos después de cada tres dígitos para los miles
        v = v.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    
    if (v.length > 6) {
        // Agregar comas después de cada tres dígitos para los millones
        v = v.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
    
    return "$" + v; // Agregar el signo de pesos al inicio
}

function convertirANumero(valor) {
    return parseFloat(valor.replace(/[^\d,]/g, '').replace(/\./g, '').replace(',', '.'));
}

function convertirYActualizarEdicion(inputElement) {
    let valorFormateado = inputElement.value;
    
    // Elimina el signo de pesos y otros caracteres no numéricos
    let valorNumerico = parseInt(valorFormateado.replace(/[^\d]/g, ''));
    
    // Formatea el valor como texto con el signo de pesos y asigna al input
    inputElement.value = "$" + cpf(valorNumerico.toString());
}

// Evento de entrada para aplicar formateo mientras se escribe
// Evento de entrada para aplicar formateo mientras se escribe
$('#EditPrecioProducto').on('input', () => {
    mascara($('#EditPrecioProducto')[0], cpf);
});

// Evento de salida para quitar el formato y convertir el valor
$('#EditPrecioProducto').on('blur', () => {
    let inputElement = $('#EditPrecioProducto')[0];
    let valorFormateado = inputElement.value;
    let valorNumerico = parseInt(valorFormateado.replace(/[^\d]/g, ''));
    inputElement.value = valorNumerico;
});



function convertirYActualizar(inputElement) {
    let valorFormateado = inputElement.value;
    let valorNumerico = parseInt(valorFormateado.replace(/[^\d]/g, ''));
    inputElement.value = valorNumerico;
}


