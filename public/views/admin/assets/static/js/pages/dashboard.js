let data = [];
let chartProfileVisit;

const filterTypeSelect = document.getElementById('filterType');
const filterValueContainer = document.getElementById('filterContainer');
const filterValueSelect = document.getElementById('filterValue');

// Agregar evento de cambio al primer select
filterTypeSelect.addEventListener('change', function() {
  const selectedOption = this.value;
  if (selectedOption === 'year') {
    // Obtener los años únicos de las ventas
    const uniqueYears = [...new Set(data.map((sale) => new Date(sale.Fecha).getFullYear()))];
    
    // Llenar el segundo select con los años
    fillSelect(filterValueSelect, uniqueYears);
  } else if (selectedOption === 'month') {
    // Obtener los meses únicos de las ventas
    const uniqueMonths = [...new Set(data.map((sale) => new Date(sale.Fecha).getMonth() + 1))];
    console.log('Unique months:', uniqueMonths);
    // Llenar el segundo select con los meses
    fillSelect(filterValueSelect, uniqueMonths);
  }
  
  // Mostrar u ocultar el contenedor del segundo select según la opción seleccionada
  filterValueContainer.classList.toggle('d-none', selectedOption === '');
});

filterValueSelect.addEventListener('change', function() {
  updateChart();
});

function fillSelect(select, options) {
  select.innerHTML = '';
  options.forEach((option) => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.textContent = option;
    select.appendChild(optionElement);
  });
}


// Función para actualizar la gráfica con datos filtrados
function updateChart() {
  const selectedOption = filterTypeSelect.value;
  const selectedValue = filterValueSelect.value;

  console.log('Selected Option:', selectedOption);
  console.log('Selected Value:', selectedValue);

  const filteredData = data.filter((sale) => {
    const saleDate = moment(new Date(sale.Fecha)); // Convertir a un objeto Moment

    console.log('Sale Date:', saleDate.format('YYYY-MM-DD HH:mm:ss'));

    if (selectedOption === 'year') {
      return saleDate.year() === parseInt(selectedValue);
    } else if (selectedOption === 'month') {
      return saleDate.month() + 1 === parseInt(selectedValue);
    }
  });

  console.log('Filtered Data:', filteredData);


  // Procesar los datos filtrados para obtener las ventas por mes
  const salesByMonth = {};

  filteredData.forEach((sale) => {
    const saleDate = new Date(sale.Fecha);
    const year = saleDate.getFullYear();
    const month = saleDate.getMonth() + 1; 
    const monthYear = `${year}-${month}`;
  
    if (!salesByMonth[monthYear]) {
      salesByMonth[monthYear] = 0;
    }
  
    salesByMonth[monthYear]++;
  });
  
  const labels = Object.keys(salesByMonth);

  console.log('Sales by Month:', salesByMonth);

  const ventasPorMes = Object.values(salesByMonth);

  console.log('Labels:', labels);
  console.log('Ventas por mes:', ventasPorMes);

  // Configuración de la gráfica

  const optionsProfileVisit = {
    chart: {
      type: 'bar',
      height: 300,
    },
    series: [
      {
        name: 'ventas',
        data: ventasPorMes,
        color: '#DC3545',
      },
    ],
    xaxis: {
      categories: labels,
      labels: {
        show: true,
        rotate: -45,
      },
    },
    yaxis: {
      forceNiceScale: true,
      labels: {
        formatter: function (value) {
          return Math.round(value); // Redondear el valor a un número entero
        },
      },
    },
  };


  
  // Renderizar o actualizar la gráfica
  if (chartProfileVisit) {
    console.log('Updating chart with options:', optionsProfileVisit);
    chartProfileVisit.updateOptions(optionsProfileVisit);
  } else {
    console.log('Creating new chart with options:', optionsProfileVisit);
    chartProfileVisit = new ApexCharts(
      document.querySelector('#chart-profile-visit'),
      optionsProfileVisit
    );
    chartProfileVisit.render();
  }
}

