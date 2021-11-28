const controller = require("../controllers/healthFacilityUser.controller");

module.exports = function (app) {
  app.get("/healthFacilityUser", controller.getList);
  app.get("/healthFacilityUser/:id", controller.getOne);
  app.post("/healthFacilityUser", controller.create);
  app.post("/healthFacilityUser/bulkCreate", controller.bulkCreate);
  app.put("/healthFacilityUser/:id", controller.updateRecord);
  app.delete("/healthFacilityUser/:id", controller.deleteRecord);
};
