userData = JSON.parse(localStorage.getItem('userData'));   

console.log(userData);

const Documento = userData.Documento;
const firstName = userData.Nombre;
const lastName = userData.Apellidos;
const email = userData.Correo;
const celular = userData.Celular;
const direccion = userData.Direccion;
let cantidadProducto;

const input = document.getElementById('autocompleteDirection');
const latitudeField = document.getElementById('latitude');
const longitudeField = document.getElementById('longitude');

const options = {
    componentRestrictions: { 
      country: 'CO', // Código de país para Colombia
    }
  };

// Inicializar el autocompletado
const autocomplete = new google.maps.places.Autocomplete(input, options);

let city = '';

// Escuchar el evento de lugar seleccionado
autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();

    if (!place.geometry) {
        console.log("No se encontró ningún lugar para la selección.");
        return;
    }

    // Obtener la latitud y longitud del lugar seleccionado
    const latitude = place.geometry.location.lat();
    const longitude = place.geometry.location.lng();

    const addressComponents = place.address_components || [];
    for (const component of addressComponents) {
        if (component.types.includes('locality')) {
            city = component.long_name;
            break;
        }
    }

    // Crear un objeto con la información necesaria
    const selectedPlace = {
        name: place.name,
        address: place.formatted_address,
        latitude: latitude,
        longitude: longitude
    };

    latitudeField.value = latitude
    longitudeField.value = longitude
    // cliente.push(latitude);
    // cliente.push(longitude);

    // Convertir el objeto a JSON
    const selectedPlaceJSON = JSON.stringify(selectedPlace);

    // Actualizar el costo de envío y el resumen después de cambiar la ciudad
    updateShippingCost();
    updateResume();

    console.log("Lugar seleccionado:", selectedPlaceJSON);
});

document.getElementById('idCard').value = Documento;
document.getElementById('firstName').value = firstName;
document.getElementById('lastName').value = lastName;
document.getElementById('email').value = email;
document.getElementById('phone').value = celular;

// Obtener referencia a la lista de productos en el resumen de compra
var productList = document.getElementById('productList');
const totalInfoCart = document.getElementById('totalInfoCart');
var shippingCostElement = document.getElementById('shippingCost');
var subtotalInfoCart = document.getElementById('subtotalInfoCart');
const iniciarPagoButton = document.getElementById('checkout');

// Variables para el costo de envío y subtotal
var shippingCost = 0;
var subtotal = 0;

// Función para el costo de envío
const updateShippingCost = () => {
    if (city === 'Bello') {
        shippingCost = 15000;
        shippingCostElement.textContent = `Costo de envío: ${shippingCost.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}`;
        iniciarPagoButton.classList.remove('disabled-link');
    } else if (city === 'Medellin' || city === 'Medellín') {
        shippingCost = 10000;
        shippingCostElement.textContent = `Costo de envío: ${shippingCost.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}`;
        iniciarPagoButton.classList.remove('disabled-link');
    } else {
        iniciarPagoButton.classList.add('disabled-link');
        shippingCost = 0;
        shippingCostElement.textContent = `Costo de envío: No disponible.`;

    }

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

    const direccionCompleta = input.value;

    // Obtener los datos del cliente de los input
    cliente.push(userData.Nombre);
    cliente.push(userData.Apellidos);
    cliente.push(direccionCompleta);
    cliente.push(document.getElementById('email').value);
    cliente.push(document.getElementById('phone').value);
    cliente.push(userData.Documento);
    cliente.push(latitudeField.value);
    cliente.push(longitudeField.value);

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