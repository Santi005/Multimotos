const mercadopago = require('mercadopago');

const createOrder = async (req, res) => {

    mercadopago.configure({
        access_token: "TEST-8799066318785556-072522-d7269b45297be67acbb7f1db0323bfb2-1432708673",
    });

    const result = await mercadopago.preferences.create({
        items: [
            {
                title: "Llanta",
                unit_price: 1000,
                currency_id: "COP",
                quantity: 1,
            }
        ],
        back_urls: {
            success: "http://localhost:8080/payment/success",
            failure: "http://localhost:8080/payment/failure",
            pending: "http://localhost:8080/payment/pending",
        },
        notification_url: "https://c548-190-7-115-99.ngrok.io/payment/webhook",
    });

    console.log(result);
    res.send(result.body);
}

const receiveWebhook = async (req, res) => {

    const payment = req.query;

    try {
        if (payment.type == "payment") {
            const data = await mercadopago.payment.findById(payment['data.id']);
            console.log(data);
        }
    
        res.sendStatus(204);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500).json({ error: error.message });
    }

}

module.exports = {
    createOrder,
    receiveWebhook
}