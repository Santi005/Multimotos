const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  // Configuración del transporte
});

const sendRecoveryCodeEmail = (email, code) => {
  const mailOptions = {
    from: 'serviciomultimotos@gmail.com',
    to: email,
    subject: 'Código de Recuperación de Contraseña',
    text: `Tu código de recuperación es: ${code}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo electrónico:', error);
    } else {
      console.log('Código de recuperación enviado al correo:', email);
    }
  });
};

module.exports = sendRecoveryCodeEmail;
