const controller = require("../controllers/medicalFacility.controller");

module.exports = function (app) {
  app.get("/medicalFacility", controller.getList);
  app.get("/medicalFacility/:id", controller.getOne);
  app.post("/medicalFacility", controller.create);
  app.put("/medicalFacility/:id", controller.updateRecord);
  app.put("/medicalFacility/updateStatus/:id", controller.updateStatus);
  app.delete("/medicalFacility/:id", controller.deleteRecord);
};
