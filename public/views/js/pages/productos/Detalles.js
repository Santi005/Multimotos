$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  if (id) {
    ViewDetail(id);
  }
});

function ViewDetail(id) {
  fetch(`http://localhost:8080/products/${id}`)
  .then(response => response.json())
  .then(data => {
    const producto = data.data;

    let section = `
      <div id="${producto._id}" class="row">
        <div class="col-lg-1">
          <div class="d-flex flex-column align-items-center">
            ${buildThumbnailImages(producto.Imagenes)}
          </div>
        </div>
        <div class="col-lg-8">
                <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
                <ol class="carousel-indicators">
                  <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
                  <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                  <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                </ol>
                <div class="carousel-inner">
                ${buildCarouselImages(producto.Imagenes)}
                </div>
                <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                  <span class="carousel-control-prev-icon" aria-hidden="true"  style="background-color: #db2d2e; height: 40px; border-radius: 3px;"></span>
                  <span class="sr-only">Previous</span>
                </a>
                <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                  <span class="carousel-control-next-icon" aria-hidden="true"  style="background-color: #db2d2e; height: 40px; border-radius: 3px;"></span>
                  <span class="sr-only">Next</span>
                </a>
              </div>
            <div class="car__details__tab">
              <div class="container" style="background-color: #e0e0e05d;">
              <br>
                <h4 style="font-weight: 800; color: #a09f9f;">Descripción</h4>
                <br>
                  <p  style=" word-wrap: break-word;">${producto.Descripcion}</p>
                <br>
              </div>
            </div>
            </div>
            <div class="col-lg-3"> <!-- Columna de detalles de compra -->
              <div class="car__details__sidebar">
                <div class="car__details__sidebar__model">
                  <h4 style="word-wrap: break-word;">${producto.NombreProducto}</h4> <!-- Muestra el nombre del producto -->
                  <br>
                  <p>${producto.Marca.NombreMarca}</p>
                </div>
                <div class="car__details__sidebar__payment">
                  <ul>
                    <li>Precio: <span>${producto.Precio}</span></li>
                    <li>Disponibilidad: <span>${producto.Stock}</span></li>
                  </ul>
                 
                  <a href="#" onclick="${producto.Estado === 'Disponible' ? `addToCart('${producto._id}', true);` : 'event.preventDefault();'}" class="primary-btn""></i> Agregar al carrito</a>
                </div>
              </div>
            </div>
          </div>
        `;
        $('#section').append(section);
      })
      .catch(error => {
        console.log('Fetch error:', error);
      });
    }

    function buildThumbnailImages(images) {
      return images.map((image, index) => {
        const imageUrl = `${window.location.origin}/public/uploads/${image}`;
        const activeClass = index === 0 ? 'active' : '';
        return `
          <a data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${index}" style="cursor:pointer" class="carousel-thumbnail ${activeClass}" onclick="changeCarouselImage(${index})">
            <img src="${imageUrl}" alt="${image}" style="height:50px;  padding-bottom:10px" class="thumbnail-img">
          </a>
        `;
      }).join('');
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

function changeCarouselImage(index) {
  $('.carousel-thumbnail').removeClass('active'); // Remueve la clase 'active' de todas las miniaturas
  $('.carousel-thumbnail[data-bs-slide-to="' + index + '"]').addClass('active'); // Agrega 'active' a la miniatura correspondiente
  $('#carouselExampleIndicators').carousel(index); // Cambia la imagen activa del carrusel al índice proporcionado
}
