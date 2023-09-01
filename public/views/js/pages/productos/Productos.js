const PAGE_SIZE = 9;
let currentPage = 1;
let totalPages = 0;
let productsData = [];
let filteredProductsData = [];

//Id para filtro de categorías 
document.getElementById('categoriesSelect').addEventListener('change', () => {
  currentPage = 1;
  listProducts();
});

//Id para filtro de marcas
document.getElementById('marksSelect').addEventListener('change', () => {
  currentPage = 1;
  listProducts();
});

//Id para ordenar por
document.getElementById('sortSelect').addEventListener('change', () => {
  listProducts();
});

const listProducts = () => {
  fetch('http://localhost:8080/products/')
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data.products)) {
        productsData = data.products;

        //Buscador
        const searchValue = $('#search-input-products-client').val().toLowerCase();

        filteredProductsData = productsData.filter((product) => {
          return (
            product.NombreProducto.toLowerCase().includes(searchValue) ||
            product.Precio.toString().includes(searchValue)
          );
        });

        //Filtro
        const selectedCategory = document.getElementById('categoriesSelect').value;
        const selectedBrand = document.getElementById('marksSelect').value;

        filteredProductsData = filteredProductsData.filter((product) => {
          const categoryMatch = !selectedCategory || product.Categoria.NombreCategoria === selectedCategory;
          const brandMatch = !selectedBrand || product.Marca.NombreMarca === selectedBrand;
          return categoryMatch && brandMatch;
        });

        //Ordenar por
        const sortOption = document.getElementById('sortSelect').value;
        if (sortOption === 'MayorAMenor') {
          filteredProductsData.sort((a, b) => b.Precio - a.Precio);
        } else if (sortOption === 'MenorAMayor') {
          filteredProductsData.sort((a, b) => a.Precio - b.Precio);
        }

        const totalProducts = filteredProductsData.length;
        totalPages = Math.ceil(totalProducts / PAGE_SIZE);

        if (currentPage > totalPages) {
          currentPage = totalPages;
        }

        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = Math.min(startIndex + PAGE_SIZE, totalProducts);

        const cardsContainer = $('#cards');
        cardsContainer.empty();

        if (filteredProductsData.length > 0) {
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
                <div class="col-lg-4 col-md-4" style=" word-wrap: break-word;">
                  <div class="car__item">
                    <div class="productos" style="height: 200px; line-height: 200px;">
                      ${imageTag}
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

              cardsContainer.append(card);
            }
            const truncateTextElements = document.querySelectorAll(".truncate-text");

            truncateTextElements.forEach((element) => {
            const text = element.textContent;
            const maxLength = 18;

            if (text.length > maxLength) {
                const truncatedText = text.substring(0, maxLength - 3) + "...";
                element.textContent = truncatedText;
            }
            });
          }
        } 
        else {
          cardsContainer.html(`<div class="col-12">No se encontraron productos.</div>`);
        }

        generatePaginationButtons();
      }
    })
    .catch((error) => {
      console.log('Fetch error:', error);
    });
};

$('#search-input-products-client').on('input', function () {
  currentPage = 1;
  listProducts();
});

$(document).ready(() => {
  listProducts();
});

const getcategories = () => {
  const categoriesSelect = document.getElementById('categoriesSelect')

  fetch('http://localhost:8080/categories')
    .then(response => response.json())
    .then(data => {
      
      categorias = data.allCategories;
      categoriesSelect.innerHTML = '';

      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Todas';
      categoriesSelect.appendChild(defaultOption);

      categorias.forEach((category) => {
        const option = document.createElement('option');
        option.value = `${category.NombreCategoria}`;
        option.textContent = `${category.NombreCategoria}`;
        categoriesSelect.appendChild(option);
      })
  })
}

const getMarks = () => {
  const marksSelect = document.getElementById('marksSelect')

  fetch('http://localhost:8080/marks')
    .then(response => response.json())
    .then(data => {

      marcas = data.allMarks;
      marksSelect.innerHTML = '';

      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Todas';
      marksSelect.appendChild(defaultOption);

      marcas.forEach((mark) => {
        const option = document.createElement('option');
        option.value = `${mark.NombreMarca}`;
        option.textContent = `${mark.NombreMarca}`;
        marksSelect.appendChild(option);
      })
  })
}
getcategories()
getMarks()

