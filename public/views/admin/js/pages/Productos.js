//Método listar-------------------------------------------------
const listProducts = () => {
    fetch('http://localhost:8080/products/')
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data.products)) {
                
                const tableBody = $("#ProductsTable tbody");
                tableBody.empty();
                

                data.products.forEach((product, index) => {

                    // Etiquetas de imagen
                    let imageTags = product.Imagenes.map(image => `<img src="${window.location.origin}/public/uploads/${image}" alt="${image}" width="100" height="80">`).join('');
                    let amount = $('#InputAumentarStock').val();

                    //Determina si el estado es disponible o agotado
                    let estado;
                    let id = product._id;

                    if (product.Estado == true) {
                        estado = 'Disponible';
                    } else {
                        estado = 'Agotado';
                    }

                    // Generar la fila y agregarla a la tabla
                    let row = `
                        <tr id="${product._id}">
                            <td>${index + 1}</td>
                            <td>${product.NombreProducto}</td>
                            <td>${product.Descripcion}</td>
                            <td>${product.Stock}</td>
                            <td>${product.Categoria.NombreCategoria}</td>
                            <td>${product.Marca.NombreMarca}</td>
                            <td>${product.Precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
                            <td>${estado}</td>
                            <td>${imageTags}</td>
                            <td>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <i onclick="EditProduct('${product._id}', '${product.NombreProducto}', '${product.Descripcion}', '${product.Categoria}', '${product.Marca}', '${product.Precio}', '${product.Imagenes}')" class="bi bi-pencil-square productos" style="color:#f62d51; font-size: 1.3em; cursor: pointer;"></i>
                                &nbsp;&nbsp;&nbsp;
                                <i onclick="DeleteProduct('${product._id}')" class="bi bi-trash3 productos" style="color:#f62d51; font-size: 1.3em; cursor: pointer;"></i>
                                &nbsp;&nbsp;&nbsp;
                                <i onclick="incrementarStock('${product._id}', '${amount}')" class="bi bi-box-seam productos" style="color:#f62d51; font-size: 1.3em; cursor: pointer;"></i>
                            </td>
                        </tr>
                    `;
                    
                    
                    tableBody.append(row);

                    if (product.Stock <= 0) {
                        // Llama a la función de desactivación
                        deactivateProduct(id);
                    } else {
                        // Llama a la función de activación
                        activateProduct(id);
                    }
                });

                $("#ProductsTable").DataTable({
                    language: {
                        url: "https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
                    }
                });
            } else {
                console.error('Los datos recibidos no contienen un arreglo válido.');
            }
        })
        .catch(error => {
            console.log(error);
        });
}

                        

                            
        
        
       


const activateProduct = (id) => {
    fetch(`http://localhost:8080/products/activar/${id}`, {
        method: 'PUT'
    })
        .then(response => response.json())
        .then(data => {

        })
        .catch(error => {
            console.log(error);
        });
};

const deactivateProduct = (id) => {
    fetch(`http://localhost:8080/products/desactivar/${id}`, {
        method: 'PUT'
    })
        .then(response => response.json())
        .then(data => {
            // if(data.ok == true){
            //     listProducts() 
            // }

        })
        .catch(error => {
            console.log(error);
        });
};



