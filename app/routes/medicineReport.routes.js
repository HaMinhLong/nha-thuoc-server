const controller = require("../controllers/medicineReport.controller");

module.exports = function (app) {
  app.get("/customerReport", controller.customerReport);
  app.get("/employeeReport", controller.employeeReport);
  app.get("/supplierReport", controller.supplierReport);
};
