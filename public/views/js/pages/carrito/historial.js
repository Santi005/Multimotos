// Obtener los datos del usuario almacenados en el localStorage
const userData = JSON.parse(localStorage.getItem('userData'));
      
// Acceder al nombre del usuario
const Documento = userData.Documento;

const PAGE_SIZE = 5; // Tamaño de página
let currentPage = 1; // Página actual
let totalPages = 0; // Total de páginas
let salesData = []; // Almacena los datos de todas las ventas
let filteredSalesData = []; // Almacena los datos de las ventas filtradas

const listSales = () => {
  // Petición GET.
  fetch(`http://localhost:8080/sales/compras/${Documento}`)
    .then((response) => response.json())
    .then((data) => {
      salesData = data.data;

      console.log(salesData);
      console.log('aaaaaaaaaaa');

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
                  <a href="VerDetalleCompra.html?id=${sale._id}" class="btn btn-secondary"><i class="fas fa-eye" style="color: #fff"></i> &nbsp; Ver detalles</a>
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

const handleSearch = () => {
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
    // Restablece los datos filtrados a los datos completos
    filteredSalesData = [...salesData];
  }

  // Vuelve a listar las ventas con el nuevo término de búsqueda o sin él
  listSales();
};
  
// Agrega un evento al campo de búsqueda para capturar la entrada del usuario
$('#searchInputSales').on('input', handleSearch);

listSales();