const controller = require("../controllers/medicineIssueMedicine.controller");

module.exports = function (app) {
  app.get("/medicineIssueMedicine", controller.getList);
  app.get("/medicineIssueMedicine/:id", controller.getOne);
  app.post("/medicineIssueMedicine", controller.create);
  app.put("/medicineIssueMedicine/:id", controller.updateRecord);
  app.delete("/medicineIssueMedicine/:id", controller.deleteRecord);
};
