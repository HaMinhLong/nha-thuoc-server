const controller = require("../controllers/clinicReceiptService.controller");

module.exports = function (app) {
  app.get("/clinicReceiptService", controller.getList);
  app.get("/clinicReceiptService/:id", controller.getOne);
  app.post("/clinicReceiptService", controller.create);
  app.put("/clinicReceiptService/:id", controller.updateRecord);
  app.delete("/clinicReceiptService/:id", controller.deleteRecord);
};
