const controller = require("../controllers/medicineIssue.controller");

module.exports = function (app) {
  app.get("/medicineIssue", controller.getList);
  app.get("/medicineIssue/:id", controller.getOne);
  app.post("/medicineIssue", controller.create);
  app.put("/medicineIssue/:id", controller.updateRecord);
  app.put("/medicineIssue/updateStatus/:id", controller.updateStatus);
  app.delete("/medicineIssue/:id", controller.deleteRecord);
};
