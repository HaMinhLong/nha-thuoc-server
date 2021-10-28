const controller = require("../controllers/specialist.controller");

module.exports = function (app) {
  app.get("/specialist", controller.getList);
  app.get("/specialist/:id", controller.getOne);
  app.post("/specialist", controller.create);
  app.put("/specialist/:id", controller.updateRecord);
  app.put("/specialist/updateStatus/:id", controller.updateStatus);
  app.delete("/specialist/:id", controller.deleteRecord);
};
