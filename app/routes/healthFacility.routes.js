const controller = require("../controllers/healthFacility.controller");

module.exports = function (app) {
  app.get("/healthFacility", controller.getList);
  app.get("/healthFacility/:id", controller.getOne);
  app.post("/healthFacility", controller.create);
  app.put("/healthFacility/:id", controller.updateRecord);
  app.put("/healthFacility/updateStatus/:id", controller.updateStatus);
  app.delete("/healthFacility/:id", controller.deleteRecord);
};
