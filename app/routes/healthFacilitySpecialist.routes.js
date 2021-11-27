const controller = require("../controllers/healthFacilitySpecialist.controller");

module.exports = function (app) {
  app.get("/healthFacilitySpecialist", controller.getList);
  app.get("/healthFacilitySpecialist/:id", controller.getOne);
  app.post("/healthFacilitySpecialist", controller.create);
  app.post("/healthFacilitySpecialist/bulkCreate", controller.bulkCreate);
  app.put("/healthFacilitySpecialist/:id", controller.updateRecord);
  app.delete("/healthFacilitySpecialist/:id", controller.deleteRecord);
};
