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
      if (Array.isArray(producto.Imagenes)) {
        imageTags = producto.Imagenes.map(image => `<img src="${window.location.origin}/public/uploads/${image}" alt="${image}" style="align-items:center">`).join('');
      }
      let disabledAttr = producto.Estado ? "" : "disabled";
      let section = `
        <div id="${producto._id}" class="row">
          <div class="col-lg-9">
            <div class="car__details__pic">
              <div class="car__details__pic__large">
                ${imageTags}
              </div>
            </div>
            <div class="car__details__tab">
              <div class="container" style="background-color: #e0e0e05d;">
              <br>
                <h4 style="font-weight: 800; color: #a09f9f;">Descripción</h4>
                <br>
                  <p>${producto.Descripcion}</p>
                <br>
              </div>
            </div>
          </div>


          <div class="col-lg-3">
            <div class="car__details__sidebar">
              <div class="car__details__sidebar__model">
                <h4>${producto.NombreProducto}</h4>
                <br>
                <p>${producto.Marca.NombreMarca}</p>
              </div>
              <div class="car__details__sidebar__payment">
                <ul>
                  <li>Precio: <span>${producto.Precio}</span></li>
                  <li>Disponibilidad: <span>${producto.Stock}</span></li>
                </ul>
                <a  href="#" onclick="if(${producto.Estado}) addToCart('${producto._id}', true); event.preventDefault();" ${disabledAttr} class="primary-btn"><i class="fa fa-credit-card"></i> Agregar al carrito</a>
               
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