//Agregar----------------------------------------------------
$(document).ready(function() {
    // Función de validación de producto
    function validarProducto() {
        let nombreProducto = $('#AddNombreProducto').val().trim();
        let descripcion = $('#AddDescripcionProducto').val().trim();
        let stock = $('#AddCantidadProducto').val().trim();
        let categoria = $('#AddCategoriaProducto').val();
        let marca = $('#AddMarcaProducto').val();
        let precio = $('#AddPrecioProducto').val().trim();
        let archivoImagen = $('#formFileAdd')[0].files[0];

        let inputNombreProducto = $('#AddNombreProducto');
        let inputDescripcion = $('#AddDescripcionProducto');
        let inputStock = $('#AddCantidadProducto');
        let inputCategoria = $('#AddCategoriaProducto');
        let inputMarca = $('#AddMarcaProducto');
        let inputPrecio = $('#AddPrecioProducto');
        let inputFile = $('#formFileAdd');

        // Validación del nombre del producto
        if (nombreProducto === '') {
            inputNombreProducto.addClass('is-invalid').removeClass('is-valid');
            $('#errorAddName').text('El campo de nombre de producto no puede estar vacío').removeClass('d-none');
        } else {
            inputNombreProducto.removeClass('is-invalid').addClass('is-valid');
            $('#errorAddName').addClass('d-none');
        }

        // Validación de la descripción del producto
        if (descripcion === '') {
            inputDescripcion.addClass('is-invalid').removeClass('is-valid');
            $('#errorAddDescription').text('El campo de descripción no puede estar vacío').removeClass('d-none');
        } else {
            inputDescripcion.removeClass('is-invalid').addClass('is-valid');
            $('#errorAddDescription').addClass('d-none');
        }

        // Validación del stock
        if (stock === '') {
            inputStock.addClass('is-invalid').removeClass('is-valid');
            $('#errorAddCantidad').text('El campo de cantidad no puede estar vacío').removeClass('d-none');
        } else {
            inputStock.removeClass('is-invalid').addClass('is-valid');
            $('#errorAddCantidad').addClass('d-none');
        }

        // Validación de la categoría
        if (categoria === '') {
            inputCategoria.addClass('is-invalid').removeClass('is-valid');
            $('#errorAddCategory').text('Debes seleccionar una categoría').removeClass('d-none');
        } else {
            inputCategoria.removeClass('is-invalid').addClass('is-valid');
            $('#errorAddCategory').addClass('d-none');
        }

        // Validación de la marca
        if (marca === '') {
            inputMarca.addClass('is-invalid').removeClass('is-valid');
            $('#errorAddMark').text('Debes seleccionar una marca').removeClass('d-none');
        } else {
            inputMarca.removeClass('is-invalid').addClass('is-valid');
            $('#errorAddMark').addClass('d-none');
        }

        // Validación del precio
        if (precio === '') {
            inputPrecio.addClass('is-invalid').removeClass('is-valid');
            $('#errorAddPrice').text('El campo de precio no puede estar vacío').removeClass('d-none');
        } else {
            inputPrecio.removeClass('is-invalid').addClass('is-valid');
            $('#errorAddPrice').addClass('d-none');
        }

        // Validación del archivo de imagen
        if (!archivoImagen) {
            inputFile.addClass('is-invalid').removeClass('is-valid');
            $('#errorAddFile').text('Debes seleccionar una imagen').removeClass('d-none');
        } else {
            inputFile.removeClass('is-invalid').addClass('is-valid');
            $('#errorAddFile').addClass('d-none');
        }

        // Devuelve true si todos los campos son válidos
        return (
            nombreProducto !== '' &&
            descripcion !== '' &&
            stock !== '' &&
            categoria !== '' &&
            marca !== '' &&
            precio !== '' &&
            archivoImagen
        );
    }

    // Evento de clic en el botón de confirmar de producto
    $('#BtnConfirmarAdd').on('click', () => {
        // Llamada a la función de validación de producto
        if (validarProducto()) {
            // Obtener los valores de los campos del formulario
            const nombreProducto = $('#AddNombreProducto').val();
            const descripcion = $('#AddDescripcionProducto').val();
            const stock = $('#AddCantidadProducto').val();
            const categoria = $('#AddCategoriaProducto').val();
            const marca = $('#AddMarcaProducto').val();
            const precio = $('#AddPrecioProducto').val();
            const archivoImagen = $('#formFileAdd')[0].files[0];

            const formData = new FormData();
            formData.append('NombreProducto', nombreProducto);
            formData.append('Descripcion', descripcion);
            formData.append('Stock', stock);
            formData.append('Categoria', categoria);
            formData.append('Marca', marca);
            formData.append('Precio', precio);
            formData.append('Imagenes', archivoImagen);

            fetch('http://localhost:8080/products/', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(json => {
                    console.log(json); // Muestra la respuesta en la consola
                    if(data.ok == 200){
                        listProducts()
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        }
    });
});

//-------------------------------------------------------------



//Editar-------------------------------------------------------

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

$('#BtnConfirmarEdit').on('click', (event) => {
    event.preventDefault();
    const idEdit = $('#IdEditarProducto').val();
    const nameProductEdit = $('#EditNombreProducto').val();
    const descriptionEdit = $('#EditDescripcionProducto').val();
    const priceEdit = $('#EditPrecioProducto').val();
    const imageEdit = $('#EditformFile')[0].files[0];
    const marcaEdit = $('#EditMarcaProducto').val(); // Obtener la marca seleccionada
    const categoriaEdit = $('#EditCategoriaProducto').val(); // Obtener la categoría seleccionada

    const formData = new FormData();
    formData.append('NombreProducto', nameProductEdit);
    formData.append('Descripcion', descriptionEdit);
    formData.append('Precio', priceEdit);

    if (imageEdit) {
        formData.append('Imagenes', imageEdit);
    }

    // Agregar los campos de marca y categoría al formulario
    formData.append('Marca', marcaEdit);
    formData.append('Categoria', categoriaEdit);

    fetch(`http://localhost:8080/products/${idEdit}`, {
        method: 'PUT',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log('Producto editado:', data);
            if (data.ok == 200) {
                listProducts();
            }
        })
        .catch(error => {
            console.error(error);
        });
});

//Eliminar-------------------------------------------------------

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
        .then(res => {
            $('#EliminarProducto').modal("hide");
            console.log(res);
            if(data.ok == 200){
                listProducts()
            }
        });
});

//---------------------------------------------------------------


//Aumentar stock--------------------------------------------------
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

//----------------------------------------------------------------

