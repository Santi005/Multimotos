const Sale = require('../models/SaleModel');
const Product = require('../models/ProductsModel');
const mercadopago = require('mercadopago');

let venta;
let id_sale;

console.log(venta);

const createOrder = async (req, res) => {
    venta = req.body.venta;

    console.log(venta);

    let items = [
        {
            title: 'Envio',
            unit_price: venta.Envio,
            currency_id: 'COP',
            quantity: 1
        },
        {
            title: 'Iva',
            unit_price: venta.Iva,
            currency_id: 'COP',
            quantity: 1
        }
    ];

    for (let i = 0; i < venta.Productos.length; i++) {
        const name = venta.Productos[i].Nombre;
        const unit_price = parseInt(venta.Productos[i].Precio);
        const quantity = parseInt(venta.Productos[i].Cantidad);

        producto = {
            title: name,
            unit_price: unit_price,
            currency_id: 'COP',
            quantity: quantity,
        }

        items.push(producto);

    }

    mercadopago.configure({
        access_token: 'TEST-8799066318785556-072522-d7269b45297be67acbb7f1db0323bfb2-1432708673',
    });

    const result = await mercadopago.preferences.create({
        items: items,
        back_urls: {
            success: 'http://localhost:8080/payment/success',
            failure: 'http://localhost:8080/payment/failure',
            pending: 'http://localhost:8080/payment/pending',
        },
        notification_url: 'https://8abb-190-7-115-107.ngrok.io/payment/webhook',
    });

    console.log(result);

    res.send(result.body);

}

async function generateNumberFactura() {

    const lastSale = await Sale.findOne().sort({ Factura: -1 }).exec();

    if (lastSale) {
        const sumNumber = parseInt(lastSale.Factura.slice(-3), 10);
        return (sumNumber + 1).toString().padStart(3, '0');
    }
    return '001';
}

const success = async (req, res) => {

    res.redirect(`http://127.0.0.1:5500/public/views/finalizar.html?id=${id_sale}`);
}

const pending = async (req, res) => {
    res.redirect('../views/informacionPedido.html');

}

const failure = async (req, res) => {
    res.redirect('../views/informacionPedido.html');

}

const receiveWebhook = async (req, res) => {

    const payment = req.query;

    try {
        if (payment.type === 'payment') {
            const data = await mercadopago.payment.findById(payment['data.id']);
            console.log(data);

            const { Productos, Cliente, Envio } = venta;

            const Fecha = new Date();

            let Total = 0;
            let Subtotal = 0;
            for (let i = 0; i < Productos.length; i++) {
                Subtotal += Productos[i].Precio * Productos[i].Cantidad;
            }

            const Iva = 0.19;
            const MontoIva = Subtotal * Iva;
            Total = Subtotal + MontoIva + Envio;

            const EstadoEnvio = "Por enviar";

            const newSale = new Sale({
                Productos,
                Fecha,
                Cliente,
                EstadoEnvio,
                Iva,
                Envio,
                Total
            });

            const nextNumber = await generateNumberFactura();
            newSale.Factura = nextNumber;
            await newSale.save();

            id_sale = newSale._id;
            console.log('Venta registrada:', newSale, '\n ID:', id_sale);

            for (const producto of Productos) {
                const product = await Product.findOne({ _id: producto.Id });
                if (product) {
                    product.Stock -= producto.Cantidad;
                    await product.save();
                    console.log(`Stock actualizado para ${product.Nombre}: ${product.Stock}`);
                } else {
                    console.log('No se actualizó el stock :(');
                }
            }
            
        }
    
        res.sendStatus(204)
    } catch (error) {
        return res.sendStatus(500).json({ error: error.message });
    }

}

module.exports = {
    createOrder,
    receiveWebhook,
    success,
    pending,
    failure
}