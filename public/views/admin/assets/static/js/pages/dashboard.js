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
