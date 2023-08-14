let detalleVenta;
let ivaPorcentajeFormateado;

// Tomar id desde la url.
$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        viewDetail(id);
    }
});

function viewDetail(id) {

    fetch(`http://localhost:8080/sales/${id}`)
    .then(response => response.json())
    .then(data => {

        console.log(data);
        
        // Asignación de detalle venta que devuelve el Json.
        detalleVenta = data.data[0];
        const multIva = detalleVenta.Iva * 100;
        ivaPorcentajeFormateado = multIva.toFixed(0) + '%';

        // Insertar datos en los elementos HTML
        document.getElementById('documento').textContent = detalleVenta.Cliente[5];
        document.getElementById('cliente').textContent = detalleVenta.Cliente[0] + ' ' + detalleVenta.Cliente[1];
        document.getElementById('telefono').textContent = detalleVenta.Cliente[4];
        document.getElementById('direccion').textContent = detalleVenta.Cliente[2];
        document.getElementById('correo').textContent = detalleVenta.Cliente[3];
        document.getElementById('fecha').textContent = new Date(detalleVenta.Fecha).toLocaleString('es-CO');
        document.getElementById('venta-no').textContent = detalleVenta.Factura;
        document.getElementById('precio-envio').textContent = detalleVenta.Envio.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
        document.getElementById('estado').textContent = detalleVenta.EstadoEnvio;
        document.getElementById('total-iva').textContent = ivaPorcentajeFormateado
        document.getElementById('total').textContent = detalleVenta.Total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });

        // Insertar datos de la tabla de productos (puedes usar un bucle para esto)
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

const generatePDF = () => {
    const docDefinition = {
        content: [
            {
              columns: [
                {
                  stack: [
                    { text: `Documento: ${detalleVenta.Cliente[5]}`, style: 'info' },
                    { text: `Cliente: ${detalleVenta.Cliente[0]} ${detalleVenta.Cliente[1]}`, style: 'info' },
                    { text: `Teléfono: ${detalleVenta.Cliente[4]}`, style: 'info' },
                    { text: `Dirección: ${detalleVenta.Cliente[2]}`, style: 'info' },
                    { text: `Correo: ${detalleVenta.Cliente[3]}`, style: 'info' }
                  ]
                },
                {
                  stack: [
                    { text: `Fecha: ${new Date(detalleVenta.Fecha).toLocaleString('es-CO')}`, style: 'info' },
                    { text: `N° Cotización: ${detalleVenta.Factura}`, style: 'info' },
                    { text: `Precio envío: ${detalleVenta.Envio.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}`, style: 'info' },
                    { text: `Estado: ${detalleVenta.EstadoEnvio}`, style: 'info' },
                    { text: `Total IVA: ${ivaPorcentajeFormateado}`, style: 'info' }
                  ]
                }
              ],
              columnGap: 40 // Espacio entre las columnas
            },
            { text: '\nProductos', style: 'subheader' },
            {
                table: {
                    headerRows: 1,
                    widths: ['auto', '*', '*', '*', '*'],
                  body: [
                    ['#', 'Producto', 'Precio Unitario', 'Cantidad', 'Total'],
                    ...detalleVenta.Productos.map((producto, index) => [
                        index + 1,
                        producto.Nombre,
                        producto.Precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }),
                        producto.Cantidad,
                        (producto.Precio * producto.Cantidad).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })
                    ])
                  ]
                },
                layout: 'lightHorizontalLines'
            },
            { text: `Total: ${detalleVenta.Total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}`, style: 'total' }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                alignment: 'center',
                margin: [0, 0, 0, 10]
            },
            subheader: {
                fontSize: 16,
                bold: true,
                margin: [0, 10, 0, 5]
            },
            info: {
                fontSize: 12,
                margin: [0, 0, 0, 5]
            },
            total: {
                fontSize: 14,
                bold: true,
                margin: [0, 10, 0, 0]
            }
        }
    };

    // Generar el PDF
    const pdfDoc = pdfMake.createPdf(docDefinition);
    pdfDoc.download('detalle_venta.pdf'); // Descargar el PDF con el nombre 'detalle_venta.pdf'
};