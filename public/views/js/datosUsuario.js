        // Obtener los datos del usuario almacenados en el localStorage
        const userData = JSON.parse(localStorage.getItem('userData'));
      
        // Acceder al nombre del usuario
        const nombreUsuario = userData.Nombre + ' ' + userData.Apellidos;



        // console.log('Permisos',permisoDashboard);
        
        // Mostrar los datos del usuario en los elementos HTML correspondientes
        document.getElementById('nombreUsuario').textContent = nombreUsuario;
