// Obtener elementos del carrito en la página del carrito
const cartItemsTable = document.getElementById('cartItemsBody');
const cartTotalFooter = document.getElementById('cartTotalFooter');
const clearCartButton = document.getElementById('clearCartButton');
const emptyCartMessage = document.getElementById('emptyCartMessage');
var llenarInfoButton = document.getElementById("llenarInfoButton");

// Función para actualizar la tabla del carrito en la página del carrito
const updateCartTable = () => {
  const cartItemsData = getCartItemsData();
  let tableHTML = '';
  let total = 0;

  for (const productId in cartItemsData) {
    const productData = cartItemsData[productId];
    const { quantity, price, details } = productData;
    const subtotal = quantity * price;
    total += subtotal;

    tableHTML += `
      <tr>
        <td class="align-middle"><img src="${window.location.origin}/public/uploads/${details.productImage}" alt="${details.productImage}" class="product-image" width="80px" height="80px"></td>
        <td class="align-middle">${details.productName}</td>
        <td class="align-middle">
          <button class="cart-increase-decrease" onclick="decreaseQuantity('${productId}')">-</button>
          <input maxlength="3" class="cart-quantity-input text-center" type="text" inputmode="numeric" pattern="[0-9]*" min="1" max="100" value="${quantity}" onchange="updateQuantity('${productId}', this.value);">
          <button class="cart-increase-decrease" onclick="increaseQuantity('${productId}')">+</button>
        </td>
        <td class="align-middle">${price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
        <td class="align-middle">${subtotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
        <td class="align-middle"><i class="fas fa-trash icon-trash" onclick="deleteCartItem('${productId}')"></i></i></td>
      </tr>
    `;
  }

  cartItemsTable.innerHTML = tableHTML;

  cartTotalFooter.textContent = `Total: ${total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}`;

  // Mostrar mensaje de carrito vacío si no hay productos
  if (Object.keys(cartItemsData).length == 0) {
    emptyCartMessage.style.display = 'block';
    cartTotalFooter.style.display = 'none';
    llenarInfoButton.style.display = 'none'
  } else {
    emptyCartMessage.style.display = 'none';
    cartTotalFooter.style.display = 'block';
  }
};

const updateQuantityMax = (productId, value) => {
  const cartItemsData = getCartItemsData();
  let quantity = parseInt(value);
  if (quantity > cartItemsData[productId].details.quantityProduct) {
    quantity = cartItemsData[productId].details.quantityProduct;
  }
  cartItemsData[productId].quantity = quantity;
  saveCartItemsData(cartItemsData);
  updateCartTable();
}


const updateQuantity = (productId, value) => {
  const cartItemsData = getCartItemsData();
  let quantity = parseInt(value);
  if (isNaN(quantity) || quantity < 1) {
    quantity = 1;
  } else if (quantity > cartItemsData[productId].details.quantityProduct) {
    quantity = cartItemsData[productId].details.quantityProduct;

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1000,
      didOpen: (toast) => {
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'warning',
      title: 'Cantidad máxima alcanzada'
    });
  }

console.log(cartItemsData[productId].details.quantityProduct)

  cartItemsData[productId].quantity = quantity;
  saveCartItemsData(cartItemsData);
  updateCartTable();
};

// Función para aumentar la cantidad de un producto en el carrito
const increaseQuantity = (productId) => {
  const cartItemsData = getCartItemsData();
  if (cartItemsData[productId]) {
    const maxQuantity = cartItemsData[productId].details.quantityProduct;
    if (cartItemsData[productId].quantity < maxQuantity) {
      cartItemsData[productId].quantity += 1;
      saveCartItemsData(cartItemsData);
      updateCartTable();

      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
        didOpen: (toast) => {
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })

      Toast.fire({
        icon: 'success',
        title: 'Se aumentó la cantidad :)'
      });
    } else {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
        didOpen: (toast) => {
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })

      Toast.fire({
        icon: 'warning',
        title: 'Cantidad máxima alcanzada'
      });
    }
  }
};

// Función para restar la cantidad de un producto en el carrito
const decreaseQuantity = (productId) => {
  const cartItemsData = getCartItemsData();
  if (cartItemsData[productId] && cartItemsData[productId].quantity > 1) {
    cartItemsData[productId].quantity -= 1;
    saveCartItemsData(cartItemsData);
    updateCartTable();

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1000,
      didOpen: (toast) => {
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'success',
      title: 'Se decrementó la cantidad :('
    });

  } else if (cartItemsData[productId] && cartItemsData[productId].quantity === 1) {
    delete cartItemsData[productId];
    saveCartItemsData(cartItemsData);
    updateCartTable();

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1000,
      didOpen: (toast) => {
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'success',
      title: 'Oops! cantidad insuficiente.'
    });
  }
};

// Función para eliminar un producto del carrito
const deleteCartItem = (productId) => {
  const cartItemsData = getCartItemsData();
  if (cartItemsData[productId]) {
    delete cartItemsData[productId];
    saveCartItemsData(cartItemsData);
    updateCartTable(); // Actualizamos la tabla después de eliminar el elemento

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
  }
};

// Función para vaciar el carrito
const clearCart = () => {
  cartTotal = 0;
  const cartItemsData = {};
  saveCartItemsData(cartItemsData);
  updateCartTable(); // Actualizamos la tabla después de vaciar el carrito

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
    title: 'El carrito ha sido vaciado.'
  });

};

// Función para obtener los datos del carrito del local storage en la página del carrito
const getCartItemsData = () => {
  const savedCartItemsData = localStorage.getItem('cartItemsData');
  if (savedCartItemsData) {
    return JSON.parse(savedCartItemsData);
  }
  return {};
};

// Función para guardar los datos del carrito en el local storage
const saveCartItemsData = (cartItemsData) => {
  localStorage.setItem('cartItemsData', JSON.stringify(cartItemsData));
};

// Función para cargar el carrito en la página del carrito
const loadCartItems = () => {
  updateCartTable();
};

// Cargar los elementos del carrito al cargar la página
window.addEventListener('load', () => {
  loadCartItems();
  updateCartTable();
});