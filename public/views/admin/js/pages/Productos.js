//LISTAR
let productData = [];

const listProducts = async () => {
    const response = await fetch('http://localhost:8080/products/');
    const data = await response.json();
    productData = data.products;
    productosConImagenes = {};
    
    productData.forEach((product, index) => {

        let imageTags = product.Imagenes.map(image => `<img src="${window.location.origin}/public/uploads/${image}" alt="${image}" width="100" height="80">`).join('');
        let amount = $('#InputAumentarStock').val();
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
                        <i data-bs-toggle="tooltip" data-bs-placement="top" data-bs-class="btn" title="Editar" onclick="EditProduct('${product._id}', '${product.NombreProducto}', '${product.Descripcion}', '${product.Categoria.NombreCategoria}', '${product.Marca.NombreMarca}', '${product.Precio}', '${product.Imagenes}')" class="bi bi-pencil-square productos" style="color:#f62d51; font-size: 1.3em; cursor: pointer;"></i>
                        &nbsp;&nbsp;&nbsp;
                        <i data-bs-toggle="tooltip" data-bs-placement="top" title="Eliminar" onclick="DeleteProduct('${product._id}')" class="bi bi-trash3 productos" style="color:#f62d51; font-size: 1.3em; cursor: pointer;"></i>
                        &nbsp;&nbsp;&nbsp;
                        <i data-bs-toggle="tooltip" data-bs-placement="top" title="Agregar stock" onclick="incrementarStock('${product._id}', '${amount}')" class="bi bi-box-seam productos" style="color:#f62d51; font-size: 1.3em; cursor: pointer;"></i>
                        &nbsp;&nbsp;&nbsp;
                        <a data-bs-toggle="tooltip" data-bs-placement="top" title="Ver detalles" class="productos" onclick="productDetails('${product._id}');" id="viewDetails"><i class="bi bi-eye" style="color: #f62d51; font-size: 1.3em;"></i></a>&nbsp;&nbsp;&nbsp;
                    </div>
                </td>
            </tr>
        `;

        $('#ProductsTable tbody').append(row);
    });
    $("#ProductsTable").DataTable({language: {
        url: "https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
    }});
}

// AGREGAR
$('#AgregarProducto').on('hidden.bs.modal', () => {

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

$('#BtnConfirmarAddModal').on('click', async () => {
    const nombreProducto = $('#AddNombreProducto').val();
    const descripcion = $('#AddDescripcionProducto').val();
    const stock = $('#AddCantidadProducto').val();
    const categoria = $('#AddCategoriaProducto').val();
    const marca = $('#AddMarcaProducto').val();
    const precio = $('#AddPrecioProducto').val();
    const archivosImagen = $('#formFileAdd')[0].files;

    if (!nombreProducto || !descripcion || !stock || !precio || archivosImagen.length === 0) {

    
        if (!nombreProducto.trim()) {
            $('#errorAddNombre').text('Ingrese un nombre para el producto.').removeClass('d-none');
            $('#AddNombreProducto').addClass('is-invalid');
        } else {
            $('#errorAddNombre').addClass('d-none');
            $('#AddNombreProducto').removeClass('is-invalid');
        }
        
                
        if (!descripcion.trim()) {
            $('#errorAddDescripcion').text('Ingrese una descripción para el producto.').removeClass('d-none');
            $('#AddDescripcionProducto').addClass('is-invalid');
        } else {
            $('#errorAddDescripcion').addClass('d-none');
            $('#AddDescripcionProducto').removeClass('is-invalid');
        }
                
        if (!stock.trim()) {
            $('#errorAddCantidad').text('Ingrese una cantidad para el producto.').removeClass('d-none');
            $('#AddCantidadProducto').addClass('is-invalid');
        } else {
            $('#errorAddCantidad').addClass('d-none');
            $('#AddCantidadProducto').removeClass('is-invalid');
        }
                
        if (!precio.trim()) {
            $('#errorAddPrecio').text('Ingrese un precio para el producto.').removeClass('d-none');
            $('#AddPrecioProducto').addClass('is-invalid');
        } else {
            $('#errorAddPrecio').addClass('d-none');
            $('#AddPrecioProducto').removeClass('is-invalid');
        }
                
        if (archivosImagen.length === 0) {
            $('#errorAddFile').text('Debe seleccionar al menos una imagen para el producto.').removeClass('d-none');
            $('#formFileAdd').addClass('is-invalid');
        } else {
            $('#errorAddFile').addClass('d-none');
            $('#formFileAdd').removeClass('is-invalid');
        }
                
        return
    }
    for (const producto of productData) {
        if (producto.NombreProducto === nombreProducto) {
            $('#AddNombreProducto').addClass('is-invalid');
            $('#errorAddNombre').text('El nombre del producto ya está en uso').removeClass('d-none');

            return false;
        }
    }

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

    registrarProducto(formData);
    
    
});

async function registrarProducto (formData) {
    await Swal.fire('Producto agregado')
    location.reload();
    const responseProducts = await fetch('http://localhost:8080/products/', {
        method: 'POST',
        body: formData,
    });

    const data = await responseProducts.json();
}

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



// EDITAR
let originalName = '';
let newName = '';

function EditProduct(id, name, description, category, mark, price, images) {
    $('#EditarProducto').modal('show');
    $('#IdEditarProducto').val(id);
    $('#EditNombreProducto').val(name);
    $('#EditDescripcionProducto').val(description);
    $('#EditPrecioProducto').val(price);
    $('#EditformFile').val();

    showMarksEdit(mark);
    showCategoriesEdit(category);

    // Almacena el valor original del nombre al mostrar el modal de edición
    originalName = name;
    newName = '';
}

$('#EditarProducto').on('hide.bs.modal', function () {
    $('#EditNombreProducto').removeClass('is-invalid is-valid');
    $('#errorEditNombre').addClass('d-none').text('');
});

// Valida el nombre mientras se ingresa
$('#EditNombreProducto').on('input', function () {
    newName = $(this).val().trim();
    const $errorEditNombre = $('#errorEditNombre');

    if (newName === originalName) {
        $(this).removeClass('is-invalid is-valid');
        $errorEditNombre.addClass('d-none').text('');
    } else if (newName === '') {
        $(this).addClass('is-invalid').removeClass('is-valid');
        $errorEditNombre.text('Ingrese un nombre para el producto').removeClass('d-none');
    } else if (!isNameUnique(newName)) {
        $(this).addClass('is-invalid').removeClass('is-valid');
        $errorEditNombre.text('El nombre del producto ya está en uso').removeClass('d-none');
    } else {
        $(this).removeClass('is-invalid').addClass('is-valid');
        $errorEditNombre.addClass('d-none').text('');
    }
});

// Botón de confirmación de edición
$('#BtnConfirmarEdit').on('click', async function () {
    const id = $('#IdEditarProducto').val();
    const nameProductEdit = $('#EditNombreProducto').val();
    const descriptionEdit = $('#EditDescripcionProducto').val();
    const priceEdit = $('#EditPrecioProducto').val();
    const marcaEdit = $('#EditMarcaProducto').val();
    const categoriaEdit = $('#EditCategoriaProducto').val();
    const archivosImagen = $('#EditformFile')[0].files;

    const $errorEditNombre = $('#errorEditNombre');
    
    // Inicializa la variable isValid
    let isValid = true;

    if (nameProductEdit.trim() === '') {
        $('#EditNombreProducto').addClass('is-invalid');
        $errorEditNombre.text('Ingrese un nombre para el producto').removeClass('d-none');
        isValid = false;
    }

    if (!isNameUnique(newName)) {
        $('#EditNombreProducto').addClass('is-invalid').removeClass('is-valid');
        $errorEditNombre.text('El nombre del producto ya está en uso').removeClass('d-none');
        isValid = false;
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
        return;
    }

    const imagesEdit = $('#EditformFile')[0].files;

    const formData = new FormData();
    formData.append('NombreProducto', nameProductEdit);
    formData.append('Descripcion', descriptionEdit);
    formData.append('Precio', priceEdit);

    if (imagesEdit.length > 0) {
        for (let i = 0; i < imagesEdit.length; i++) {
            formData.append('Imagenes', imagesEdit[i]);
        }
    }

    formData.append('Marca', marcaEdit);
    formData.append('Categoria', categoriaEdit);

    // Pasa la variable id como parámetro
    editarProducto(formData, id);
    await Swal.fire('Producto editado')
    location.reload();
});

async function editarProducto(formData, id) {
    const response = await fetch(`http://localhost:8080/products/${id}`, {
        method: 'PUT',
        body: formData
    });

    const data = await response.json();
}

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
function isNameUnique(nameProduct) {
    const $rows = $('#ProductsTable tbody tr');
    for (let i = 0; i < $rows.length; i++) {
        const nombreProductoEnTabla = $rows.eq(i).find('td:eq(1)').text().trim();
        if (nombreProductoEnTabla.toLowerCase() === nameProduct.toLowerCase()) {
            return false;
        }
    }
    return true;
}

