const controller = require("../controllers/clinicPreMedicine.controller");

module.exports = function (app) {
  app.get("/clinicPreMedicine", controller.getList);
  app.get("/clinicPreMedicine/:id", controller.getOne);
  app.post("/clinicPreMedicine", controller.create);
  app.put("/clinicPreMedicine/:id", controller.updateRecord);
  app.delete("/clinicPreMedicine/:id", controller.deleteRecord);
};
