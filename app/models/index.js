const config = require("../config/db.config.js");
const initialDataServer = require("../helpers/initialData.js");

const Sequelize = require("sequelize-hierarchy")();
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: false,

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.config = require("../models/config.model.js")(sequelize, Sequelize);
db.userGroup = require("../models/userGroup.model.js")(sequelize, Sequelize);
db.menu = require("../models/menu.model.js")(sequelize, Sequelize);
db.province = require("../models/province.model.js")(sequelize, Sequelize);
db.district = require("../models/district.model.js")(sequelize, Sequelize);
db.ward = require("../models/ward.model.js")(sequelize, Sequelize);
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.specialist = require("../models/specialist.model.js")(sequelize, Sequelize);
db.place = require("../models/place.model.js")(sequelize, Sequelize);
db.healthFacility = require("../models/healthFacility.model.js")(
  sequelize,
  Sequelize
);
db.medicalFacility = require("../models/medicalFacility.model.js")(
  sequelize,
  Sequelize
);
db.userGroupRole = require("../models/userGroupRole.model.js")(
  sequelize,
  Sequelize
);
db.paymentMethod = require("../models/paymentMethod.model.js")(
  sequelize,
  Sequelize
);
db.medicalFacilityGroup = require("../models/medicalFacilityGroup.model.js")(
  sequelize,
  Sequelize
);
db.healthFacilitySpecialist =
  require("../models/healthFacilitySpecialist.model.js")(sequelize, Sequelize);
db.healthFacilityUser = require("../models/healthFacilityUser.model")(
  sequelize,
  Sequelize
);
db.supplierGroup = require("../models/supplierGroup.model")(
  sequelize,
  Sequelize
);
db.supplier = require("../models/supplier.model")(sequelize, Sequelize);
db.producerGroup = require("../models/producerGroup.model")(
  sequelize,
  Sequelize
);
db.producer = require("../models/producer.model")(sequelize, Sequelize);
db.customerGroup = require("../models/customerGroup.model")(
  sequelize,
  Sequelize
);
db.customer = require("../models/customer.model")(sequelize, Sequelize);

db.medicine = require("../models/medicine.model")(sequelize, Sequelize);
db.medicineUnit = require("../models/medicineUnit.model")(sequelize, Sequelize);
db.medicineType = require("../models/medicineType.model")(sequelize, Sequelize);
db.apothecary = require("../models/apothecary.model")(sequelize, Sequelize);
db.package = require("../models/package.model")(sequelize, Sequelize);
db.unit = require("../models/unit.model")(sequelize, Sequelize);
db.warehouse = require("../models/warehouse.model")(sequelize, Sequelize);
db.warehouseUser = require("./warehouseUser.model")(sequelize, Sequelize);
db.printForm = require("../models/printForm.model")(sequelize, Sequelize);
db.paperSizeType = require("../models/paperSizeType.model")(
  sequelize,
  Sequelize
);
db.workSchedule = require("../models/workSchedule.model")(sequelize, Sequelize);
db.clinicType = require("../models/clinicType.model")(sequelize, Sequelize);
db.clinicServicePackage = require("../models/clinicServicePackage.model")(
  sequelize,
  Sequelize
);
db.clinicService = require("../models/clinicService.model")(
  sequelize,
  Sequelize
);
db.receipt = require("../models/receipt.model")(sequelize, Sequelize);
db.receiptCode = require("../models/receiptCode.model")(sequelize, Sequelize);
db.receiptMedicine = require("./receiptMedicine.model")(sequelize, Sequelize);
db.warehouseMedicine = require("./warehouseMedicine.model")(
  sequelize,
  Sequelize
);
db.medicineIssueMedicine = require("./medicineIssueMedicine.model")(
  sequelize,
  Sequelize
);
db.medicineIssue = require("./medicineIssue.model")(sequelize, Sequelize);
db.consumable = require("./consumable.model")(sequelize, Sequelize);
db.consumableMedicine = require("./consumableMedicine.model")(
  sequelize,
  Sequelize
);
db.medicineTransfer = require("./medicineTransfer.model")(sequelize, Sequelize);
db.medicineTransferMedicine = require("./medicineTransferMedicine.model")(
  sequelize,
  Sequelize
);
db.clinicTime = require("./clinicTime.model")(sequelize, Sequelize);
db.medicalRegister = require("./medicalRegister.model")(sequelize, Sequelize);
db.clinicReceipt = require("./clinicReceipt.model")(sequelize, Sequelize);
db.clinicReceiptService = require("./clinicReceiptService.model")(
  sequelize,
  Sequelize
);
db.clinicResult = require("./clinicResult.model")(sequelize, Sequelize);
db.clinicPrescription = require("./clinicPrescription.model")(
  sequelize,
  Sequelize
);
db.clinicPreMedicine = require("./clinicPreMedicine.model")(
  sequelize,
  Sequelize
);

