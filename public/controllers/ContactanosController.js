const nodemailer = require('nodemailer');

async function sendEmail(options) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail', 
      auth: {
        user: 'serviciomultimotos+@gmail.com', 
        pass: 'ztqjrekeohgnvomz', 
      },
    });

    // Enviar el correo
    await transporter.sendMail(options);

    console.log('Correo enviado con éxito');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw error;
  }
}

module.exports = sendEmail;
