const mongoose = require('mongoose');

const DbConection = async () => {
    
    try {
        
        mongoose.connect(process.env.MONGODB_CNN);
        console.log("Conexión exitosa.");

    } catch (error) {
        console.log("Error de conexion: " + error)
    }
}

module.exports = {
    DbConection
}