// VER DETALLES
const productDetails = (idProducto) => {
    $('#VerImagenes').modal('show');

    if (productosConImagenes[idProducto]) {
        const product = productData.find(p => p._id === idProducto);
        const images = productosConImagenes[idProducto];

        $('#productoNombre').text(product.NombreProducto);
        $('#productoDescripcion').text(product.Descripcion);
        $('#productoCategoria').text(product.Categoria.NombreCategoria);
        $('#productoMarca').text(product.Marca.NombreMarca);
        $('#productoPrecio').text(product.Precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }));
        $('#productoCantidad').text(product.Stock);
        $('#productoEstado').text(product.Estado);

        const carouselIndicators = $('#carouselIndicators');
        carouselIndicators.empty();

        const imagenCarrusel = $('#imagenCarrusel');
        imagenCarrusel.empty();

        images.forEach((image, index) => {
            const indicatorClass = index === 0 ? 'active' : '';

            const indicator = 
            `
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${index}" class="${indicatorClass}" aria-label="Slide ${index}"></button>
            `;
            carouselIndicators.append(indicator);

            const imageTag = 
            `
                <div class="carousel-item ${indicatorClass}">
                    <img src="${window.location.origin}/public/uploads/${image}"  class="d-block" alt="Imagen ${index}">
                </div>
            `;
            imagenCarrusel.append(imageTag);
        });
    }
}

