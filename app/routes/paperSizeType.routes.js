const controller = require("../controllers/paperSizeType.controller");

module.exports = function (app) {
  app.get("/paperSizeType", controller.getList);
};
