const Category = require("../models/CategoryModel");
const Product = require("../models/ProductsModel");


const getCategory = async (req, res) => {
  try {
    const allCategories = await Category.find().sort({ createdAt: -1 });

    res.json({
      ok: 200,
      allCategories
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      mensaje: "Error al obtener las categorías."
    });
  }
};



const postCategory = async (req, res) => {
  const {NombreCategoria} = req.body;
  const category = new Category ({NombreCategoria});

  await category.save();

  res.json({
    "ok" : 200,
    "mensaje" : "Categoría registrada correctamente.",
    category
  })
}



const putCategory = async (req, res) => {
  const categoryId = req.params.id;
  const { NombreCategoria } = req.body;

  try {
    // Verifica si el nuevo nombre de categoría ya está en uso por otra categoría
    const existingCategory = await Category.findOne({ NombreCategoria });
    if (existingCategory && existingCategory._id.toString() !== categoryId) {
      return res.status(409).json({ message: 'El nombre de categoría ya está en uso' });
    }

    // Realiza la actualización de la categoría en la base de datos
    const categoryUpdate = await Category.findByIdAndUpdate(categoryId, { NombreCategoria });

    res.json({
      "ok" : 200,
      "mensaje" : "Categoría actualizada correctamente.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la categoría' });
  }
};



const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;

  try {
    // Verificar si la categoría está asociada a algún producto
    const productsWithCategory = await Product.findOne({ Categoria: categoryId });
    if (productsWithCategory) {
      return res.status(409).json({ message: 'No se puede eliminar la categoría porque está asociada a productos' });
    }

    // Si no hay productos asociados, proceder con la eliminación de la categoría
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    res.json({
      ok: 200,
      mensaje: 'Categoría eliminada correctamente',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 500,
      mensaje: 'Ocurrió un error al eliminar la categoría',
    });
  }
};



const searchCategory = async (req, res) => {
  const {id} = req.params;
  const data = await Category.find({_id : id});

  res.json({
    "ok" : 200,
    data
  })
}



module.exports = {
  getCategory,
  postCategory,
  putCategory,
  deleteCategory,
  searchCategory 
}