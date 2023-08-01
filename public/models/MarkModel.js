const { Schema, model } = require("mongoose");

const MarkModel = new Schema({

  createdAt: {
    type: Date,
    default: Date.now
  },

  NombreMarca: {
    type: String,
    required: "El nombre de la marca es obligatorio."
  },
  Imagenes: {
    type: [String],
    required: "Las imágenes son obligatorias.",
    get: (imagenes) => {
      return imagenes.map((imagen) => `/uploads/${imagen}`);
    }
  }
})


module.exports = model("mark", MarkModel);
