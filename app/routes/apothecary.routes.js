const controller = require("../controllers/apothecary.controller");

module.exports = function (app) {
  app.get("/apothecary", controller.getList);
  app.get("/apothecary/:id", controller.getOne);
  app.post("/apothecary", controller.create);
  app.put("/apothecary/:id", controller.updateRecord);
  app.put("/apothecary/updateStatus/:id", controller.updateStatus);
  app.delete("/apothecary/:id", controller.deleteRecord);
};
