const express = require('express')
const cors = require('cors')
const { DbConection } = require('../public/db/config')
const authRoutes = require("../public/routes/auth");
const recoveryController = require('../public/controllers/recoveryController');
const morgan = require("morgan");

const bodyParser = require('body-parser');
const sendEmail = require('../public/controllers/ContactanosController.js');

class Server {

    constructor() {
        
      this.app = express();
      this.port = process.env.PORT;

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

      this.app.use(express.urlencoded({ extended: true }));

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

      // Endpoint para manejar el formulario de contacto
      this.app.post('/contact', async (req, res) => {
        const { nombre, correo, titulo, pregunta } = req.body;

        try {
          console

          const mailOptions = {
            from: 'serviciomultimotos@gmail.com',
            to: 'serviciomultimotos@gmail.com',
            subject: `Formulario de Contacto: ${titulo}`,
            text: `Nombre: ${nombre}\nCorreo: ${correo}\nPregunta: ${pregunta}`,
          };

          await sendEmail(mailOptions);

          // Envío exitoso
          res.status(200).json({ message: 'Correo enviado con éxito' });
        } catch (error) {
          console.error('Error al manejar el formulario de contacto:', error);
          res.status(500).json({ message: 'Error al enviar el correo' });
        }
      });
      
      }
    

    listen() {
      this.app.listen(this.port, () => {
        console.log("Servidor corriendo en: http://localhost:" + this.port)
      })
    }
}

module.exports = Server;