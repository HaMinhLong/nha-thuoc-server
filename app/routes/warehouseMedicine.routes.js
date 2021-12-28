const controller = require("../controllers/warehouseMedicine.controller");

module.exports = function (app) {
  app.get("/warehouseMedicine", controller.getList);
  app.get("/warehouseMedicine/getOne", controller.getOne);
};
