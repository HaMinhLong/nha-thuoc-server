const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8080",
};
global.__basedir = __dirname;

app.use(cors());

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require("./app/models");

db.sequelize.sync();
// force: true will drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and Resync Database with { force: true }");
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to halong application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/userGroup.routes")(app);
require("./app/routes/menu.routes")(app);
require("./app/routes/userGroupRole.routes")(app);
require("./app/routes/config.routes")(app);
require("./app/routes/province.routes")(app);
require("./app/routes/district.routes")(app);
require("./app/routes/ward.routes")(app);
require("./app/routes/paymentMethod.routes")(app);
require("./app/routes/medicalFacilityGroup.routes")(app);
require("./app/routes/specialist.routes")(app);
require("./app/routes/place.routes")(app);
require("./app/routes/medicalFacility.routes")(app);
require("./app/routes/healthFacility.routes")(app);
require("./app/routes/healthFacilitySpecialist.routes")(app);
require("./app/routes/healthFacilityUser.routes")(app);
require("./app/routes/supplierGroup.routes")(app);
require("./app/routes/supplier.routes")(app);
require("./app/routes/producerGroup.routes")(app);
require("./app/routes/producer.routes")(app);
require("./app/routes/customerGroup.routes")(app);
require("./app/routes/customer.routes")(app);
require("./app/routes/medicine.routes")(app);
require("./app/routes/medicineUnit.routes")(app);
require("./app/routes/medicineType.routes")(app);
require("./app/routes/apothecary.routes")(app);
require("./app/routes/package.routes")(app);
require("./app/routes/unit.routes")(app);
require("./app/routes/warehouse.routes")(app);
require("./app/routes/printForm.routes")(app);
require("./app/routes/paperSizeType.routes")(app);
require("./app/routes/workSchedule.routes")(app);
require("./app/routes/clinicType.routes")(app);
require("./app/routes/clinicServicePackage.routes")(app);
require("./app/routes/clinicService.routes")(app);
require("./app/routes/receipt.routes")(app);
require("./app/routes/receiptCode.routes")(app);
require("./app/routes/receiptMedicine.routes")(app);
require("./app/routes/warehouseUser.routes")(app);
require("./app/routes/medicineIssue.routes")(app);
require("./app/routes/medicineIssueMedicine.routes")(app);
require("./app/routes/warehouseMedicine.routes")(app);
require("./app/routes/consumable.routes")(app);
require("./app/routes/medicineTransfer.routes")(app);
require("./app/routes/clinicTime.routes")(app);
require("./app/routes/medicalRegister.routes")(app);
require("./app/routes/clinicReceipt.routes")(app);
require("./app/routes/clinicReceiptService.routes")(app);
require("./app/routes/clinicResult.routes")(app);
require("./app/routes/clinicPrescription.routes")(app);
require("./app/routes/clinicPreMedicine.routes")(app);
require("./app/routes/clinicReport.routes")(app);
require("./app/routes/medicineReport.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
