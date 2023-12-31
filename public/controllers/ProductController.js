const multer = require("multer");
const multerConfig = require("../utils/multerConfig");
const Product = require("../models/ProductsModel");
const Category = require("../models/CategoryModel"); // Importa el modelo de categoría en lugar del controlador
const Mark = require("../models/MarkModel");
const fs = require('fs');
const path = require('path');

const upload = multer(multerConfig).array('Imagenes', 5);

const fileUpload = (req, res, next) => {
    upload(req, res, function (error) {
        if (error) {
            res.json({
                "error": 500,
                "mensaje": "Ocurrió un error al cargar el archivo"
            });
        }
        next();
    });
};



const getProduct = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    const populatedProducts = await Product.populate(products, [
      { path: 'Categoria', select: 'NombreCategoria' },
      { path: 'Marca', select: 'NombreMarca' }
    ]);

    res.json({
      ok: 200,
      products: populatedProducts
    });
  }
  catch (error) {
    res.status(500).json({
      error: 500,
      mensaje: 'Ocurrió un error al obtener los productos.'
    });
  }
};



const postProducts = async (req, res) => {
    const { NombreProducto, Descripcion, Stock, Categoria, Marca, Precio, Estado } = req.body;
    let imagenes = [];
    
    //Verifica si se adjuntaron imagenes y las guarda en "imagenes"
    if (req.files && req.files.length > 0) {
        imagenes = req.files.map((file) => file.filename);
    }
    try {
        //Busca el nombre de la categoría y  la marca que se envió
        const category = await Category.findOne({ NombreCategoria: Categoria });
        const mark = await Mark.findOne({ NombreMarca: Marca});

        if (!category) {
            return res.json({
                error: 404,
                mensaje: 'La categoría proporcionada no existe.'
            });
        }
        if(!mark){
            return res.json({
                error : 404,
                mensaje : 'La marca proporcionada no existe.'
            })
        }
      
        const categoryId = category._id;
        const markId = mark._id;

        const product = new Product({ NombreProducto, Descripcion, Stock, Categoria: categoryId, Marca : markId, Precio, Imagenes: imagenes });
        await product.save();

        if(Stock <= 0){
          await Product.findByIdAndUpdate(product._id, { Estado: "Agotado" });
        }

        res.json({
          ok: 200,
          mensaje: 'Producto registrado correctamente.',
          product
        });
    } 
    catch (error) {
      res.json({
        error: 500,
        mensaje: 'Ocurrió un error al registrar el producto.'
      });
    }
};



const putProduct = async (req, res) => {
  const { id } = req.params;
  const { NombreProducto, Descripcion, Categoria, Marca, Precio } = req.body;
  let newProduct = { NombreProducto, Descripcion, Precio };

  //Verifica si hay nuevas imagenes y las adjunta, si no, deja la anterior
  if (req.files && req.files.length > 0) {
    imagenes = req.files.map((file) => file.filename);
    newProduct.Imagenes = imagenes;
  } 
  else {
    const product = await Product.findById(id);
    newProduct.Imagenes = product.Imagenes;
  }

  try {
    // Buscar el objeto de categoría correspondiente al nombre
    const categoria = await Category.findOne({ NombreCategoria: Categoria });
    if (categoria) {
      newProduct.Categoria = categoria._id; // Asignar el ObjectId encontrado
    }

    const marca = await Mark.findOne({ NombreMarca: Marca });
    if (marca) {
      newProduct.Marca = marca._id; 
    }
    //Se envía el id y newProduct
    const productUpdate = await Product.findOneAndUpdate({ _id: id }, newProduct, { new: true });
    res.json({
      ok: 200,
      mensaje: "Producto actualizado correctamente.",
      producto: productUpdate
    });
  } 
  catch (error) {
    res.json({
      ok: 500,
      mensaje: "Ocurrió un error al actualizar el producto.",
      error: error.message
    });
  }
};



const deleteProduct = async (req, res) => {
    const id_product = req.params.id;
    try {
      // Buscar el producto por ID para obtener el nombre de las imágenes
      const deletedProduct = await Product.findByIdAndDelete(id_product);
      if (!deletedProduct) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
  
      // Verificar si el campo Imagenes está definido en el producto
      if (deletedProduct.Imagenes && deletedProduct.Imagenes.length > 0) {
        // Eliminar cada archivo de imagen de la carpeta local
        deletedProduct.Imagenes.forEach((imagen) => {
          const imagePath = path.join(__dirname, '../uploads', imagen);
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error('Error al eliminar el archivo:', err);
            }
          });
        });
      }
  
      return res.json({
        ok: 200,
        mensaje: 'Producto eliminado correctamente.',
      });
    }
    catch (error) {
      console.error('Error al eliminar el producto:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
  



const searchProduct = async (req, res) => {
  const { id } = req.params;
  const data = await Product.findOne({ _id: id })
  .populate('Categoria', 'NombreCategoria')
  .populate('Marca', 'NombreMarca');

  res.json({
    "ok": 200,
    data
  });
};



const incrementStock = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  try {
    // Verificar si el producto existe
    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Verificar si la cantidad es un número válido
    const parsedAmount = parseInt(amount);
    if (isNaN(parsedAmount)) {
        return res.status(400).json({ error: "La cantidad de incremento no es válida" });
    }

    // Incrementar el stock
    product.Stock += parsedAmount;

    // Cambiar el estado a "Disponible"
    product.Estado = "Disponible";

    await product.save();

    res.status(200).json({ ok: 200, message: "Stock incrementado exitosamente", product });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al incrementar el stock del producto" });
  }
};



const decrementarStock = async (req, res) => {

  const id_product = req.params.id;
  const cantidadVendida = req.body.cantidad;

  try {

    const product = await Product.findById(id_product);

    if(!product) {
      return res.status(404).json({
        ok: 0,
        message: "Producto no encontrado"
      })
    }

    product.Stock -= cantidadVendida;
    await product.save();
      
    res.json({
      ok: 200,
      message: "Stock decrementado",
      product,
    });

  }
  catch (error) {
    console.error(error);
    res.status(500).json({
      ok: 0,
      message: "Error al decrementar el stock",
    });
  }
}

// Función para obtener la cantidad total de productos
const getTotalProductos = async (req, res) => {
  try {
    const totalProductos = await Product.countDocuments();
    res.json({ totalProductos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = {
  getProduct,
  postProducts,
  putProduct,
  deleteProduct,
  searchProduct,
  fileUpload,
  incrementStock,
  decrementarStock,
  getTotalProductos
}