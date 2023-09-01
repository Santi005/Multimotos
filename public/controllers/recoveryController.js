const generateToken = require('../services/tokenService');
const sendRecoveryEmail = require('../services/emailService');
const User = require('../models/UserModel');
const RecoveryToken = require('../models/recoveryTokenModel');
const RecoveryCode = require('../models/RecoveryCodeModel'); 

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



// Enviar codigo desde la app movil
const sendRecoveryCode = async (email, code) => {

  try {
    await sendRecoveryEmail(email, code);
    console.log('Código de recuperación enviado al correo:', email);
  } catch (error) {
    console.error('Error al enviar el código de recuperación al correo:', error);
  }
};

// Generar un código de recuperación de 6 dígitos
const generateRecoveryCode = () => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  return code;
};

// Lógica para solicitar recuperación de contraseña desde la app móvil
const requestPasswordRecovery = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ Correo: email });
    if (!user) {
      return res.status(404).json({ error: 'El correo electrónico no está registrado en nuestra base de datos.' });
    }

    const recoveryCode = generateRecoveryCode();
    await sendRecoveryCode(email, recoveryCode);
    const recoveryCodeData = new RecoveryCode({ email, code: recoveryCode });
    await recoveryCodeData.save();

    res.json({ success: true, message: 'Se ha enviado un código de recuperación al correo electrónico.' });
  } catch (error) {
    console.error('Error al procesar la solicitud de recuperación de contraseña:', error);
    res.status(500).json({ success: false, message: 'Ocurrió un error al procesar la solicitud. Inténtalo de nuevo más tarde.' });
  }
};

const verifyRecoveryCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    const recoveryCodeData = await RecoveryCode.findOne({ email, code });
    if (!recoveryCodeData) {
      return res.status(400).json({ error: 'El código de recuperación no es válido.' });
    }


    res.json({ success: true, message: 'Código de recuperación válido. Puedes restablecer la contraseña.' });
  } catch (error) {
    console.error('Error al verificar el código de recuperación:', error);
    res.status(500).json({ success: false, message: 'Ocurrió un error al verificar el código. Inténtalo de nuevo más tarde.' });
  }
};


const resetPasswordWithCode = async (req, res) => {
  try {
    const { code } = req.body;
    const { password } = req.body;
    console.log('Código recibido:', code);
    const recoveryCodeData = await RecoveryCode.findOne({ code });
    if (!recoveryCodeData) {
      return res.status(400).json({ error: 'El código de recuperación no es válido.' });
    }

    const user = await User.findOne({ Correo: recoveryCodeData.email });
    if (!user) {
      return res.status(404).json({ error: 'El correo electrónico asociado al código no está registrado en nuestra base de datos.' });
    }

    // Asignar la nueva contraseña al usuario
    user.Contrasena = password;
    await user.save();

    await RecoveryCode.deleteOne({ code });

    res.json({ success: true, message: 'Contraseña restablecida con éxito. Ahora puedes iniciar sesión con tu nueva contraseña.' });
  } catch (error) {
    console.error('Error al procesar el restablecimiento de contraseña:', error);
    res.status(500).json({ success: false, message: 'Ocurrió un error al procesar la solicitud. Inténtalo de nuevo más tarde.' });
  }
};





module.exports = {
  requestPasswordReset,
  resetPassword,
  sendRecoveryCode,
  requestPasswordRecovery,
  resetPasswordWithCode,
  verifyRecoveryCode
};
