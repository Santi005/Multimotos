window.onload = function () {

    var chart = new CanvasJS.Chart("grafica1", {
        theme: "light2", // "light1", "light2", "dark1", "dark2"
        animationEnabled: true,
        axisX: {
            interval: 1,
            intervalType: "month",
            valueFormatString: "MMM"
        },
        axisY:{
            title: "Cantidad de Usuarios",
            includeZero: true,
        },
        data: [{        
            type: "line",
            markerSize: 12,
            xValueFormatString: "MMM, YYYY",
            yValueFormatString: "###.#",
            dataPoints: [        
                { x: new Date(2022, 00, 1), y: 61,   markerColor: "#6B8E23" },
                { x: new Date(2022, 01, 1), y: 71,   markerColor: "#6B8E23" },
                { x: new Date(2022, 02, 1) , y: 55,  markerColor: "#6B8E23", },
                { x: new Date(2022, 03, 1) , y: 50,  markerColor: "#6B8E23", },
                { x: new Date(2022, 04, 1) , y: 65,  markerColor: "#6B8E23" },
                { x: new Date(2022, 05, 1) , y: 85,  markerColor: "#6B8E23" },
                { x: new Date(2022, 06, 1) , y: 68,  markerColor: "#6B8E23", },
                { x: new Date(2022, 07, 1) , y: 28,  markerColor: "#6B8E23", },
                { x: new Date(2022, 08, 1) , y: 34,  markerColor: "#6B8E23" },
                { x: new Date(2022, 09, 1) , y: 24,  markerColor: "#6B8E23", },
                { x: new Date(2022, 10, 1) , y: 44,  markerColor: "#6B8E23" },
                { x: new Date(2022, 11, 1) , y: 34,  markerColor: "#6B8E23", }
            ]
        }]
    });
    chart.render();
    
    var grafica2 = new CanvasJS.Chart("grafica2", {
        animationEnabled: true,
        theme: "light2", // "light1", "light2", "dark1", "dark2"
        axisY: {
            title: "Cantidad"
        },
        data: [{        
            type: "column",  
    
            legendMarkerColor: "grey",
            dataPoints: [      
                { y: 30, label: "Llantas" },
                { y: 26,  label: "Frenos" },
                { y: 16,  label: "Rines" },
                { y: 15,  label: "Retrovisores" },
                { y: 14,  label: "Direccionales" },
            ]
        }]
    });
    grafica2.render();

    var chart = new CanvasJS.Chart("graficaventas", {
        theme: "light2", // "light1", "light2", "dark1", "dark2"
        animationEnabled: true,
        axisX: {
            interval: 1,
            intervalType: "month",
            valueFormatString: "MMM"
        },
        axisY:{
            title: "Cantidad de Usuarios",
            includeZero: true,
        },
        data: [{        
            type: "line",
            markerSize: 12,
            xValueFormatString: "MMM, YYYY",
            yValueFormatString: "###.#",
            dataPoints: [        
                { x: new Date(2022, 00, 1), y: 300000,   markerColor: "#6B8E23" },
                { x: new Date(2022, 01, 1), y: 420000,   markerColor: "#6B8E23" },
                { x: new Date(2022, 02, 1) , y: 750000,  markerColor: "#6B8E23", },
                { x: new Date(2022, 03, 1) , y: 360000,  markerColor: "#6B8E23", },
                { x: new Date(2022, 04, 1) , y: 650000,  markerColor: "#6B8E23" },
                { x: new Date(2022, 05, 1) , y: 850000,  markerColor: "#6B8E23" },
                { x: new Date(2022, 06, 1) , y: 680000,  markerColor: "#6B8E23", },
                { x: new Date(2022, 07, 1) , y: 280000,  markerColor: "#6B8E23", },
                { x: new Date(2022, 08, 1) , y: 200000,  markerColor: "#6B8E23" },
                { x: new Date(2022, 09, 1) , y: 240000,  markerColor: "#6B8E23", },
                { x: new Date(2022, 10, 1) , y: 440000,  markerColor: "#6B8E23" },
                { x: new Date(2022, 11, 1) , y: 340000,  markerColor: "#6B8E23", }
            ]
        }]
    });
    chart.render();
    
    }
    