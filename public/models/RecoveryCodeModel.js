const mongoose = require('mongoose');

const recoveryCodeSchema = new mongoose.Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const RecoveryCode = mongoose.model('RecoveryCode', recoveryCodeSchema);

module.exports = RecoveryCode;
