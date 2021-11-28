const controller = require("../controllers/producerGroup.controller");

module.exports = function (app) {
  app.get("/producerGroup", controller.getList);
  app.get("/producerGroup/:id", controller.getOne);
  app.post("/producerGroup", controller.create);
  app.put("/producerGroup/:id", controller.updateRecord);
  app.put("/producerGroup/updateStatus/:id", controller.updateStatus);
  app.delete("/producerGroup/:id", controller.deleteRecord);
};
