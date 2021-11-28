const controller = require("../controllers/supplierGroup.controller");

module.exports = function (app) {
  app.get("/supplierGroup", controller.getList);
  app.get("/supplierGroup/:id", controller.getOne);
  app.post("/supplierGroup", controller.create);
  app.put("/supplierGroup/:id", controller.updateRecord);
  app.put("/supplierGroup/updateStatus/:id", controller.updateStatus);
  app.delete("/supplierGroup/:id", controller.deleteRecord);
};
