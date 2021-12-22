const controller = require("../controllers/warehouseUser.controller");

module.exports = function (app) {
  app.get("/warehouseUser", controller.getList);
  app.post("/warehouseUser", controller.create);
  app.delete("/warehouseUser/:id", controller.deleteRecord);
};
