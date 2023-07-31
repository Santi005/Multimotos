// recoveryController.js

const generateToken = require('../services/tokenService');
const sendRecoveryEmail = require('../services/emailService');
const User = require('../models/UserModel');
const RecoveryToken = require('../models/recoveryTokenModel');

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Verificar si el correo electrónico del usuario existe en la base de datos
    const user = await User.findOne({ Correo: email });
    if (!user) {
      return res.status(404).json({ error: 'El correo electrónico no está registrado en nuestra base de datos.' });
    }

    // Generar y almacenar el token en la base de datos
    const token = await generateToken(email);
    const expirationDate = new Date(Date.now() + 1 * 60 * 60 * 1000); // Token válido por 1 hora
    const recoveryToken = new RecoveryToken({
      email,
      token,
      expirationDate,
    });
    await recoveryToken.save();

    // Enviar el correo electrónico al usuario con el token
    sendRecoveryEmail(email, token);

    res.json({ success: true, message: 'Se ha enviado un correo electrónico con el enlace de recuperación.' });
  } catch (error) {
    console.error('Error al procesar la solicitud de recuperación de contraseña:', error);
    res.status(500).json({ success: false, message: 'Ocurrió un error al procesar la solicitud. Inténtalo de nuevo más tarde.' });
  }
};

module.exports = {
  requestPasswordReset,
};
