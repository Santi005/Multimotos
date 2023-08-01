        // Obtener los datos del usuario almacenados en el localStorage
        const userData = JSON.parse(localStorage.getItem('userData'));
      
        // Acceder al nombre del usuario
        const nombreUsuario = userData.Nombre + ' ' + userData.Apellidos;
        const rolUsuario = userData.Rol.nombre;
        const permisosUsuario = userData.Rol.permisos;
        const permisoDashboard = permisosUsuario.dashboard;
        const permisoRoles = permisosUsuario.roles;
        const permisoUsuarios = permisosUsuario.usuarios;
        const permisoProductos = permisosUsuario.productos;
        const permisoCategorias = permisosUsuario.categorias;
        const permisoMarcas = permisosUsuario.marcas;
        const permisoVentas = permisosUsuario.ventas;


        // console.log('Permisos',permisoDashboard);
        
        // Mostrar los datos del usuario en los elementos HTML correspondientes
        document.getElementById('nombreUsuario').textContent = nombreUsuario;
        document.getElementById('rolUsuario').textContent = rolUsuario;
        document.getElementById('permisoDashboard').textContent = permisoDashboard;
        document.getElementById('permisoRoles').textContent = permisoRoles;
        document.getElementById('permisoUsuarios').textContent = permisoUsuarios;
        document.getElementById('permisoProductos').textContent = permisoProductos;
        document.getElementById('permisoCategorias').textContent = permisoCategorias;
        document.getElementById('permisoMarcas').textContent = permisoMarcas;
        document.getElementById('permisoVentas').textContent = permisoVentas;