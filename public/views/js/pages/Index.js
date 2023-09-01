function listProducts() {
  fetch('http://localhost:8080/products/')
  .then(response => response.json())
  .then(data => {
      const cards = $('#cardsProducts');
      const productsToShow = data.products.slice(0, 4); // Obtener los primeros 4 productos

      productsToShow.forEach(product => {
          const firstImage = product.Imagenes[0]; // Obtener la primera imagen

          let disabledAttr = product.Estado == 'Disponible' ? '' : 'disabled';
          const row = `
          <div class="col-lg-3 col-md-3" style=" word-wrap: break-word;">
                <div class="car__item">
                  <div class="productos" style="height: 200px; line-height: 200px;">
                    <img src="${window.location.origin}/public/uploads/${firstImage}" alt="${firstImage}" width="100%" height="100%" style="align-items: center; object-fit: cover;">
                  </div>
                  <div class="car__item__text" >
                    <div class="car__item__text__inner" style="height:120px">
                      <h5 class="truncate-text" style="font-weight:600;">${product.NombreProducto}</h5>
                      <ul>
                        <li><span>${product.Precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span></li>
                        <li><i id='${product._id}' ${product.Estado == "Disponible" ? "class='fas fa-circle' style='color:green'" : "class='fas fa-circle' style='color:red'"}></i>${product.Estado}</li>
                      </ul>
                    </div>
                    <div class="car__item__price">
                      <a href="detalles.html?id=${product._id}">
                        <span class="car-option" id="btn-ver-mas">Ver más</span>
                      </a>
                      <a href="#" onclick="${product.Estado === 'Disponible' ? `addToCart('${product._id}', true);` : 'event.preventDefault();'}" class="add-to-cart-button">
                      <h6 class="add-cart-button" style="${product.Estado === 'Disponible' ? '' : 'opacity: 0.5; cursor: not-allowed; '}" ${disabledAttr}>
                        <i class="fas fa-cart-plus add-cart-button"></i>&nbsp;Añadir al carrito
                      </h6>
                    </a>
                    </div>
                  </div>
                </div>
              </div>
          `;
                  
          cards.append(row);

          const truncateTextElements = document.querySelectorAll(".truncate-text");

          truncateTextElements.forEach((element) => {
          const text = element.textContent;
          const maxLength = 18;

          if (text.length > maxLength) {
              const truncatedText = text.substring(0, maxLength - 3) + "...";
              element.textContent = truncatedText;
          }
          });
        
      });
  })
  .catch(error => {
      console.error(error);
  });
}

listProducts();
