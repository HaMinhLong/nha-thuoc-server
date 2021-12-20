const controller = require("../controllers/receiptCode.controller");

module.exports = function (app) {
  app.get("/receiptCode", controller.getOne);
  app.put("/receiptCode/:id", controller.updateRecord);
};
