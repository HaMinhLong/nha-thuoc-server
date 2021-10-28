const controller = require("../controllers/paymentMethod.controller");

module.exports = function (app) {
  app.get("/paymentMethod", controller.getList);
  app.get("/paymentMethod/:id", controller.getOne);
  app.post("/paymentMethod", controller.create);
  app.put("/paymentMethod/:id", controller.updateRecord);
  app.put("/paymentMethod/updateStatus/:id", controller.updateStatus);
  app.delete("/paymentMethod/:id", controller.deleteRecord);
};
