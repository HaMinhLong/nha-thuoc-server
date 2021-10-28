const controller = require("../controllers/district.controller");

module.exports = function (app) {
  app.get("/district", controller.getList);
  app.get("/district/:id", controller.getOne);
  app.post("/district", controller.create);
  app.put("/district/:id", controller.updateRecord);
  app.put("/district/updateStatus/:id", controller.updateStatus);
  app.delete("/district/:id", controller.deleteRecord);
};
