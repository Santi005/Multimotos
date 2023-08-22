// Fetch para obtener los datos de ventas desde el servidor
fetch('http://localhost:8080/sales/')
  .then((response) => response.json())
  .then((data) => {
    const salesByMonth = {};

    // Procesar los datos para obtener las ventas por mes
    data.forEach((sale) => {
      const saleDate = new Date(sale.Fecha);
      const monthYear = `${saleDate.getMonth() + 1}-${saleDate.getFullYear()}`;
      if (!salesByMonth[monthYear]) {
        salesByMonth[monthYear] = 0;
      }
      salesByMonth[monthYear]++;
    });

    // Crear los arreglos para la gráfica
    const months = Object.keys(salesByMonth);
    const ventasPorMes = Object.values(salesByMonth);

        // Actualizar la gráfica con los datos de ventas por mes

    var optionsProfileVisit = {
      annotations: {
        position: "back",
      },
      dataLabels: {
        enabled: false,
      },
      chart: {
        type: "bar",
        height: 300,
      },
      fill: {
        opacity: 1,
      },
      plotOptions: {},
      series: [
        {
          name: "ventas",
          data: ventasPorMes,
        },
      ],
      colors: "#EF4B4B",
      xaxis: {
        categories: months,
      },
      yaxis: {
        forceNiceScale: true, // Esto evitará los decimales en el eje Y
        labels: {
          formatter: function (value) {
            return Math.round(value); // Redondear al número entero más cercano
          },
        },
      },
    };


    var chartProfileVisit = new ApexCharts(
      document.querySelector("#chart-profile-visit"),
      optionsProfileVisit
    );

    chartProfileVisit.render();
  })
  .catch((error) => {
    console.error(error);
  });
