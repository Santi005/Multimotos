const listSales = () => {

    fetch('http://localhost:8080/sales/')
    .then(response => response.json())
    .then(data => {

        data.forEach((sale, index) => {

            let estadoActual = sale.EstadoEnvio; 

            if (estadoActual === "Entregado") {
                return; // Salta al siguiente iteración del bucle
            }

            if (sale.Empleado == userData.Nombre + ' ' + userData.Apellidos) {
                let row = `
                <tr id='${sale._id}' ${sale.Estado ? "" : "class='venta-desactivada' style='color: #8b8a8a'"}>
                    <td class="text-center">${index + 1}</td>
                    <td class="text-center truncate-text">${sale.Cliente[0]}  ${sale.Cliente[1]}</td>
                    <td class="text-center factura">${sale.Factura}</td>
                    <td class="text-center truncate-text">${sale.Empleado}</td>
                    <td class="text-center"><span class="estado-etiqueta ms-auto" estado="${estadoActual}" id="${sale._id}">${estadoActual}</span>
                    </td>
                    <td class="text-center">
                        
                        <button style="width: 200px" class="btn btn-danger btn-change-status" ${estadoActual === "Entregado" ? "disabled" : ""} data-id="${sale._id}">
                            ${estadoActual === "Por enviar" ? "Enviar" : "Entregar"}
                            <i class="bi bi-truck" style="color: #fff; font-size: 1.3em; cursor: pointer;"></i>
                        </button>
                    </td>
                </tr>
                `
                $('#enviosTable tbody').append(row);

                const btnChangeStatus = $('#enviosTable tbody').find('.btn-change-status:last');
                const icon = `<i class="bi bi-truck" style="color: #fff; font-size: 1.3em;"></i>`;

                if(estadoActual === "Por enviar") {
                    btnChangeStatus.html(`${icon} &nbsp; Enviar`)
                    btnChangeStatus.on('click', () => openModalSend(sale._id, "En camino"));

                    newState = 'En camino';
                } else if (estadoActual === "En camino") {
                    btnChangeStatus.html(`${icon} &nbsp; Confirmar entrega`)
                    btnChangeStatus.on('click', () => openModalDelivered(sale._id, "Entregado"));

                    newState = 'Entregado';
                } else if (estadoActual === "Devolución") {
                    // Proximamente...
                } else if (estadoActual === "Cancelado") {
                    // Proximamente...
                } else {
                    btnChangeStatus.hide();
                }
            } else if (userData.Rol._id == '649d9526652816c809c8e998') {
                let row = `
                <tr id='${sale._id}' ${sale.Estado ? "" : "class='venta-desactivada' style='color: #8b8a8a'"}>
                    <td class="text-center">${index + 1}</td>
                    <td class="text-center truncate-text">${sale.Cliente[0]}  ${sale.Cliente[1]}</td>
                    <td class="text-center factura">${sale.Factura}</td>
                    <td class="text-center truncate-text">${sale.Empleado}</td>
                    <td class="text-center"><span class="estado-etiqueta ms-auto" estado="${estadoActual}" id="${sale._id}">${estadoActual}</span>
                    </td>
                    <td class="text-center">
                        
                        <button style="width: 200px" class="btn btn-danger btn-change-status" ${estadoActual === "Entregado" ? "disabled" : ""} data-id="${sale._id}">
                            ${estadoActual === "Por enviar" ? "Enviar" : "Entregar"}
                            <i class="bi bi-truck" style="color: #fff; font-size: 1.3em; cursor: pointer;"></i>
                        </button>
                    </td>
                </tr>
                `
                $('#enviosTable tbody').append(row);

                const btnChangeStatus = $('#enviosTable tbody').find('.btn-change-status:last');
                const icon = `<i class="bi bi-truck" style="color: #fff; font-size: 1.3em;"></i>`;

                if(estadoActual === "Por enviar") {
                    btnChangeStatus.html(`${icon} &nbsp; Enviar`)
                    btnChangeStatus.on('click', () => openModalSend(sale._id, "En camino"));

                    newState = 'En camino';
                } else if (estadoActual === "En camino") {
                    btnChangeStatus.html(`${icon} &nbsp; Confirmar entrega`)
                    btnChangeStatus.on('click', () => openModalDelivered(sale._id, "Entregado"));

                    newState = 'Entregado';
                } else if (estadoActual === "Devolución") {
                    // Proximamente...
                } else if (estadoActual === "Cancelado") {
                    // Proximamente...
                } else {
                    btnChangeStatus.hide();
                }
            } 

            const truncatedTextElements = document.querySelectorAll(".truncate-text");

            truncatedTextElements.forEach((element) => {
                const text = element.textContent;
                const maxLength = 20;

                if (text.length > maxLength) {
                    const truncatedText = text.substring(0, maxLength - 3) + "...";
                    element.textContent = truncatedText;
                }

            });                  
        });
        $("#enviosTable").DataTable({language: {
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
}

$("#BtnConfirmarSend").on("click", () => {
    const ventaIdModal = $("#ventaId").val();
    const newStateModal = $("#newState").val();
    const employeeSelect = $('#employeesSelectModal').val();
    
    openModalSend(ventaIdModal, newStateModal); // Llamar a openModalSend con los valores adecuados
    updateStateSend(ventaIdModal, newStateModal, employeeSelect);
});

const updateStateSend = async (saleId, newState, employeeSelect) => {
    
    try {
        
        const response = await fetch(`http://localhost:8080/sales/updateToSend/${saleId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                EstadoEnvio: newState,
                Empleado: employeeSelect
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

const showEmployees = async () => {
    const employeesSelect = document.getElementById('employeesSelectModal');

    try {

        await fetch('http://localhost:8080/users/')
        .then(response => response.json())
        .then(data => {

            empleados = data.allUsers.filter((user) => user.Rol === '649ee49fa571b81a623f5772');

            employeesSelect.innerHTML = '';

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Seleccionar empleado';
            employeesSelect.appendChild(defaultOption);

            empleados.forEach((user) => {
                const option = document.createElement('option');
                option.value = `${user.Nombre} ${user.Apellidos}`;
                option.textContent = `${user.Nombre} ${user.Apellidos}`;
                employeesSelect.appendChild(option);
            })

        })

    } catch (error) {
        console.error(error);
    }
}

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