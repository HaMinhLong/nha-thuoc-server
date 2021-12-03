const controller = require("../controllers/medicineUnit.controller");

module.exports = function (app) {
  app.get("/medicineUnit", controller.getList);
  app.get("/medicineUnit/:id", controller.getOne);
  app.post("/medicineUnit", controller.create);
  app.put("/medicineUnit/:id", controller.updateRecord);
  app.delete("/medicineUnit/:id", controller.deleteRecord);
};
