const controller = require("../controllers/clinicReceipt.controller");

module.exports = function (app) {
  app.get("/clinicReceipt", controller.getList);
  app.get("/clinicReceipt/:id", controller.getOne);
  app.post("/clinicReceipt", controller.create);
  app.put("/clinicReceipt/:id", controller.updateRecord);
  app.put("/clinicReceipt/updateStatus/:id", controller.updateStatus);
  app.delete("/clinicReceipt/:id", controller.deleteRecord);
};
