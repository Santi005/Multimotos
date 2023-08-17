const PAGE_SIZE = 9; // Tamaño de página
let currentPage = 1; // Página actual
let totalPages = 0; // Total de páginas
let productsData = []; // Almacena los datos de todos los productos
let filteredProductsData = []; // Almacena los datos de los productos filtrados

const listProducts = () => {
  fetch('http://localhost:8080/products/')
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data.products)) {
        productsData = data.products;

        // Obtiene la búsqueda del usuario
        const searchValue = $('#search-input-products-client').val().toLowerCase();

        if (searchValue !== '') {
          // Filtra los productos
          filteredProductsData = productsData.filter((product) => {
            return (
              product.NombreProducto.toLowerCase().includes(searchValue) ||
              product.Precio.toString().includes(searchValue)
            );
          });
        } else {
          // Muestra todos los productos si no hay una búsqueda
          filteredProductsData = [...productsData];
        }

        // Calcula el total de productos y total de páginas
        const totalProducts = filteredProductsData.length;
        totalPages = Math.ceil(totalProducts / PAGE_SIZE);

        // Ajusta el número de página según la búsqueda
        if (currentPage > totalPages) {
          currentPage = totalPages;
        }

        // Calcula el índice inicial y final de los productos a mostrar en la página
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = Math.min(startIndex + PAGE_SIZE, totalProducts);

        // Limpia el contenedor antes de cargar los nuevos datos
        const cardsContainer = $('#cards');
        cardsContainer.empty();

        if (filteredProductsData.length > 0) {
          // Recorre los productos que se van a mostrar en la página actual y genera los elementos
          for (let i = startIndex; i < endIndex; i++) {
            const product = filteredProductsData[i];

            // Verifica si el producto existe antes de acceder a sus propiedades
            const image = product.Imagenes[0]; // Tomar la primera imagen del array

            if (product) {
              const imageTag = `
                <img src="${window.location.origin}/public/uploads/${image}" alt="${image}" width="100%" height="100%" style="align-items: center; object-fit: cover;">
              `;

              let disabledAttr = product.Estado == 'Disponible' ? '' : 'disabled';

              let card = `
                <div class="col-lg-4 col-md-4">
                  <div class="car__item">
                    <div class="productos" style="height: 200px; line-height: 200px;">
                      ${imageTag}
                    </div>
                    <div class="car__item__text" >
                      <div class="car__item__text__inner" style="height:120px">
                        <h5><a href="#">${product.NombreProducto}</a></h5>
                        <ul>
                          <li><span>${product.Precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span></li>
                          <li><i id='${product._id}' ${product.Estado == "Disponible" ? "class='fas fa-circle' style='color:green'" : "class='fas fa-circle' style='color:red'"}></i>${product.Estado}</li>
                        </ul>
                      </div>
                      <div class="car__item__price">
                        <a href="detalles.html?id=${product._id}">
                          <span class="car-option" id="btn-ver-mas">Ver más</span>
                        </a>
                        <a href="#" onclick=" addToCart('${product._id}', true); event.preventDefault();" class="add-to-cart-button" >
                          <h6 class="add-cart-button" style="${product.Estado == "Disponible" ? '' : 'opacity: 0.5; cursor: not-allowed;'}" ${disabledAttr}>
                            <i class="fas fa-cart-plus add-cart-button"></i>&nbsp;Añadir al carrito
                          </h6>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              `;

              cardsContainer.append(card);
            }
          }
        } else {
          // Muestra un mensaje cuando no se encuentran productos
          cardsContainer.html(`
            <div class="col-12">No se encontraron productos.</div>
          `);
        }

        // Crea la sección de paginación
        const paginationContainer = document.querySelector('.pagination');
        paginationContainer.innerHTML = '';

        // Recorre el número total de páginas y crea el enlace para cambiar de página
        for (let i = 1; i <= totalPages; i++) {
          const link = document.createElement('button');
          link.textContent = i;
          link.style.fontSize = "15px"
          link.style.backgroundColor = "#EBEBEA"
          link.style.marginLeft = "4px"
          link.classList.add("btn");
          link.classList.add('pagination-link');

          // Agrega la clase 'active' al enlace de la página actual
          if (i === currentPage) {
            link.classList.add('active');
          }

          // Agrega el evento al hacer clic en el enlace para cambiar la página actual y listar los productos correspondientes
          link.addEventListener('click', () => {
            currentPage = i;
            listProducts();
          });

          paginationContainer.appendChild(link);
        }
      }
    })
    .catch((error) => {
      console.log('Fetch error:', error);
    });
};

// Método buscar
// Se ejecuta cuando se usa el input de búsqueda
$('#search-input-products-client').on('input', function () {
  currentPage = 1; // Reinicia la página al hacer una nueva búsqueda
  listProducts(); // Lista los productos buscados
});

// Llama a la función listProducts cuando la página se haya cargado completamente
$(document).ready(() => {
  listProducts();
});
