const multer = require("multer");
const multerConfig = require("../utils/multerConfig");
const Mark = require("../models/MarkModel");
const Product = require("../models/ProductsModel");
const fs = require('fs');
const path = require('path');
const upload = multer(multerConfig).array('Imagenes', 5);


const fileUpload = (req, res, next) => {
  upload(req, res, function (error) {
    if (error) {
      res.json({
        "error" : 500,
        "mensaje" : "Ocurrió un error al cargar el archivo.",  
      })
    }
    next()
  })
}



const getMark = async (req, res) => {
  try {
    const allMarks = await Mark.find().sort({ createdAt: -1 });

    res.json({
      ok: 200,
      allMarks
    });
  } catch (error) {
    res.status(500).json({
      error: 500,
      mensaje: 'Ocurrió un error al obtener las marcas.'
    });
  }
};



const postMark = async (req, res) => {
  const { NombreMarca } = req.body;
  let imagenes = [];

  if (req.files && req.files.length > 0) {
    imagenes = req.files.map((file) => file.filename);
  }

  const mark = new Mark({ NombreMarca, Imagenes: imagenes });

  try {
    await mark.save();
    res.json({
      "ok" : 200,
      "mensaje" : "Marca registrada correctamente.",
      mark
    })
  } 
  catch (error) {
    res.json({
      "error" : 500,
      "mensaje" : "Ocurrió un error al registrar la marca."
    })
  }
};



const putMark = async (req, res) => {
  const { id } = req.params;
  const { NombreMarca } = req.body;
  let newMark = { NombreMarca };

  if (req.files && req.files.length > 0) {
    imagenes = req.files.map((file) => file.filename);
    newMark.Imagenes = imagenes;
  }
  else {
    const mark = await Mark.findById(id);
    newMark.Imagenes = mark.Imagenes;
  }

  try {
    const markUpdate = await Mark.findByIdAndUpdate(id, newMark);
    res.json({
      ok: 200,
      mensaje: "Marca actualizada correctamente.",
    })
  }
  catch (error) {
    res.json({
      ok: 500,
      mensaje: "Ocurrió un error al actualizar la marca.",
    })
  }
}



const deleteMark = async (req, res) => {
  const id_mark = req.params.id;

  try {
    // Verificar si la marca está asociada a algún producto
    const productsWithMark = await Product.findOne({ Marca: id_mark });
    if (productsWithMark) {
      return res.status(409).json({ message: 'No se puede eliminar la marca porque está asociada a productos' });
    }

    // Si no hay productos asociados, proceder con la eliminación de la marca
    const deletedMark = await Mark.findByIdAndDelete(id_mark);
    
    if (!deletedMark) {
      return res.status(404).json({ error: 'Marca no encontrada' });
    }

    if (deletedMark.Imagenes && deletedMark.Imagenes.length > 0) {
      deletedMark.Imagenes.forEach((imagen) => {
        const imagePath = path.join(__dirname, '../uploads', imagen);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error('Error al eliminar el archivo:', err);
          }
        });
      });
    }

    return res.json({
      "ok": 200,
      "mensaje": "Marca eliminada correctamente.",
    });
  } catch (error) {
    console.error('Error al eliminar la marca:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};



const searchMark = async (req, res) => {
  const { id } = req.params;
  const data = await Mark.find({ _id: id });

  res.json({
    "ok" : 200,
    data
  })
}



module.exports = {
  getMark,
  postMark,
  putMark,
  deleteMark,
  searchMark,
  fileUpload
}