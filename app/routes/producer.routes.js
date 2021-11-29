const controller = require("../controllers/producer.controller");

module.exports = function (app) {
  app.get("/producer", controller.getList);
  app.get("/producer/:id", controller.getOne);
  app.post("/producer", controller.create);
  app.put("/producer/:id", controller.updateRecord);
  app.put("/producer/updateStatus/:id", controller.updateStatus);
  app.delete("/producer/:id", controller.deleteRecord);
};
