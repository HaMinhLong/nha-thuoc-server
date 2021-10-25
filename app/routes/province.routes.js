const controller = require("../controllers/province.controller");

module.exports = function (app) {
  app.get("/province", controller.getList);
  app.get("/province/:id", controller.getOne);
  app.post("/province", controller.create);
  app.put("/province/:id", controller.updateRecord);
  app.put("/province/updateStatus/:id", controller.updateStatus);
  app.delete("/province/:id", controller.deleteRecord);
};