// clinicPrescription - medicine
db.clinicPrescription.belongsToMany(db.medicine, {
  through: "clinicPreMedicines",
});
db.medicine.belongsToMany(db.clinicPrescription, {
  through: "clinicPreMedicines",
});
// unit - clinicPreMedicine
db.unit.hasMany(db.clinicPreMedicine);
db.clinicPreMedicine.belongsTo(db.unit);

// customer - clinicPrescription
db.customer.hasMany(db.clinicPrescription);
db.clinicPrescription.belongsTo(db.customer);
// user - clinicPrescription
db.user.hasMany(db.clinicPrescription);
db.clinicPrescription.belongsTo(db.user);
// medicalRegister - clinicPrescription
db.medicalRegister.hasMany(db.clinicPrescription);
db.clinicPrescription.belongsTo(db.medicalRegister);

// medicalRegister - clinicResult
db.medicalRegister.hasMany(db.clinicResult);
db.clinicResult.belongsTo(db.medicalRegister);

// clinicReceipt - clinicService
db.clinicReceipt.belongsToMany(db.clinicService, {
  through: "clinicReceiptServices",
});
db.clinicService.belongsToMany(db.clinicReceipt, {
  through: "clinicReceiptServices",
});
// user - clinicReceiptService
db.user.hasMany(db.clinicReceiptService);
db.clinicReceiptService.belongsTo(db.user);

// customer - clinicReceipt
db.customer.hasMany(db.clinicReceipt);
db.clinicReceipt.belongsTo(db.customer);
// paymentMethod - clinicReceipt
db.paymentMethod.hasMany(db.clinicReceipt);
db.clinicReceipt.belongsTo(db.paymentMethod);
// healthFacility - clinicReceipt
db.healthFacility.hasMany(db.clinicReceipt);
db.clinicReceipt.belongsTo(db.healthFacility);
// medicalRegister - clinicReceipt
db.medicalRegister.hasMany(db.clinicReceipt);
db.clinicReceipt.belongsTo(db.medicalRegister);

// clinicTime - medicalRegister
db.clinicTime.hasMany(db.medicalRegister);
db.medicalRegister.belongsTo(db.clinicTime);
// clinicService - medicalRegister
db.clinicService.hasMany(db.medicalRegister);
db.medicalRegister.belongsTo(db.clinicService);
// customer - medicalRegister
db.customer.hasMany(db.medicalRegister);
db.medicalRegister.belongsTo(db.customer);
// user - medicalRegister
db.user.hasMany(db.medicalRegister);
db.medicalRegister.belongsTo(db.user);
// healthFacility - medicalRegister
db.healthFacility.hasMany(db.medicalRegister);
db.medicalRegister.belongsTo(db.healthFacility);

// clinicService - clinicTime
db.clinicService.hasMany(db.clinicTime);
db.clinicTime.belongsTo(db.clinicService);

// healthFacility - medicineTransfer
db.healthFacility.hasMany(db.medicineTransfer);
db.medicineTransfer.belongsTo(db.healthFacility);
// user - medicineTransfer
db.user.hasMany(db.medicineTransfer);
db.medicineTransfer.belongsTo(db.user);
// warehouse - medicineTransfer
db.warehouse.hasMany(db.medicineTransfer);
db.medicineTransfer.belongsTo(db.warehouse);
// medicineTransfer - medicine
db.medicineTransfer.belongsToMany(db.medicine, {
  through: "medicineTransferMedicines",
});
db.medicine.belongsToMany(db.medicineTransfer, {
  through: "medicineTransferMedicines",
});
// unit - medicineTransferMedicine
db.unit.hasMany(db.medicineTransferMedicine);
db.medicineTransferMedicine.belongsTo(db.unit);

// consumable - medicine
db.consumable.belongsToMany(db.medicine, {
  through: "consumableMedicines",
});
db.medicine.belongsToMany(db.consumable, {
  through: "consumableMedicines",
});
// warehouse - consumable
db.warehouse.hasMany(db.consumable);
db.consumable.belongsTo(db.warehouse);
// user - consumable
db.user.hasMany(db.consumable);
db.consumable.belongsTo(db.user);
// unit - consumableMedicine
db.unit.hasMany(db.consumableMedicine);
db.consumableMedicine.belongsTo(db.unit);

