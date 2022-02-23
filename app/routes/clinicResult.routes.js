const controller = require("../controllers/clinicResult.controller");

module.exports = function (app) {
  app.get("/clinicResult", controller.getList);
  app.get("/clinicResult/:id", controller.getOne);
  app.post("/clinicResult", controller.create);
  app.put("/clinicResult/:id", controller.updateRecord);
  app.delete("/clinicResult/:id", controller.deleteRecord);
};
