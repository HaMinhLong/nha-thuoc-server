const controller = require("../controllers/clinicPrescription.controller");

module.exports = function (app) {
  app.get("/clinicPrescription", controller.getList);
  app.get("/clinicPrescription/:id", controller.getOne);
  app.post("/clinicPrescription", controller.create);
  app.put("/clinicPrescription/:id", controller.updateRecord);
  app.delete("/clinicPrescription/:id", controller.deleteRecord);
};
