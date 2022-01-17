const controller = require("../controllers/clinicTime.controller");

module.exports = function (app) {
  app.get("/clinicTime", controller.getList);
  app.put("/clinicTime/updateStatus/:id", controller.updateStatus);
};
