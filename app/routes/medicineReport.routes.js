const controller = require("../controllers/medicineReport.controller");

module.exports = function (app) {
  app.get("/customerReport", controller.customerReport);
};
