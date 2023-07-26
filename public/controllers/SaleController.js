const Sale = require('../models/SaleModel');

const getSale = async (req, res) => {

    try {
        const allSales = await Sale.find().sort({ createdAt: -1 });
        res.json(allSales);
    }
    catch (error) {

        console.error(error);
        res.status(500).json({
            ok: 0,
            message: 'Error al mostrar las ventas',
        });
    }
}

const postSale = async (req, res) => {
    
    const { Productos, Cliente, Estado, Envio} = req.body;

    const highestInvoice = await Sale.findOne().sort({ Factura: -1 }).limit(1);
    let nextInvoiceNumber = 1;

    if (highestInvoice) {
        nextInvoiceNumber = parseInt(highestInvoice.Factura) + 1;
    }

    const Factura = nextInvoiceNumber.toString();

    const Fecha = new Date();

    let Total = 0;
    let Subtotal = 0;
    for (let i = 0; i < Productos.length; i++) {
        Subtotal += Productos[i].Precio * Productos[i].Cantidad;
    }

    const Iva = 0.091;
    const MontoIva = Subtotal * Iva;
    Total = Subtotal  + MontoIva + Envio ;

    const sale = new Sale( { Factura, Productos, Fecha, Cliente, Estado, Iva, Envio, Total });

    await sale.save();

    res.send({
        "ok" : 200,
        sale
    })

}

const desactivateSale = async (req, res) => {

    try {
        const id_sale = req.params.id;
        const Estado = false;

        const saleUpdate = await Sale.findByIdAndUpdate(id_sale, { Estado });

        if (saleUpdate) {
            res.json({
                ok: true,
                msg: "Venta desactivada"
            });
        } else {
            res.status(404).json({
                ok: false,
                msg: "Venta no encontrada"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al desactivar la venta"
        });
    }
    
}

const activateSale = async (req, res) => {

    const id_sale = req.params.id;
    const Estado = true;

    const saleUpdate = await Sale.findByIdAndUpdate(id_sale, { Estado });

    res.json({
        "ok" : 200,
        "msg" : "Venta activada"
    })

}

const searchSale = async (req, res) => {
    try {

        const { id } = req.params;
        
        const data = await Sale.find({ _id : id });
        
        if (!data) {
            return res.status(404).json({ 
                ok: false, 
                message: 'Venta no encontrada' 
            });
        }
    
        res.json({ 
            ok: true, 
            data: data 
        });

        } catch (error) {

        console.error(error);

        res.status(500).json({
            ok: 0,
            message: 'Error al buscar la venta',
        });
    }
}

const getDocument = async (req, res) => {
    const { document } = req.params;

    const sales = await Sale.find({ 'Cliente.5': document });

    if (!sales || sales.length === 0) {
      return res.status(404).json({ 
        ok: false, 
        message: 'Venta no encontrada' 
      });
    }

    res.json({ 
        ok: true, 
        data: sales 
    });

}

module.exports = {
    getSale,
    postSale,
    desactivateSale,
    activateSale,
    searchSale,
    getDocument
}