const controller = require("../controllers/customerGroup.controller");

module.exports = function (app) {
  app.get("/customerGroup", controller.getList);
  app.get("/customerGroup/:id", controller.getOne);
  app.post("/customerGroup", controller.create);
  app.put("/customerGroup/:id", controller.updateRecord);
  app.put("/customerGroup/updateStatus/:id", controller.updateStatus);
  app.delete("/customerGroup/:id", controller.deleteRecord);
};
