const listSales = () => { 

  // Petición GET.
  fetch('http://localhost:8080/sales/')
  .then(response => response.json())
  .then(data => {

      // Recorrido de la respuesta del json.
      data.forEach((sale, index) => {
          
          // Creación e implementación de la fila a la tabla.
          // Nota: El "sale.Estado ? : Representa un if/else, el ? es para el if y : para el else. 
          let row = `
              <tr id='${sale._id}'${sale.Estado ? "" : "class='venta-desactivada' style='color: #8b8a8a'"}>
                  <td>${index + 1}</td>
                  <td>${sale.Cliente[0]}  ${sale.Cliente[1]}</td>
                  <td>${sale.Factura}</td>
                  <td>${sale.Total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
                  <td>${new Date(sale.Fecha).toLocaleString('es-CO')}</td>
                  <td>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                      <a href="VerDetalle.html?id=${sale._id}"><i class="bi bi-eye" style="color: #f62d51; font-size: 1.3em;"></i></a>
                  </td>
              </tr>
          `
          $('#salesTable tbody').append(row);
      });
      $("#salesTable").DataTable({language: {
        url: "https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
      }});
  })
  .catch(error => {
      console.error(error);
  });
}

// Función para desactivar la venta.
function desactivedSale(id) {
  $('#DesactivarVenta').modal('show'); // Mostrar el modal al dar clic.
  $('#idVentaDesactivada').val(id); // Pasar el id al input oculto en el modal.
}

// Evento de clic para el botón de confirmación en el modal.
$('#confirmarDesactivar').on('click', () => {
  const id = $('#idVentaDesactivada').val(); // Obtener el id de la venta a desactivar.

  // Petición PUT.
  fetch(`http://localhost:8080/sales/desactivate/${id}`, {
      method: 'PUT'
  })
  .then(response => response.json())
  .then(data => {
      
      data.Estado = false;

      // Obtener el elemento de la fila y aplicar la clase para desactivar la venta.
      const desactivatedRow = document.getElementById(id);
      desactivatedRow.classList.add('venta-desactivada');
      desactivatedRow.style.color = "#8b8a8a";

      // Cerrar el modal al dar clic.
      $('#DesactivarVenta').modal('hide');
  })
  .catch(error => {
      console.log(error);
  });
});
