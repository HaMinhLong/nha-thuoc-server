const controller = require("../controllers/medicine.controller");

module.exports = function (app) {
  app.get("/medicine", controller.getList);
  app.get("/medicine/:id", controller.getOne);
  app.post("/medicine", controller.create);
  app.put("/medicine/:id", controller.updateRecord);
  app.put("/medicine/updateStatus/:id", controller.updateStatus);
  app.delete("/medicine/:id", controller.deleteRecord);
};
