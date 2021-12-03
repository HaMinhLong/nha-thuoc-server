const controller = require("../controllers/printForm.controller");

module.exports = function (app) {
  app.get("/printForm", controller.getList);
  app.get("/printForm/:id", controller.getOne);
  app.post("/printForm", controller.create);
  app.put("/printForm/:id", controller.updateRecord);
  app.put("/printForm/updateStatus/:id", controller.updateStatus);
  app.delete("/printForm/:id", controller.deleteRecord);
};
