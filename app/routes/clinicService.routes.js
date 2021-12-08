const controller = require("../controllers/clinicService.controller");

module.exports = function (app) {
  app.get("/clinicService", controller.getList);
  app.get("/clinicService/:id", controller.getOne);
  app.post("/clinicService", controller.create);
  app.put("/clinicService/:id", controller.updateRecord);
  app.put("/clinicService/updateStatus/:id", controller.updateStatus);
  app.delete("/clinicService/:id", controller.deleteRecord);
};