// medicineIssue - medicine
db.medicineIssue.belongsToMany(db.medicine, {
  through: "medicineIssueMedicines",
});
db.medicine.belongsToMany(db.medicineIssue, {
  through: "medicineIssueMedicines",
});
// unit - medicineIssueMedicine
db.unit.hasMany(db.medicineIssueMedicine);
db.medicineIssueMedicine.belongsTo(db.unit);

// warehouse - medicineIssue
db.warehouse.hasMany(db.medicineIssue);
db.medicineIssue.belongsTo(db.warehouse);
// paymentMethod - medicineIssue
db.paymentMethod.hasMany(db.medicineIssue);
db.medicineIssue.belongsTo(db.paymentMethod);
// user - medicineIssue
db.user.hasMany(db.medicineIssue);
db.medicineIssue.belongsTo(db.user);
// customer - medicineIssue
db.customer.hasMany(db.medicineIssue);
db.medicineIssue.belongsTo(db.customer);
// healthFacility - medicineIssue
db.healthFacility.hasMany(db.medicineIssue);
db.medicineIssue.belongsTo(db.healthFacility);

// warehouse - warehouseMedicine
db.warehouse.hasMany(db.warehouseMedicine);
db.warehouseMedicine.belongsTo(db.warehouse);
// medicine - warehouseMedicine
db.medicine.hasMany(db.warehouseMedicine);
db.warehouseMedicine.belongsTo(db.medicine);
// receiptMedicine - warehouseMedicine
db.receiptMedicine.hasMany(db.warehouseMedicine);
db.warehouseMedicine.belongsTo(db.receiptMedicine);

// unit - warehouseMedicine
db.unit.hasMany(db.warehouseMedicine);
db.warehouseMedicine.belongsTo(db.unit);

// receipt - medicine
db.receipt.belongsToMany(db.medicine, {
  through: "receiptMedicines",
});
db.medicine.belongsToMany(db.receipt, {
  through: "receiptMedicines",
});
// unit - receiptMedicine
db.unit.hasMany(db.receiptMedicine);
db.receiptMedicine.belongsTo(db.unit);

// healthFacility - receiptCode
db.healthFacility.hasMany(db.receiptCode);
db.receiptCode.belongsTo(db.healthFacility);

// user - receipt
db.user.hasMany(db.receipt);
db.receipt.belongsTo(db.user);

// paymentMethod - receipt
db.paymentMethod.hasMany(db.receipt);
db.receipt.belongsTo(db.paymentMethod);

// warehouse - receipt
db.warehouse.hasMany(db.receipt);
db.receipt.belongsTo(db.warehouse);

// supplier - receipt
db.supplier.hasMany(db.receipt);
db.receipt.belongsTo(db.supplier);

// healthFacility - receipt
db.healthFacility.hasMany(db.receipt);
db.receipt.belongsTo(db.healthFacility);

// clinicType - clinicServicePackage
db.clinicType.hasMany(db.clinicServicePackage);
db.clinicServicePackage.belongsTo(db.clinicType);

// printForm - clinicServicePackage
db.printForm.hasMany(db.clinicServicePackage);
db.clinicServicePackage.belongsTo(db.printForm);

// healthFacility - clinicServicePackage
db.healthFacility.hasMany(db.clinicServicePackage);
db.clinicServicePackage.belongsTo(db.healthFacility);

// clinicServicePackage - clinicService
db.clinicServicePackage.hasMany(db.clinicService);
db.clinicService.belongsTo(db.clinicServicePackage);

// healthFacility - clinicService
db.healthFacility.hasMany(db.clinicService);
db.clinicService.belongsTo(db.healthFacility);

// user - clinicService
db.user.hasMany(db.clinicService);
db.clinicService.belongsTo(db.user);

// paperSizeType - printForm
db.paperSizeType.hasMany(db.printForm);
db.printForm.belongsTo(db.paperSizeType);

// userGroup - user
db.userGroup.hasMany(db.user);
db.user.belongsTo(db.userGroup);

