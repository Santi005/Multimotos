
let detalleProducto;

$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        viewDetailProduct(id);
    }
});
function viewDetailProduct(id) {
    fetch(`http://localhost:8080/products/${id}`)
    .then(response => response.json())
    .then(data => {
        const producto = data.data;

        let estado;
        if (producto.Estado == true) {
            estado = 'Disponible';
        } else {
            estado = 'Agotado';
        }

        let info =  `
            <div class="col-6" style="padding-right:100px; padding-bottom:60px">
                <div id="carouselDetailImages" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-inner">
                        ${buildCarouselImages(producto.Imagenes)}
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselDetailImages" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true" style="background-color: #f62d51; height: 40px; border-radius: 3px;"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselDetailImages" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true" style="background-color: #f62d51; height: 40px; border-radius: 3px;"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
            <div class="col-6" style="width:600px;">
                <h3><span>${producto.NombreProducto}</span></h3>
                <p ><strong>Descripción:</strong> <span>${producto.Descripcion}</span></p>
                <p><strong>Precio:</strong> <span>${producto.Precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span></p>
                <p><strong>Estado:</strong> <span>${estado}</span></p>
                <p><strong>Categoría:</strong> <span>${producto.Categoria.NombreCategoria}</span></p>
                <p><strong>Marca:</strong> <span>${producto.Marca.NombreMarca}</span></p>
                <p><strong>Stock:</strong> <span>${producto.Stock}</span></p>
            </div>
        `;

        $('#informacion').append(info);
    })
    .catch(error => {
        console.error(error);
    });
}

function buildCarouselImages(images) {
    return images.map((image, index) => {
        const imageUrl = `${window.location.origin}/public/uploads/${image}`;
        const activeClass = index === 0 ? 'active' : '';
        return `
            <div class="carousel-item ${activeClass}" style=" height:600px">
                <img src="${imageUrl}" alt="${image}"  style="width: 100%; height: 600px; text-align:center">
            </div>
        `;
    }).join('');
}
