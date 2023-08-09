// Traer los elementos de la página.
const cartItems = document.getElementById('cartItems');
const totalPagar = document.querySelector('.cart-total');
const cartButton = document.getElementById('cartButton');
const emptyButton = document.getElementById('emptyCart');
const cartSidebar = document.getElementById('cartSidebar');
const checkoutButton = document.getElementById('checkoutButton');
const closeCartButton = document.getElementById('closeCartButton');

let cartTotal = 0;
let productPrice = 0;
let quantityProduct = 0;
let cartItemsData = {};
let isButtonClicked = false;

// Mostrar/ocultar el menú lateral del carrito.
cartButton.addEventListener('click', () => {
  cartSidebar.classList.toggle('show');
});

closeCartButton.addEventListener('click', () => {
  cartSidebar.classList.remove('show');
});

// Función para el enlace del carrito.
checkoutButton.addEventListener('click', (event) => {
  event.preventDefault();

  const cartItemsDataJSON = JSON.stringify(cartItemsData);

  const cartURL = `${checkoutButton.href}?cartItemsData=${encodeURIComponent(cartItemsDataJSON)}`;

  window.location.href = cartURL;
})

// Función para agregar productos al carrito.
const addToCart = (productId, isButtonClicked) => {
  // Verificar si ya existe el producto.
  const existingCartItem = cartItems.querySelector(`#quantity-${productId}`);

  if (existingCartItem) {
    const currentQuantity = parseInt(existingCartItem.textContent);
    const maxQuantity = cartItemsData[productId].details.quantityProduct;

    if (currentQuantity >= maxQuantity) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        didOpen: (toast) => {
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
      });

      Toast.fire({
        icon: 'warning',
        title: 'Cantidad máxima alcanzada'
      });

      return;
    }

    existingCartItem.textContent = currentQuantity + 1;
    cartItemsData[productId].quantity = currentQuantity + 1;
    cartTotal += productPrice;
    recalculateTotal();
    updateCart();

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      didOpen: (toast) => {
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    if (isButtonClicked) {
      Toast.fire({
        icon: 'success',
        title: 'Producto agregado al carrito :)'
      });
    }

    return;
  }

  // Realizar solicitud fetch para obtener los datos del producto.
  fetch(`http://localhost:8080/products/${productId}`)
    .then((response) => response.json())
    .then((data) => {
      productPrice = data.data.Precio;
      const productImage = data.data.Imagenes[0];
      const productName = data.data.NombreProducto;
      quantityProduct = data.data.Stock;

      let truncatedName = productName;
      if (truncatedName.length > 7) {
        truncatedName = truncatedName.substring(0, 7) + '...';
      }

      const cartProduct = document.createElement('li');
      cartProduct.classList.add('cart-product');

      const cartProductHTML = `
        <div class="info-cart-product" id="${productId}">
          <img src="${window.location.origin}/public/uploads/${productImage}" alt="${productImage}"" width="25px" height="25px">
          <span class="cantidad-producto-carrito" id="quantity-${productId}">1</span>
          <p class="titulo-producto-carrito">${truncatedName}</p>
          <span class="precio-producto-carrito">${productPrice.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
        </div>
        <i class="fas fa-trash icon-trash" onclick="trashProduct('${productId}')"></i>
      `;

      cartProduct.innerHTML = cartProductHTML;

      cartItems.appendChild(cartProduct);

      // Agregar productos a la lista.
      cartItemsData[productId] = {
        price: productPrice,
        quantity: 1,
        details: {
          productImage: productImage,
          truncatedName: truncatedName,
          productName: productName,
          quantityProduct: quantityProduct
        },
      };

      cartTotal += productPrice;
      recalculateTotal();
      updateCart();

      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        didOpen: (toast) => {
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      if (isButtonClicked) {
        Toast.fire({
          icon: 'success',
          title: 'Producto agregado al carrito :)'
        });
      }
  
      isButtonClicked = true;

    });
};




// Función para guardar el carrito en el localStorage.
const saveCartToLocalStorage = () => {
  const cartItemsDataToSave = Object.entries(cartItemsData).reduce((acc, [productId, productData]) => {
    const productDetails = {
      price: productData.price,
      quantity: productData.quantity,
      details: productData.details,
    };
    acc[productId] = productDetails;
    return acc;
  }, {});

  localStorage.setItem('cartItemsData', JSON.stringify(cartItemsDataToSave));
  localStorage.setItem('cartTotal', cartTotal);
};

