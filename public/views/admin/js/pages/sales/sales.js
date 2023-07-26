const PAGE_SIZE = 5; // Tamaño de página
let currentPage = 1; // Página actual
let totalPages = 0; // Total de páginas
let salesData = []; // Almacena los datos de todas las ventas
let filteredSalesData = []; // Almacena los datos de las ventas filtradas

const listSales = () => {
  // Petición GET.
  fetch('http://localhost:8080/sales/')
    .then((response) => response.json())
    .then((data) => {
      salesData = data;

      // Obtiene la búsqueda del usuario
      const searchValue = $('#searchInputSales').val().toLowerCase();

      if (searchValue !== '') {
        // Filtra las ventas
        filteredSalesData = salesData.filter((sale) => {
          return (
            (sale.Cliente[0] && sale.Cliente[0].toLowerCase().includes(searchValue)) ||
            (sale.Cliente[1] && sale.Cliente[1].toLowerCase().includes(searchValue)) ||
            (sale.Factura && sale.Factura.toString().includes(searchValue)) ||
            (sale.Total && sale.Total.toString().includes(searchValue)) ||
            (sale.Fecha && new Date(sale.Fecha).toLocaleString('es-CO').includes(searchValue))
          );
        });
      } else {
        // Muestra todas las ventas si no hay una búsqueda
        filteredSalesData = [...salesData];
      }

      // Calcula el total de ventas y total de páginas
      const totalSales = filteredSalesData.length;
      totalPages = Math.ceil(totalSales / PAGE_SIZE);

      // Ajusta el número de página según la búsqueda
      if (currentPage > totalPages) {
        currentPage = totalPages;
      }

      // Calcula el índice inicial y final de las ventas a mostrar en la página
      const startIndex = (currentPage - 1) * PAGE_SIZE;
      const endIndex = Math.min(startIndex + PAGE_SIZE, totalSales);

      // Limpiar la tabla antes de cargar los nuevos datos
      const tableBody = document.getElementById('salesTable').getElementsByTagName('tbody')[0];
      tableBody.innerHTML = '';

      if (filteredSalesData.length > 0) {
        // Recorre las ventas que se van a mostrar en la página actual y genera la tabla
        for (let i = startIndex; i < endIndex; i++) {
          const sale = filteredSalesData[i];

          // Verifica si la venta existe antes de acceder a sus propiedades
          if (sale) {
            let row = `
              <tr id='${sale._id}'${sale.Estado ? '' : "class='venta-desactivada' style='color: #8b8a8a'"}>
                <td>${i + 1}</td>
                <td>${sale.Cliente[0]}  ${sale.Cliente[1]}</td>
                <td>${sale.Factura}</td>
                <td>${sale.Total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
                <td>${new Date(sale.Fecha).toLocaleString('es-CO')}</td>
                <td>
                  <a href="VerDetalle.html?id=${sale._id}"><i class="fas fa-eye" style="color: red"></i></a>
                  &nbsp;&nbsp;&nbsp;
                </td>
              </tr>
            `;
            tableBody.innerHTML += row;
          }
        }
      } else {
        // Muestra un mensaje cuando no se encuentran ventas
        tableBody.innerHTML = `
          <tr>
            <td colspan="6">No se encontraron ventas.</td>
          </tr>
        `;
      }

      // Crea la sección de paginación
      const paginationContainer = document.querySelector('.pagination');
      paginationContainer.innerHTML = '';

      // Recorre el número total de páginas y crea el enlace para cambiar de página
      for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
                    const link = document.createElement('button');
                    link.href = '#';
                    link.style.fontSize = '15px';
                    link.style.backgroundColor = '#EBEBEA';
                    link.style.marginLeft = '4px';
                    link.classList.add('btn');

                    link.innerHTML = i;
                    li.appendChild(link);

        // Agrega la clase 'active' al enlace de la página actual
        if (i === currentPage) {
          li.classList.add('active');
        }

        // Se agrega el evento al hacer clic en el enlace para cambiar la página actual y listar las ventas correspondientes
        link.addEventListener('click', () => {
          currentPage = i;
          listSales();
        });

        paginationContainer.appendChild(link);
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

// Método buscar
// Se ejecuta cuando se usa el input de búsqueda
$('#searchInputSales').on('input', function () {
  currentPage = 1; // Reinicia la página al hacer una nueva búsqueda
  listSales(); // Lista las ventas buscadas
});

// Llama a la función listSales cuando la página se haya cargado completamente
document.addEventListener('DOMContentLoaded', () => {
  listSales();
});

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
