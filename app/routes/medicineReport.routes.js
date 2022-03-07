const controller = require("../controllers/medicineReport.controller");

module.exports = function (app) {
  app.get("/customerReport", controller.customerReport);
  app.get("/employeeReport", controller.employeeReport);
  app.get("/supplierReport", controller.supplierReport);
  app.get("/expiredMedicineReport", controller.expiredMedicineReport);
  app.get("/expiredMedicineReportv2", controller.expiredMedicineReportV2);
};
