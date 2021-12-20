const controller = require("../controllers/receipt.controller");

module.exports = function (app) {
  app.get("/receipt", controller.getList);
  app.get("/receipt/:id", controller.getOne);
  app.post("/receipt", controller.create);
  app.put("/receipt/:id", controller.updateRecord);
  app.put("/receipt/updateStatus/:id", controller.updateStatus);
  app.delete("/receipt/:id", controller.deleteRecord);
};
