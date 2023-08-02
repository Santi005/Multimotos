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
        type: Number,
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

    Estado: {
        type: Boolean,
        default: true
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