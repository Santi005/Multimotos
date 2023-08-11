const express = require('express')
const cors = require('cors')
const { DbConection } = require('../public/db/config')
const authRoutes = require("../public/routes/auth");
const recoveryController = require('../public/controllers/recoveryController');
const morgan = require("morgan");
const path = require('path')

class Server {

    constructor() {
        
      this.app = express();
      this.port = process.env.PORT;

      this.app.use(express.static(path.join(__dirname, 'public')));

      // Conexión a la base de datos
      this.DbConexionMongo();

      // Middleware
      this.middlewares()

      // Rutas
      this.route()

    }

    DbConexionMongo() {
      DbConection();
    }

    middlewares() {

      // Definición de cors
      this.app.use( cors() )

      // Definición información recibida (JSON)
      this.app.use( express.json() )

      // Definición directorio público (Directorio raíz)
      this.app.use( express.static('public') )

      this.app.use( morgan('dev') )

    }

    route() {

      this.app.use( '/categories/' , require('../public/routes/Categories.routes.js') );
      this.app.use( '/marks/' , require('../public/routes/Marks.routes.js') );
      this.app.use( '/products/' , require('../public/routes/Products.routes.js') );
      this.app.use( '/sales/', require('../public/routes/Sale.routes.js') );
      this.app.use( '/auth', authRoutes );
      this.app.use( '/users/' , require('../public/routes/Users.routes.js') );
      this.app.use( '/roles/' , require('../public/routes/Roles.routes.js') );
      this.app.use( '/payment/', require('../public/routes/Payment.routes.js') );
      
      // Ruta para recuperación de contraseña y envío de correo electrónico
      this.app.post('/forgot-password', recoveryController.requestPasswordReset);

      // Ruta para procesar el restablecimiento de contraseña
      this.app.post('/reset-password/:token', recoveryController.resetPassword);
      // Ruta para cargar la página de restablecimiento de contraseña

    }

    listen() {
      this.app.listen(this.port, () => {
        console.log("Servidor corriendo en: http://localhost:" + this.port)
      })
    }
}

module.exports = Server;