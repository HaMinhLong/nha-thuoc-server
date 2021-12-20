const controller = require("../controllers/receiptMedicine.controller");

module.exports = function (app) {
  app.get("/receiptMedicine", controller.getList);
  app.get("/receiptMedicine/:id", controller.getOne);
  app.post("/receiptMedicine", controller.create);
  app.put("/receiptMedicine/:id", controller.updateRecord);
  app.delete("/receiptMedicine/:id", controller.deleteRecord);
};