// Función para cargar el carrito desde el localStorage.
const loadCartFromLocalStorage = () => {
  const savedCartItemsData = localStorage.getItem('cartItemsData');
  const savedCartTotal = localStorage.getItem('cartTotal');

  if (savedCartItemsData && savedCartTotal) {
    cartItemsData = JSON.parse(savedCartItemsData);
    cartTotal = parseFloat(savedCartTotal);
    updateTotal();

    // Limpiar el panel lateral del carrito antes de agregar los productos.
    cartItems.innerHTML = '';

    // Agregar cada producto al carrito.
    for (const productId in cartItemsData) {
      const productData = cartItemsData[productId];
      const { price, quantity, details } = productData;
      productPrice = price;

      const cartProduct = document.createElement('li');
      cartProduct.classList.add('cart-product');

      const cartProductHTML = `
        <div class="info-cart-product" id="${productId}">
          <img src="${window.location.origin}/public/uploads/${details.productImage}" alt="${details.productImage}" width="25px" height="25px">
          <span class="cantidad-producto-carrito" id="quantity-${productId}">${quantity}</span>
          <p class="titulo-producto-carrito">${details.truncatedName}</p>
          <span class="precio-producto-carrito">${price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
        </div>
        <i class="fas fa-trash icon-trash" onclick="trashProduct('${productId}')"></i>
      `;

      cartProduct.innerHTML = cartProductHTML;

      cartItems.appendChild(cartProduct);
    }
  }
};

// Actualziar el número arriba del carrito.
const updateProductCount = () => {
  const contadorProductos = document.getElementById('contador-productos');
  const cantidadProductos = Object.keys(cartItemsData).length;
  contadorProductos.textContent = cantidadProductos;
};

// Actualizar el carrito en el localStorage después de agregar o eliminar productos.
const updateCart = () => {
  saveCartToLocalStorage();
  updateProductCount();
};

// Restaurar el carrito al cargar la página.
const restoreCart = () => {
  loadCartFromLocalStorage();
};

// Función para calcular el total.
const recalculateTotal = () => {
  cartTotal = Object.values(cartItemsData).reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  updateTotal();
};

// Función para indicar el total o si está vacío el carrito.
const updateTotal = () => {
  if (Object.keys(cartItemsData).length == 0) {
    let carritoVacio = `
      <p class="cart-empty">El carrito está vacío</p>
    `;
    totalPagar.innerHTML = carritoVacio;
  } else {
    const formattedTotal = formatCurrency(cartTotal);
    let totalPagarHTML = `
      <h3>Total:</h3>
      <span class="total-pagar">${formattedTotal}</span>
    `;
    totalPagar.innerHTML = totalPagarHTML;
  }
};

// Función para darle formato de pesos colombianos al total (Porque no dio con toLocaleString :c).
const formatCurrency = (amount) => {
  const decimalCount = 2;
  const decimalSeparator = ',';
  const thousandsSeparator = '.';

  const negativeSign = amount < 0 ? '-' : '';
  let [integerPart, decimalPart = ''] = Math.abs(amount).toFixed(decimalCount).split('.');

  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
  decimalPart = decimalPart.padEnd(decimalCount, '0');

  return `${negativeSign}${integerPart}${decimalSeparator}${decimalPart}`;
};

// Función para borrar un producto del carrito.
const trashProduct = (productId) => {
  const productElement = document.getElementById(productId);
  const productContainer = productElement.parentNode;
  const quantityElement = productElement.querySelector('.cantidad-producto-carrito');
  const quantity = parseInt(quantityElement.textContent);

  productContainer.remove();

  cartTotal -= quantity * productPrice;

  // Eliminar el producto de la lista.
  delete cartItemsData[productId];

  // Actualizar el contador de productos.
  const contadorProductos = document.getElementById('contador-productos');
  const currentCount = parseInt(contadorProductos.textContent);
  contadorProductos.textContent = currentCount - 1; // Restar 1 al valor actual.

  recalculateTotal();
  updateCart();

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
    icon: 'success',
    title: 'Producto eliminado :('
  });
};

// Función para vaciar el carrito.
emptyButton.addEventListener('click', () => {
  // Limpiar el carrito.
  cartItems.innerHTML = '';
  cartTotal = 0;
  cartItemsData = {}; // Asignar un objeto vacío.

  // Actualizar el contador de productos.
  const contadorProductos = document.getElementById('contador-productos');
  contadorProductos.textContent = '0'; // Establecer el contador en 0.

  recalculateTotal();
  updateCart();

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
    icon: 'success',
    title: 'Se ha vaciado el carrito.'
  });
});

// Llamar las funciones al cargar la página.
restoreCart();
updateTotal();
updateProductCount();