const generatePaginationButtons = () => {
  const paginationContainer = document.querySelector('.pagination');
  paginationContainer.innerHTML = '';

  // Función para crear un botón de paginación
  const createPaginationButton = (text, isActive, onClick) => {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.fontSize = '15px';
    button.style.backgroundColor = isActive ? '#DB2D2E' : '#EBEBEA';
    button.style.color = isActive ? 'white' : 'black';
    button.style.marginLeft = '4px';
    button.classList.add('btn');
    button.classList.add('pagination-link');
    if (isActive) {
      button.classList.add('active');
    }
    button.addEventListener('click', onClick);
    return button;
  };

  const prevButton = createPaginationButton('Anterior', false, () => {
    if (currentPage > 1) {
      currentPage--;
      listProducts();
    }
  });
  prevButton.style.backgroundColor = '#DB2D2E'; 
  prevButton.style.color = 'white'; 
  paginationContainer.appendChild(prevButton);
  
  // Botones de número de páginas
  const maxVisiblePages = 5; 
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  for (let i = startPage; i <= endPage; i++) {
    const isActive = i === currentPage;
    const pageButton = createPaginationButton(i.toString(), isActive, () => {
      currentPage = i;
      listProducts();
    });
    paginationContainer.appendChild(pageButton);
  }

  const nextButton = createPaginationButton('Siguiente', false, () => {
    if (currentPage < totalPages) {
      currentPage++;
      listProducts();
    }
  });
  nextButton.style.backgroundColor = '#DB2D2E'; 
  nextButton.style.color = 'white'; 
  paginationContainer.appendChild(nextButton);
};

  if (totalPages <= 3) {
    for (let i = 1; i <= totalPages; i++) {
      const link = createPageButton(i);
      paginationContainer.appendChild(link);
    }
  } else {
  
if (totalPages <= 3) {
  for (let i = 1; i <= totalPages; i++) {
    const link = createPageButton(i);
    paginationContainer.appendChild(link);
  }
} else {
  if (currentPage <= 2) {
    for (let i = 1; i <= 3; i++) {
      const link = createPageButton(i);
      paginationContainer.appendChild(link);
    }
    const dots = document.createElement('span');
    dots.textContent = '...';
    dots.classList.add('pagination-dots');
    paginationContainer.appendChild(dots);
  } else if (currentPage >= totalPages - 1) {
    paginationContainer.appendChild(createPageButton(1));
    const dots = document.createElement('span');
    dots.textContent = '...';
    dots.classList.add('pagination-dots');
    paginationContainer.appendChild(dots);
    for (let i = totalPages - 2; i <= totalPages; i++) {
      const link = createPageButton(i);
      paginationContainer.appendChild(link);
    }
  } else {
    paginationContainer.appendChild(createPageButton(1));
    const dotsStart = document.createElement('span');
    dotsStart.textContent = '...';
    dotsStart.classList.add('pagination-dots');
    paginationContainer.appendChild(dotsStart);
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      const link = createPageButton(i);
      paginationContainer.appendChild(link);
    }
    const dotsEnd = document.createElement('span');
    dotsEnd.textContent = '...';
    dotsEnd.classList.add('pagination-dots');
    paginationContainer.appendChild(dotsEnd);
    paginationContainer.appendChild(createPageButton(totalPages));
  }
}
  }

  paginationContainer.appendChild(nextButton);


const createPageButton = (pageNumber) => {
  const link = document.createElement('button');
  link.textContent = pageNumber;
  link.style.fontSize = '15px';
  link.style.backgroundColor = '#EBEBEA';
  link.style.marginLeft = '4px';
  link.classList.add('btn');
  link.classList.add('pagination-link');
  if (pageNumber === currentPage) {
    link.classList.add('active');
  }
  link.addEventListener('click', () => {
    currentPage = pageNumber;
    listProducts();
  });
  return link;
};