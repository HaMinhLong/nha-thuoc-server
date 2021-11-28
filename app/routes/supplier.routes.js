const controller = require("../controllers/supplier.controller");

module.exports = function (app) {
  app.get("/supplier", controller.getList);
  app.get("/supplier/:id", controller.getOne);
  app.post("/supplier", controller.create);
  app.put("/supplier/:id", controller.updateRecord);
  app.put("/supplier/updateStatus/:id", controller.updateStatus);
  app.delete("/supplier/:id", controller.deleteRecord);
};
