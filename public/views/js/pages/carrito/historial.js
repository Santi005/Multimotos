// Obtener los datos del usuario almacenados en el localStorage
const userData = JSON.parse(localStorage.getItem('userData'));
      
// Acceder al nombre del usuario
const Documento = userData.Documento;

const listSales = () => { 

  // Petición GET.
  fetch(`http://localhost:8080/sales/compras/${Documento}`)
  .then(response => response.json())
  .then(data => {

      // Recorrido de la respuesta del json.
      data.data.forEach((sale, index) => {
          
          // Creación e implementación de la fila a la tabla.
          // Nota: El "sale.Estado ? : Representa un if/else, el ? es para el if y : para el else.
          let estadoActual = sale.EstadoEnvio; 
          let row = `
              <tr id='${sale._id}' ${sale.Estado ? "" : "class='venta-desactivada' style='color: #8b8a8a'"}>
                  <td class="text-center">${index + 1}</td>
                  <td class="text-center truncate-text">${sale.Cliente[0]}  ${sale.Cliente[1]}</td>
                  <td class="text-center">${sale.Factura}</td>
                  <td class="text-center">${sale.Total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
                  <td class="text-center"><span class="estado-etiqueta ms-auto" estado="${estadoActual}" id="${sale._id}">${estadoActual}</span></td>
                  <td class="text-center">
                        <a href="VerDetalleCompra.html?id=${sale._id}"><i class="fas fa-eye" style="color: #f62d51; font-size: 1.3em;"></i></a>
                  </td>
              </tr>
          `
          $('#salesTable tbody').append(row);
          const btnChangeStatus = $('#salesTable tbody').find('.btn-change-status:last');
          const icon = `<i class="bi bi-truck" style="color: #fff; font-size: 1.3em;"></i>`;
          
          if (estadoActual === "Por enviar") {
              btnChangeStatus.html(`${icon} &nbsp; Confirmar envio`);
              btnChangeStatus.on('click', () => openModalSend(sale._id, 'En camino'));

              newState = 'En camino';
          } else if (estadoActual === "En camino") {
              btnChangeStatus.html(`${icon} &nbsp; Confirmar entrega`);
              btnChangeStatus.on('click', () => openModalDelivered(sale._id, "Entregado"));

              newState = 'Entregado';
          } else {
            btnChangeStatus.hide();
          }

          const truncateTextElements = document.querySelectorAll(".truncate-text");

          truncateTextElements.forEach((element) => {
            const text = element.textContent;
            const maxLength = 20;

            if (text.length > maxLength) {
                const truncatedText = text.substring(0, maxLength - 3) + "...";
                element.textContent = truncatedText;
            }
            });

      });
      $("#salesTable").DataTable({language: {
        url: "https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
      }});
  })
  .catch(error => {
      console.error(error);
  });
}

  

listSales();