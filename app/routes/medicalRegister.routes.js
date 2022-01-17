const controller = require("../controllers/medicalRegister.controller");

module.exports = function (app) {
  app.get("/medicalRegister", controller.getList);
  app.get("/medicalRegister/:id", controller.getOne);
  app.post("/medicalRegister", controller.create);
  app.put("/medicalRegister/:id", controller.updateRecord);
  app.put("/medicalRegister/updateStatus/:id", controller.updateStatus);
  app.delete("/medicalRegister/:id", controller.deleteRecord);
};