// healthFacility - user
db.healthFacility.belongsToMany(db.user, {
  through: "healthFacilityUsers",
});
db.user.belongsToMany(db.healthFacility, {
  through: "healthFacilityUsers",
});
// medicalFacilityGroup - healthFacility
db.medicalFacilityGroup.hasMany(db.healthFacility);
db.healthFacility.belongsTo(db.medicalFacilityGroup);
// healthFacility - specialist
db.healthFacility.belongsToMany(db.specialist, {
  through: "healthFacilitySpecialists",
});
db.specialist.belongsToMany(db.healthFacility, {
  through: "healthFacilitySpecialists",
});

// district - province
db.province.hasMany(db.district);
db.district.belongsTo(db.province);
// ward - district
db.district.hasMany(db.ward);
db.ward.belongsTo(db.district);
// ward - province
db.province.hasMany(db.ward);
db.ward.belongsTo(db.province);

// province - user
db.province.hasMany(db.user);
db.user.belongsTo(db.province);
// district - user
db.district.hasMany(db.user);
db.user.belongsTo(db.district);
// ward - user
db.ward.hasMany(db.user);
db.user.belongsTo(db.ward);

// province - healthFacility
db.province.hasMany(db.healthFacility);
db.healthFacility.belongsTo(db.province);
// district - healthFacility
db.district.hasMany(db.healthFacility);
db.healthFacility.belongsTo(db.district);
// ward - healthFacility
db.ward.hasMany(db.healthFacility);
db.healthFacility.belongsTo(db.ward);

// province - medicalFacility
db.province.hasMany(db.medicalFacility);
db.medicalFacility.belongsTo(db.province);
// district - medicalFacility
db.district.hasMany(db.medicalFacility);
db.medicalFacility.belongsTo(db.district);
// ward - medicalFacility
db.ward.hasMany(db.medicalFacility);
db.medicalFacility.belongsTo(db.ward);

// healthFacility - workSchedule
db.healthFacility.hasMany(db.workSchedule);
db.workSchedule.belongsTo(db.healthFacility);

// province - place
db.province.hasMany(db.place);
db.place.belongsTo(db.province);
// district - place
db.district.hasMany(db.place);
db.place.belongsTo(db.district);
// ward - place
db.ward.hasMany(db.place);
db.place.belongsTo(db.ward);

// userGroup - menu
db.userGroup.belongsToMany(db.menu, { through: "userGroupRoles" });
db.menu.belongsToMany(db.userGroup, { through: "userGroupRoles" });

// supplierGroup - healthFacility
db.healthFacility.hasMany(db.supplierGroup);
db.supplierGroup.belongsTo(db.healthFacility);

// supplierGroup - supplier
db.supplierGroup.hasMany(db.supplier);
db.supplier.belongsTo(db.supplierGroup);

// producerGroup - healthFacility
db.healthFacility.hasMany(db.producerGroup);
db.producerGroup.belongsTo(db.healthFacility);

// producerGroup - producer
db.producerGroup.hasMany(db.producer);
db.producer.belongsTo(db.producerGroup);

// customerGroup - healthFacility
db.healthFacility.hasMany(db.customerGroup);
db.customerGroup.belongsTo(db.healthFacility);

// customerGroup - customer
db.customerGroup.hasMany(db.customer);
db.customer.belongsTo(db.customerGroup);

// apothecary - medicine
db.apothecary.hasMany(db.medicine);
db.medicine.belongsTo(db.apothecary);

// package - medicine
db.package.hasMany(db.medicine);
db.medicine.belongsTo(db.package);

// medicineType - medicine
db.medicineType.hasMany(db.medicine);
db.medicine.belongsTo(db.medicineType);

// producer - medicine
db.producer.hasMany(db.medicine);
db.medicine.belongsTo(db.producer);

// healthFacility - medicine
db.healthFacility.hasMany(db.medicine);
db.medicine.belongsTo(db.healthFacility);

// medicine - unit
db.medicine.belongsToMany(db.unit, { through: "medicineUnits" });
db.unit.belongsToMany(db.medicine, { through: "medicineUnits" });

// user - warehouse
db.user.belongsToMany(db.warehouse, {
  through: "warehouseUsers",
});
db.warehouse.belongsToMany(db.user, {
  through: "warehouseUsers",
});
// province - warehouse
db.province.hasMany(db.warehouse);
db.warehouse.belongsTo(db.province);
// district - warehouse
db.district.hasMany(db.warehouse);
db.warehouse.belongsTo(db.district);
// ward - warehouse
db.ward.hasMany(db.warehouse);
db.warehouse.belongsTo(db.ward);

initialDataServer.initialData(db);

module.exports = db;
