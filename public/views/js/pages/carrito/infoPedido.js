userData = JSON.parse(localStorage.getItem('userData'));   

console.log(userData)

const Documento = userData.Documento;
const firstName = userData.Nombre;
const lastName = userData.Apellidos;
const email = userData.Correo
let cantidadProducto;

document.getElementById('idCard').value = Documento;
document.getElementById('firstName').value = firstName;
document.getElementById('lastName').value = lastName;
document.getElementById('email').value = email;

// Obtener referencia a la lista de productos en el resumen de compra
var productList = document.getElementById('productList');
const totalInfoCart = document.getElementById('totalInfoCart');
var citySelect = document.getElementById('city');
var shippingCostElement = document.getElementById('shippingCost');
var subtotalInfoCart = document.getElementById('subtotalInfoCart');
const iniciarPagoButton = document.getElementById('Btn');

// Variables para el costo de envío y subtotal
var shippingCost = 0;
var subtotal = 0;

// Función para el costo de envío
const updateShippingCost = () => {
    if (citySelect.value === 'bello') {
        shippingCost = 15000;
    } else if (citySelect.value === 'medellin') {
        shippingCost = 10000;
    } else {
        shippingCost = 0;
    }

    shippingCostElement.textContent = `Costo de envío: ${shippingCost.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}`;

    // Actualizar el resumen después de cambiar el costo de envío
    updateResume();
}

// Función para actualizar el resumen
const updateResume = () => {
    const cartItemsData = getCartItemsData();
    let cardHTML = '';
    let total = 0;
    subtotal = 0;
    const iva = 0.19;  

    for (const productId in cartItemsData) {
        const productData = cartItemsData[productId];
        const { price, details } = productData;
        subtotal += price;

        cardHTML += `
            <li class="list-group-item text-center">${details.truncatedName} - ${price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</li>
        `;
    }

    total = (subtotal * iva) + subtotal + shippingCost;

    productList.innerHTML = cardHTML;

    subtotalInfoCart.textContent = `Subtotal: ${subtotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}`;
    totalInfoCart.textContent = `Total: ${total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}`;
}

// Función para obtener los datos del carrito del local storage en la página del carrito
const getCartItemsData = () => {
    const savedCartItemsData = localStorage.getItem('cartItemsData');
    if (savedCartItemsData) {
        return JSON.parse(savedCartItemsData);
    }
    return {};
};

// Función para cargar el carrito en la página del carrito
const loadCartItems = () => {
    updateResume();
};

citySelect.addEventListener('change', (event) => {
    console.log(citySelect.value)
});

const checkout = async () => {

    const cartItemsData = getCartItemsData();
    const productos = [];
    const cliente = [];
    let subtotal = 0;
    const iva = 0.19;

    for (const productId in cartItemsData) {
        const productData = cartItemsData[productId];
        const { quantity, price, details } = productData;
        subtotal += price;

        productos.push({
            Id: productId,
            Nombre: details.productName,
            Cantidad: quantity,
            Precio: price
        });

    }

    const adress = document.getElementById('address').value;
    const direccionCompleta = `${citySelect.value}, ${adress}`;

    // Obtener los datos del cliente de los input
    cliente.push(userData.Nombre);
    cliente.push(userData.Apellidos);
    cliente.push(direccionCompleta);
    cliente.push(document.getElementById('email').value);
    cliente.push(document.getElementById('phone').value);
    cliente.push(userData.Documento);

    const ventaData = {
        Productos: productos,
        Cliente: cliente,
        Envio: shippingCost,
        Iva: subtotal * iva
    };

    const response = await fetch(`http://localhost:8080/payment/create-order`,{
        method: 'POST',
        'headers': { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            venta: ventaData,
        })
    });
    const data = await response.json();
    console.log(data);
    window.location.href = data.init_point;
};

// Cargar los elementos del carrito al cargar la página
window.addEventListener('load', () => {
    loadCartItems();
    updateShippingCost();
});