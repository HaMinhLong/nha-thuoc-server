const controller = require("../controllers/consumable.controller");

module.exports = function (app) {
  app.get("/consumable", controller.getList);
  app.get("/consumable/:id", controller.getOne);
  app.post("/consumable", controller.create);
  app.put("/consumable/:id", controller.updateRecord);
  app.put("/consumable/updateStatus/:id", controller.updateStatus);
  app.delete("/consumable/:id", controller.deleteRecord);
};
