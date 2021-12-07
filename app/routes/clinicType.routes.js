const controller = require("../controllers/clinicType.controller");

module.exports = function (app) {
  app.get("/clinicType", controller.getList);
};
