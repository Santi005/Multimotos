const { Schema, model } = require("mongoose")

const ProductModel = new Schema({

    createdAt: {
        type: Date,
        default: Date.now
    },

    NombreProducto: {
        type: String,
        required: "El nombre del producto es obligatorio."
    },
    Descripcion: {
        type: String,
        required: "La descripción del producto es obligatoria."
    },
    Stock: {
        type: Number,
        required: "El stock del producto es obligatorio."
    },
    Categoria: {
        type: Schema.Types.ObjectId,
        ref: "category", // Nombre del modelo de Categorías
        required: "La categoría del producto es obligatoria."
    },
    Marca: {
        type: Schema.Types.ObjectId,
        ref: "mark", // Nombre del modelo de Categorías
        required: "La marca del producto es obligatoria."
    },
    Precio: {
        type: Number,
        required: "El precio del producto es obligatorio."
    },
    Estado: {
        type: Boolean,
        default: true
    },
    Imagenes: {
        type: [String],
        required: "Las imagenes son obligatorias.",
      }
});

ProductModel.pre('remove', function (next) {
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

module.exports = model("product", ProductModel);