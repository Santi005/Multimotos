const generateToken = require('../services/tokenService');
const sendRecoveryEmail = require('../services/emailService');
const User = require('../models/UserModel');
const RecoveryToken = require('../models/recoveryTokenModel');

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ Correo: email });
    if (!user) {
      return res.status(404).json({ error: 'El correo electrónico no está registrado en nuestra base de datos.' });
    }

    const token = await generateToken(email);
    const expirationDate = new Date(Date.now() + 1 * 60 * 60 * 1000); // Token válido por 1 hora
    const recoveryToken = new RecoveryToken({
      email,
      token,
      expirationDate,
    });
    await recoveryToken.save();

    sendRecoveryEmail(email, token);

    res.json({ success: true, message: 'Se ha enviado un correo electrónico con el enlace de recuperación.' });
  } catch (error) {
    console.error('Error al procesar la solicitud de recuperación de contraseña:', error);
    res.status(500).json({ success: false, message: 'Ocurrió un error al procesar la solicitud. Inténtalo de nuevo más tarde.' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    console.log('Token recibido en el servidor:', token);

    const { password } = req.body;
    console.log('Contraseña recibida en el servidor:', password);

    const recoveryToken = await RecoveryToken.findOne({ token, expirationDate: { $gt: Date.now() } });
    if (!recoveryToken) {
      return res.status(400).json({ error: 'El token no es válido o ha expirado. Solicita nuevamente la recuperación de contraseña.' });
    }

    const user = await User.findOne({ Correo: recoveryToken.email });
    if (!user) {
      return res.status(404).json({ error: 'El correo electrónico asociado al token no está registrado en nuestra base de datos.' });
    }

    // Asignamos directamente la nueva contraseña en texto plano proporcionada por el usuario
    user.Contrasena = password;
    await user.save();

    await RecoveryToken.findOneAndDelete({ token });

    res.json({ success: true, message: 'Contraseña restablecida con éxito. Ahora puedes iniciar sesión con tu nueva contraseña.' });
  } catch (error) {
    console.error('Error al procesar el restablecimiento de contraseña:', error);
    res.status(500).json({ success: false, message: 'Ocurrió un error al procesar la solicitud. Inténtalo de nuevo más tarde.' });
  }
};



module.exports = {
  requestPasswordReset,
  resetPassword,
};
