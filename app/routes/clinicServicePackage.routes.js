const controller = require("../controllers/clinicServicePackage.controller");

module.exports = function (app) {
  app.get("/clinicServicePackage", controller.getList);
  app.get("/clinicServicePackage/:id", controller.getOne);
  app.post("/clinicServicePackage", controller.create);
  app.put("/clinicServicePackage/:id", controller.updateRecord);
  app.put("/clinicServicePackage/updateStatus/:id", controller.updateStatus);
  app.delete("/clinicServicePackage/:id", controller.deleteRecord);
};
