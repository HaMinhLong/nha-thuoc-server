const controller = require("../controllers/customer.controller");

module.exports = function (app) {
  app.get("/customer", controller.getList);
  app.get("/customer/:id", controller.getOne);
  app.post("/customer", controller.create);
  app.put("/customer/:id", controller.updateRecord);
  app.put("/customer/updateStatus/:id", controller.updateStatus);
  app.delete("/customer/:id", controller.deleteRecord);
};
