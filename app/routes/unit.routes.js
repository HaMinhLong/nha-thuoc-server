const controller = require("../controllers/unit.controller");

module.exports = function (app) {
  app.get("/unit", controller.getList);
  app.get("/unit/:id", controller.getOne);
  app.post("/unit", controller.create);
  app.put("/unit/:id", controller.updateRecord);
  app.put("/unit/updateStatus/:id", controller.updateStatus);
  app.delete("/unit/:id", controller.deleteRecord);
};
