const { Router } = require("express");
const { createOrder, receiveWebhook } = require("../controllers/PaymentController")

const route = Router();

route.post('/create-order', createOrder);

route.get('/success', (req, res) => res.send('Order completed'));

route.get('/failure', (req, res) => res.send('Order rechazed'));

route.get('/pending', (req, res) => res.send('Order pending'));

route.post('/webhook', receiveWebhook);

module.exports = route;