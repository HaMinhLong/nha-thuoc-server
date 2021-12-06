const controller = require("../controllers/workSchedule.controller");

module.exports = function (app) {
  app.get("/workSchedule", controller.getList);
  app.put("/workSchedule/update", controller.updateRecord);
};
