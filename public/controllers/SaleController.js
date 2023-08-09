const Sale = require('../models/SaleModel');

const getSale = async (req, res) => {

    try {
        const allSales = await Sale.find().sort({ Factura: -1 });

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

async function generateNumberFactura() {

    const lastSale = await Sale.findOne().sort({ Factura: -1 }).exec();

    if (lastSale) {
        const sumNumber = parseInt(lastSale.Factura.slice(-3), 10);
        return (sumNumber + 1).toString().padStart(3, '0');
    }
    return '001';
}

const postSale = async (req, res) => {
    const { Productos, Cliente, Estado, Envio } = req.body;

    const Fecha = new Date();

    let Total = 0;
    let Subtotal = 0;
    for (let i = 0; i < Productos.length; i++) {
        Subtotal += Productos[i].Precio * Productos[i].Cantidad;
    }

    const Iva = 0.091;
    const MontoIva = Subtotal * Iva;
    Total = Subtotal + MontoIva + Envio;

    const EstadoEnvio = "Por enviar";

    const newSale = new Sale({
        Productos,
        Fecha,
        Cliente,
        Estado,
        EstadoEnvio,
        Iva,
        Envio,
        Total
    });

    const nextNumber = await generateNumberFactura();

    newSale.Factura = nextNumber;

    await newSale.save();

    res.send({
        "ok": 200,
        sale: newSale
    });
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

const updateSaleToSend = async (req, res) => {

    const id_sale = req.params.id;
    const EstadoEnvio = "En camino";
    const Empleado = req.body.Empleado;

    try {
        
        const saleUpdate = await Sale.findByIdAndUpdate(id_sale, { EstadoEnvio, Empleado });

        if (saleUpdate) {
            
            res.json({
                ok: 200,
                message: "Venta actualizada a en camino."
            })
        } else {
            res.status(404).json({
                ok: 404,
                message: "Venta no encontrada."
            })
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: 500,
            message: "Error al actualizar el estado de envío.",
        });
    }
}

updateSaleToDelivered = async (req, res) => {

    const id_sale = req.params.id;
    const EstadoEnvio = "Entregado";

    try {

        const saleUpdate = await Sale.findByIdAndUpdate(id_sale, { EstadoEnvio });

        if (saleUpdate) {

            res.json({
                ok: 200,
                msg: "Venta actualizada a entregado."
            })
        } else {

            res.status(404).json({
                ok: 404,
                msg: "Venta no encontrada."
            })
        }
    } catch (error) {
        console.error(error);

        res.status(500).json({
            ok: 500,
            msg: "Error al actualizar el estado de envío."
        })
    }
}

const updateSaleToPending = async (req, res) => {
    const id_sale = req.params.id;
    const EstadoEnvio = "Por enviar";

    try {
        const saleUpdate = await Sale.findByIdAndUpdate(id_sale, { EstadoEnvio });

        if (saleUpdate) {
            res.json({
                ok: true,
                msg: "Venta actualizada a Por enviar"
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
            msg: "Error al actualizar el estado de envío a Por enviar"
        });
    }
}

const updateSaleToReturn = async (req, res) => {
    const id_sale = req.params.id;
    const EstadoEnvio = "Devolución"

    try {

        const saleUpdate = await Sale.findByIdAndUpdate(id_sale, { EstadoEnvio });

        if (saleUpdate) {
            res.json({
                ok: true,
                msg: "Venta actualizada a Devolución"
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
            msg: "Error al actualizar el estado de envío a Devolución"
        });
    }
}

const updateSaleToCancelled = async (req, res) => {

    const id_sale = req.params.id;
    const EstadoEnvio = "Cancelado"

    try {

        const updateSale = await Sale.findByIdAndUpdate(id_sale, { EstadoEnvio });

        if (updateSale) {
            res.json({
                ok: true,
                msg: "Venta actualizada a Cancelado"
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
            msg: "Error al actualizar el estado de envío a Cancelado"
        });
    }
}

module.exports = {
    getSale,
    postSale,
    desactivateSale,
    activateSale,
    searchSale,
    getDocument,
    updateSaleToSend,
    updateSaleToDelivered,
    updateSaleToPending,
    updateSaleToReturn,
    updateSaleToCancelled
}