const incrementarStock = (id, amount) => {
    $('#IdAumentarStock').val(id);
    $('#InputAumentarStock').val(amount);
    $('#AumentarStock').modal('show');
}
// Agrega un evento para limpiar la validación al cerrar el modal
$('#AumentarStock').on('hidden.bs.modal', function () {
    const inputAumentarStock = document.getElementById('InputAumentarStock');
    const errorAddStock = document.getElementById('errorAddStock');

    // Restablece la validación
    inputAumentarStock.setCustomValidity('');
    inputAumentarStock.classList.remove('is-invalid');
    errorAddStock.textContent = '';
    errorAddStock.classList.add('d-none');
});

// Agrega un evento para limpiar la validación al interactuar con el campo de entrada
$('#InputAumentarStock').on('input', function () {
    const inputAumentarStock = document.getElementById('InputAumentarStock');
    const errorAddStock = document.getElementById('errorAddStock');

    // Restablece la validación
    inputAumentarStock.setCustomValidity('');
    inputAumentarStock.classList.remove('is-invalid');
    errorAddStock.textContent = '';
    errorAddStock.classList.add('d-none');
});

$('#BtnConfirmaEditStock').on('click', async () => {
    const inputAumentarStock = document.getElementById('InputAumentarStock');
    const errorAddStock = document.getElementById('errorAddStock');
    
    const id = $('#IdAumentarStock').val();
    const amount = inputAumentarStock.value;

    if (!amount || isNaN(amount) || amount <= 0) {
        inputAumentarStock.setCustomValidity('Por favor, ingrese una cantidad válida.');
        inputAumentarStock.classList.add('is-invalid');
        errorAddStock.textContent = 'Por favor, ingrese una cantidad válida.';
        errorAddStock.classList.remove('d-none');
    } else {
        inputAumentarStock.setCustomValidity('');
        inputAumentarStock.classList.remove('is-invalid');
        errorAddStock.textContent = '';
        errorAddStock.classList.add('d-none');
        
        const data = { amount: amount };

        console.log(id);
        console.log(amount);

        const responseStock = await fetch(`http://localhost:8080/products/${id}/incrementar-stock`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const dataStock = await responseStock.json();
        await Swal.fire('Stock aumentado')
        location.reload();
    }
});






// ELIMINAR
const DeleteProduct = (id) => {
    $('#EliminarProducto').modal('show');
    $('#IdEliminarProducto').val(id);
}

$('#BtnConfirmarDelete').on('click', async () => {
    const id = $('#IdEliminarProducto').val();

    await Swal.fire('Producto eliminado')
    location.reload();

    const responseEliminar = await fetch(`http://localhost:8080/products/${id}`, {
        method: 'DELETE',
    });
   
    const data = responseEliminar.json();
    
    $('#EliminarProducto').modal('hide');

})

// TRAER CATEGORIAS AL SELECT
const showCategories = async () => {
    const categoriesSelect = document.getElementById('AddCategoriaProducto');
    
    try {
        
        const responseCategories = await fetch('http://localhost:8080/categories/');
        const data = await responseCategories.json();
        const categories = await data.allCategories;

        categoriesSelect.innerHTML = '';

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = `${category.NombreCategoria}`;
            option.textContent = `${category.NombreCategoria}`;
            categoriesSelect.appendChild(option);
        })

    } catch (error) {
        console.error(error);
    }
}

