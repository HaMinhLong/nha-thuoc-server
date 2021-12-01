const controller = require("../controllers/medicineType.controller");

module.exports = function (app) {
  app.get("/medicineType", controller.getList);
  app.get("/medicineType/:id", controller.getOne);
  app.post("/medicineType", controller.create);
  app.put("/medicineType/:id", controller.updateRecord);
  app.put("/medicineType/updateStatus/:id", controller.updateStatus);
  app.delete("/medicineType/:id", controller.deleteRecord);
};
