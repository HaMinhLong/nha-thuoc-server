const controller = require("../controllers/medicalFacilityGroup.controller");

module.exports = function (app) {
  app.get("/medicalFacilityGroup", controller.getList);
  app.get("/medicalFacilityGroup/:id", controller.getOne);
  app.post("/medicalFacilityGroup", controller.create);
  app.put("/medicalFacilityGroup/:id", controller.updateRecord);
  app.put("/medicalFacilityGroup/updateStatus/:id", controller.updateStatus);
  app.delete("/medicalFacilityGroup/:id", controller.deleteRecord);
};
