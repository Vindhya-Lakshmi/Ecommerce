const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "BAADqKPwbiRtUpZbDFbmcB-an1-EPIktBeDWAw-IbD-zRauPf758edK-hrMqmfCgjtT3aKC2UpRTP-9F0k",
  client_secret: "EAj-eRVVfT95ON4uXWJghbJ1BJuSkCypwd2D-irCcUmzHG2jS62yAe9sqHlvvT10smT4fF18tyXr8U9F"
});

module.exports = paypal;