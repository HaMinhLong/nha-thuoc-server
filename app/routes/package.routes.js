const controller = require("../controllers/package.controller");

module.exports = function (app) {
  app.get("/package", controller.getList);
  app.get("/package/:id", controller.getOne);
  app.post("/package", controller.create);
  app.put("/package/:id", controller.updateRecord);
  app.put("/package/updateStatus/:id", controller.updateStatus);
  app.delete("/package/:id", controller.deleteRecord);
};
