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

initialDataServer.initialData(db);

module.exports = db;
