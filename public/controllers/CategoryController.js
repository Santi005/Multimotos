const Category = require("../models/CategoryModel");


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

  const paramts = req.params.id;
  const {NombreCategoria} = req.body;
  const categoryUpdate = await Category.findByIdAndUpdate(paramts,{NombreCategoria});

  res.json({
    "ok" : 200,
    "mensaje" : "Categoría actualizada correctamente.",
  })
}


const deleteCategory = async (req, res) => {
  const id_category = req.params.id;
  const deleteCategory =await Category.findByIdAndDelete(id_category);

  res.json({
    "ok" : 200,
    "mensaje" : "Categoría eliminada correctamente",
  })
}


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