fetch('http://localhost:8080/sales/')
  .then((response) => response.json())
  .then((dataResponse) => {
    data = dataResponse;
    console.log('Fetched data:', data);

    const uniqueYears = [...new Set(data.map((sale) => new Date(sale.Fecha).getFullYear()))];
    
    // Llenar el segundo select con los años
    fillSelect(filterValueSelect, uniqueYears);

    // Inicializar la gráfica con todos los datos
    updateChart();

  })
  .catch((error) => {
    console.error(error);
  });


  //Grafica de clientes
  const filterYearClientesSelect = document.getElementById('filterYearClientes');
  let chartClientes;
  
  filterYearClientesSelect.addEventListener('change', function() {
    updateClientesChart();
  });
  
  async function updateClientesChart() {
    try {
      const response = await fetch('http://localhost:8080/users/'); // Cambiar la URL a la correcta
      const responseData = await response.json();
  
      if (!Array.isArray(responseData.allUsers)) {
        console.error('UserData is not an array:', responseData);
        return;
      }
  
      const clientes = responseData.allUsers.filter(user =>
        user.Rol === '64defa9c74fb54f6dfe372e9' //ID del rol Cliente
      );
  
      const selectedYear = parseInt(filterYearClientesSelect.value);
      const filteredClientes = clientes.filter(cliente => {
        const registroYear = new Date(cliente.FechaRegistro).getFullYear();
        return registroYear === selectedYear;
      });
  
      const clientesByMonth = {};
  
      filteredClientes.forEach(cliente => {
        const registroMonth = new Date(cliente.FechaRegistro).getMonth();
        if (!clientesByMonth[registroMonth]) {
          clientesByMonth[registroMonth] = 0;
        }
        clientesByMonth[registroMonth]++;
      });
  
      const labels = Object.keys(clientesByMonth);
      const clientesRegistrados = Object.values(clientesByMonth);
  
      const optionsClientes = {
        chart: {
          type: 'line',
          height: 300,
          toolbar: {
            show: true,
            tools: {
              download: true, 
              selection: false,
              zoom: false, 
              zoomin: false, 
              zoomout: false, 
              pan: false,
              reset: false 
            },
          },
        },
        series: [
          {
            name: 'Clientes registrados',
            data: clientesRegistrados,
          },
        ],
        xaxis: {
          categories: labels,
          labels: {
            formatter: function(val) {
              const monthNames = [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
              ];
              return monthNames[val];
            },
            style: {
              fontSize: '10px'
            }
          }
        },
        yaxis: {
          labels: {
            formatter: function(val) {
              return Math.round(val); 
            }
          }
        },
      };
      
  
      if (chartClientes) {
        chartClientes.updateOptions(optionsClientes);
      } else {
        chartClientes = new ApexCharts(document.querySelector('#chart-clientes'), optionsClientes);
        chartClientes.render();
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  
  filterYearClientesSelect.addEventListener('change', function() {
    updateClientesChart();
  });
  

// Obtener el año actual
const currentYear = new Date().getFullYear();

// Hacer una petición para obtener los usuarios registrados
async function getUsers() {
  try {
    const response = await fetch('http://localhost:8080/users/'); // Cambiar la URL a la correcta
    const responseData = await response.json();
    return responseData.allUsers;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

(async function() {
  const users = await getUsers();
  
  // Obtener los años en los que tienes registros de usuarios
  const registeredYears = users.map(user => new Date(user.FechaRegistro).getFullYear());

  // Agregar opciones para los años en los que tienes registros
  for (let year = currentYear; year >= Math.min(...registeredYears); year--) {
    const optionElement = document.createElement('option');
    optionElement.value = year;
    optionElement.textContent = year;
    filterYearClientesSelect.appendChild(optionElement);
  }

  // Establecer el valor por defecto al año actual y actualizar la gráfica
  filterYearClientesSelect.value = currentYear;
  updateClientesChart();
})();


  //Grafica de top de productos


  let chartProductos;

  async function updateProductosChart() {
    try {
      const response = await fetch('http://localhost:8080/sales/'); 
      const ventas = await response.json();
  
      if (!Array.isArray(ventas)) {
        console.error('SalesData is not an array:', ventas);
        return;
      }


    // Crear un objeto para almacenar la cantidad de cada producto vendido
    const productosVendidos = {};

    ventas.forEach(venta => {
      venta.Productos.forEach(producto => {
        if (!productosVendidos[producto.Nombre]) {
          productosVendidos[producto.Nombre] = 0;
        }
        productosVendidos[producto.Nombre] += producto.Cantidad;
      });
    });

    // Ordenar los productos más vendidos en orden descendente
    const topProductos = Object.keys(productosVendidos).sort((a, b) => productosVendidos[b] - productosVendidos[a]).slice(0, 5);

    const labels = topProductos;
    const cantidadVendida = topProductos.map(producto => productosVendidos[producto]);

    const optionsProductos = {
      chart: {
        type: 'pie',
        height: 300,
        toolbar: {
          show: true,
          tools: {
            download: true, 
            selection: false,
            zoom: false, 
            zoomin: false, 
            zoomout: false, 
            pan: false,
            reset: false 
          },
        },
      },
      series: cantidadVendida,
      labels: labels,
      legend: {
        show: true,
        position: 'bottom',
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };

    if (chartProductos) {
      chartProductos.updateOptions(optionsProductos);
    } else {
      chartProductos = new ApexCharts(document.querySelector('#chart-productos'), optionsProductos);
      chartProductos.render();
    }
  } catch (error) {
    console.error(error);
  }
}

updateProductosChart();
