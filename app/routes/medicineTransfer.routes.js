const controller = require("../controllers/medicineTransfer.controller");

module.exports = function (app) {
  app.get("/medicineTransfer", controller.getList);
  app.get("/medicineTransfer/:id", controller.getOne);
  app.post("/medicineTransfer", controller.create);
  app.put("/medicineTransfer/:id", controller.updateRecord);
  app.put("/medicineTransfer/updateStatus/:id", controller.updateStatus);
  app.delete("/medicineTransfer/:id", controller.deleteRecord);
};
