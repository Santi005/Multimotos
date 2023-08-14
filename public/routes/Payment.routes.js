const { Router } = require("express");
const { createOrder, receiveWebhook, success, pending, failure } = require("../controllers/PaymentController")

const route = Router();

route.post('/create-order', createOrder);
route.get('/success', success);
route.get('/failure', pending);
route.get('/pending', failure);
route.post('/webhook', receiveWebhook);

module.exports = route;