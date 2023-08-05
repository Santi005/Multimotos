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
    required: "Las imagenes son obligatorias.",
  }
})

MarkModel.pre('remove', function (next) {
  const imagenes = this.Imagenes;
  if (imagenes && imagenes.length > 0) {
    imagenes.forEach((imagen) => {
      const imagePath = path.join(__dirname, '../uploads', imagen);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error al eliminar el archivo:', err);
        }
      });
    });
  }
  next();
});

module.exports = model("mark", MarkModel);
