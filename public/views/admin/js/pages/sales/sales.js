const listSales = () => { 

  // Petición GET.
  fetch('http://localhost:8080/sales/')
  .then(response => response.json())
  .then(data => {

      // Recorrido de la respuesta del json.
      data.forEach((sale, index) => {
          
          // Creación e implementación de la fila a la tabla.
          // Nota: El "sale.Estado ? : Representa un if/else, el ? es para el if y : para el else.
          let estadoActual = sale.EstadoEnvio; 
          let row = `
              <tr id='${sale._id}' ${sale.Estado ? "" : "class='venta-desactivada' style='color: #8b8a8a'"}>
                  <td class="text-center">${index + 1}</td>
                  <td class="text-center truncate-text">${sale.Cliente[0]}  ${sale.Cliente[1]}</td>
                  <td class="text-center factura">${sale.Factura}</td>
                  <td class="text-center">${sale.Total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
                  <td class="text-center"><span class="estado-etiqueta ms-auto" estado="${estadoActual}" id="${sale._id}">${estadoActual}</span>
                  </td>
                  <td class="text-center">
                        <a href="VerDetalle.html?id=${sale._id}"><i class="bi bi-eye" style="color: #f62d51; font-size: 1.3em;"></i></a>&nbsp;&nbsp;&nbsp;
                        <button style="width: 200px" class="btn btn-danger btn-change-status" ${estadoActual === "Entregado" ? "disabled" : ""} data-id="${sale._id}">
                            ${estadoActual === "Por enviar" ? "Enviar" : "Entregar"}
                            <i class="bi bi-truck" style="color: #fff; font-size: 1.3em; cursor: pointer;"></i>
                        </button>
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

const openModalSend = (saleId, newState) => {
    $('#ventaId').val(saleId);
    $('#newState').val(newState);

    $("#modalSend").modal("show");

    // Al hacer clic en el botón "Confirmar" del modal, llamar a la función updateStateSend con los parámetros del botón
    $("#BtnConfirmarSend").on("click", () => {
        const ventaIdModal = $("#ventaId").val();
        const newStateModal = $("#newState").val();
        
        updateStateSend(ventaIdModal, newStateModal);
    });
}

openModalDelivered = (saleId, newState) => {
    $('#ventaId').val(saleId);
    $('#newState').val(newState);

    $('#modalDelivered').modal('show');

    $('#BtnConfirmarDelivered').on('click', () => {
        const ventaIdModal = $("#ventaId").val();
        const newStateModal = $("#newState").val();

        updateStateDelivered(ventaIdModal, newStateModal);
    });
}

const updateStateSend = async (saleId, newState) => {
    
    try {
        
        const response = await fetch(`http://localhost:8080/sales/updateToSend/${saleId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                EstadoEnvio: newState,
            }),
        });

        if (response.ok) {

            const estadoEtiqueta = $(`#salesTable tr#${saleId} .estado-etiqueta`);
            estadoEtiqueta.text(newState);
            
            window.location.reload();
        }

    } catch (error) {
        console.error(error);
        alert('Error al actualizar el estado de envio de la venta.')
    }
}

const updateStateDelivered = async (saleId, newState) => {
    
    try {
        
        const response = await fetch(`http://localhost:8080/sales/updateToDelivered/${saleId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                EstadoEnvio: newState,
            }),
        });

        if (response.ok) {

            const estadoEtiqueta = $(`#salesTable tr#${saleId} .estado-etiqueta`);
            estadoEtiqueta.text(newState);
            
            window.location.reload();
        }

    } catch (error) {
        console.error(error);
        alert('Error al actualizar el estado de entregado de la venta.')
    }
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

const getStatusClass = (estado) => {
    // Asignar la clase correspondiente al estado del envío para cambiar el color del círculo
    switch (estado) {
      case "Por enviar":
        return "estado-etiqueta-por-enviar";
      case "En camino":
        return "estado-etiqueta-enviado";
      case "Entregado":
        return "estado-etiqueta-entregado";
      default:
        return "";
    }
};