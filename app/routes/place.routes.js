const controller = require("../controllers/place.controller");

module.exports = function (app) {
  app.get("/place", controller.getList);
  app.get("/place/:id", controller.getOne);
  app.post("/place", controller.create);
  app.put("/place/:id", controller.updateRecord);
  app.put("/place/updateStatus/:id", controller.updateStatus);
  app.delete("/place/:id", controller.deleteRecord);
};
