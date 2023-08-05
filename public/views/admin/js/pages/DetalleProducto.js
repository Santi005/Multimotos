
let detalleProducto;

$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        viewDetailProduct(id);
    }
});

function viewDetailProduct(id){
    fetch(`http://localhost:8080/products/${id}`)
    .then(response => response.json())
    .then(data=>{
        const producto = data.data; 
        if (Array.isArray(producto.Imagenes) && producto.Imagenes.length > 0) {
            const imageUrl = `${window.location.origin}/public/uploads/${producto.Imagenes[0]}`;
            imageTag = `<img src="${imageUrl}" alt="${producto.Imagenes[0]}" width="600px" style="margin: auto; max-width: 100%;">`;
        }
      let estado;
            if (producto.Estado == true) {
                estado = 'Disponible';
            } else {
                estado = 'Agotado';
            }

      let info =  ` 
      <div class="col-6">
            ${imageTag}
        </div>
    <div class="col-6" style="width:500px">
        <h3><span>${producto.NombreProducto}</span></h3>
        <p ><strong>Descripción:</strong> <span>${producto.Descripcion}</span></p>
        <p><strong>Precio:</strong> <span>${producto.Precio}</span></p>
        <p><strong>Estado:</strong> <span>${estado}</span></p>
        <p><strong>Categoría:</strong> <span>${producto.Categoria.NombreCategoria}</span></p>
        <p><strong>Marca:</strong> <span>${producto.Marca.NombreMarca}</span></p>
        <p><strong>Stock:</strong> <span>${producto.Stock}</span></p>
    </div>
      `
      $('#informacion').append(info);

    })
    .catch(error=>{
        console.error(error);
    })
}