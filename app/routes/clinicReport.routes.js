const controller = require("../controllers/clinicReport.controller");

module.exports = function (app) {
  app.get("/doctorReport", controller.doctorReport);
};
