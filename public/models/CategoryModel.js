const {Schema, model} = require("mongoose");

const CategoryModel = new Schema({

  createdAt: {
    type: Date,
    default: Date.now
  },

  NombreCategoria: {
    type: String, 
    required: ["El nombre de la categoría es obligatorio."]
  }
})

module.exports = model('category', CategoryModel);



