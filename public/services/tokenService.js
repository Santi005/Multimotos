const RecoveryToken = require('../models/recoveryTokenModel');

const generateToken = async (email) => {
  try {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expirationDate = new Date(Date.now() + 1 * 60 * 60 * 1000); // Token válido por 1 hora

    const recoveryToken = new RecoveryToken({
      email,
      token,
      expirationDate,
    });

    await recoveryToken.save(); // Utilizar await para esperar a que se complete la operación de guardado

    return token;
  } catch (error) {
    console.error('Error al generar el token:', error);
    throw new Error('Error al generar el token');
  }
};

module.exports = generateToken;
