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
db.customerGroup = require("../models/customerGroup.model")(
  sequelize,
  Sequelize
);

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

// customerGroup - healthFacility
db.healthFacility.hasMany(db.customerGroup);
db.customerGroup.belongsTo(db.healthFacility);

initialDataServer.initialData(db);

module.exports = db;