const showCategoriesEdit = async (categoriaProducto) => {
    var categoriesSelectEdit = document.getElementById('EditCategoriaProducto');

    try {
        const responseCategoriesEdit = await fetch('http://localhost:8080/categories/');
        const data = await responseCategoriesEdit.json();

        categoriesSelectEdit.innerHTML = '';

        data.allCategories.forEach((category, index) => {
            const option = document.createElement('option');
            option.value = category.NombreCategoria;
            option.textContent = category.NombreCategoria;
            categoriesSelectEdit.appendChild(option);
        });

        for (var i = 0; i < categoriesSelectEdit.options.length; i++) {
            if (categoriesSelectEdit.options[i].value === categoriaProducto) {
                categoriesSelectEdit.selectedIndex = i;
                break;
            }
        }
        
    } catch (error) {
        console.error(error);
    }
}

const showMarksEdit = async (marcaProducto) => {
    var marksSelectEdit = document.getElementById('EditMarcaProducto');

    try {
        const responseMarks = await fetch('http://localhost:8080/marks/');
        const data = await responseMarks.json();
        const marks = data.allMarks;

        marksSelectEdit.innerHTML = '';

        marks.forEach((mark, index) => {
            const option = document.createElement('option');
            option.value = mark.NombreMarca;
            option.textContent = mark.NombreMarca;
            marksSelectEdit.appendChild(option);
        });

        for (var i = 0; i < marksSelectEdit.options.length; i++) {
            if (marksSelectEdit.options[i].value === marcaProducto) {
                marksSelectEdit.selectedIndex = i;
                break;
            }
        }

    } catch (error) {
        console.error(error);
    }
}

// TRAER MARCAS AL SELECT
const showMarks = async () => {
    const marksSelect = document.getElementById('AddMarcaProducto');

    try {

        const responseMarks = await fetch('http://localhost:8080/marks/');
        const data = await responseMarks.json();
        const marks = await data.allMarks;

        marksSelect.innerHTML = '';

        marks.forEach(mark => {
            const option = document.createElement('option');
            option.value = `${mark.NombreMarca}`;
            option.textContent = `${mark.NombreMarca}`;
            marksSelect.appendChild(option);
        });

    } catch (error) {
        console.error(error);
    }
}

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