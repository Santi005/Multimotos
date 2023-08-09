const { Schema, model } = require('mongoose');

const productoSchema = new Schema({

    Nombre: { 
        type: String 
    },

    Cantidad: { 
        type: Number 
    },

    Precio: { 
        type: Number,
    },

});

const SaleModel = new Schema({

    Factura: {
        type: String,
        required: ["El número de factura es obligatorio."],
        unique: true
    },

    Productos: {
        type: [productoSchema],
        required: ["Es necesario comprar un producto."]
    },

    Fecha: {
        type: String,
        required: ["Ingrese una fecha válida."]
    },

    Cliente: {
        type: [String],
        required: ["Ingrese un cliente válido."]
    },

    Empleado: {
        type: String,
        default: "Por asignar"
    },

    Estado: {
        type: Boolean,
        default: true
    },

    EstadoEnvio: {
        type: String,
        enum: ["Por enviar", "En camino", "Entregado", "Devolución", "Cancelado"],
        default: "Por enviar",
    },

    Iva: {
        type: Number,
    },

    Envio: {
        type: Number,
    },

    Total: {
        type: Number,
        required: ["Ingrese un total válido."],
    }

});

module.exports = model('sale', SaleModel);