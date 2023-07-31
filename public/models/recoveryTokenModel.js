const mongoose = require('mongoose');

const recoveryTokenSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  expirationDate: { type: Date, required: true },
});

const RecoveryToken = mongoose.model('RecoveryToken', recoveryTokenSchema);

module.exports = RecoveryToken;
