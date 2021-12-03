const controller = require("../controllers/warehouse.controller");

module.exports = function (app) {
  app.get("/warehouse", controller.getList);
  app.get("/warehouse/:id", controller.getOne);
  app.post("/warehouse", controller.create);
  app.put("/warehouse/:id", controller.updateRecord);
  app.put("/warehouse/updateStatus/:id", controller.updateStatus);
  app.delete("/warehouse/:id", controller.deleteRecord);
};
