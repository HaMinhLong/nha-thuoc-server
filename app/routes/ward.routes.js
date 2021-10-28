const controller = require("../controllers/ward.controller");

module.exports = function (app) {
  app.get("/ward", controller.getList);
  app.get("/ward/:id", controller.getOne);
  app.post("/ward", controller.create);
  app.put("/ward/:id", controller.updateRecord);
  app.put("/ward/updateStatus/:id", controller.updateStatus);
  app.delete("/ward/:id", controller.deleteRecord);
};
