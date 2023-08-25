// Tomar id desde la url.
$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        viewDetail(id);
    }
});

function viewDetail(id) {
    
    // Petición G1ET.
    fetch(`http://localhost:8080/sales/${id}`)
    .then(response => response.json())
    .then(data => {
        
        // Asignación de detalle venta que devuelve el Json.
        const detalleVenta = data.data[0];
        const multIva = detalleVenta.Iva * 100;
        ivaPorcentajeFormateado = multIva.toFixed(0) + '%';

        // Asignación de valores hacia los input que ya existen.
        $('#documentoInput').val(detalleVenta.Cliente[0]);
        $('#nombreInput').val(detalleVenta.Cliente[0]);
        $('#apellidosInput').val(detalleVenta.Cliente[1])
        $('#telefonoInput').val(detalleVenta.Cliente[4])
        $('#direccionInput').val(detalleVenta.Cliente[2])
        $('#emailInput').val(detalleVenta.Cliente[3])
        $('#fechaInput').val(new Date(detalleVenta.Fecha).toLocaleString('es-CO'))
        $('#totalEnvioInput').val(detalleVenta.Envio.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }))
        $('#totalIvaInput').val(ivaPorcentajeFormateado)
        $('#totalCompraInput').val(detalleVenta.Total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }))

        // Recorrido para llenar la tabla de productos.
        detalleVenta.Productos.forEach((producto, index) => {

            // Creación e implementación de la fila a la tabla.
            let row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${producto.Nombre}</td>
                    <td>${producto.Precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
                    <td>${producto.Cantidad}</td>
                    <td>${(producto.Precio * producto.Cantidad).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
                </tr>
            `
            $('#productosTable tbody').append(row);
        });
    })
    .catch(error => {
        console.error(error);
    });
}

localStorage.removeItem('cartItemsData');

$('#btnImprimir').on('click', function () {
    window.print();
    return false;
});