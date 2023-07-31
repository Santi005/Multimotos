// emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'serviciomultimotos@gmail.com',
    pass: 'ztqjrekeohgnvomz',
  },
});

const sendRecoveryEmail = (email, token) => {
  const mailOptions = {
    from: 'serviciomultimotos@gmail.com',
    to: email,
    subject: 'Recuperación de contraseña',
    text: `Hola,\n\nPara restablecer tu contraseña, haz clic en el siguiente enlace:\n\nhttp://localhost:3000/reset-password/${token}\n\nEl enlace expirará en 1 hora.\n\nSi no solicitaste restablecer tu contraseña, ignora este correo.\n\nSaludos`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo electrónico:', error);
    } else {
      console.log('Correo electrónico enviado:', info.response);
    }
  });
};

module.exports = sendRecoveryEmail;
