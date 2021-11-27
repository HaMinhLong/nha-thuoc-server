const config = require("../config/db.config.js");
var bcrypt = require("bcryptjs");

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

// userGroup - user
db.userGroup.hasMany(db.user);
db.user.belongsTo(db.userGroup);
// healthFacility - user
db.healthFacility.hasMany(db.user);
db.user.belongsTo(db.healthFacility);
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

const initialData = () => {
  db.userGroup.create({
    id: 12345678910,
    userGroupName: "Quản trị hệ thống",
    userGroupDescriptions: "",
    status: 1,
  });
  db.specialist.create({
    id: 78458965475,
    specialistName: "Răng hàm mặt",
    status: 1,
  });
  db.medicalFacilityGroup.create({
    id: 78458965475,
    medicalFacilityGroupName: "Nhà thuốc",
    status: 1,
  });
  db.paymentMethod.create({
    id: 78458965475,
    paymentMethodName: "Tiền mặt",
    status: 1,
  });
  db.province.create({
    id: 78458965475,
    provinceName: "Hưng Yên",
    status: 1,
  });
  db.district.create({
    id: 78454265475,
    districtName: "Yên Mỹ",
    provinceId: 78458965475,
    status: 1,
  });
  db.ward.create({
    id: 78447865475,
    wardName: "Hoàn Long",
    districtId: 78454265475,
    provinceId: 78458965475,
    status: 1,
  });
  db.place.create({
    id: 12345678911,
    placeName: "Nhà thuốc Trung Yên",
    email: "haminhlong3@gmail.com",
    mobile: "0963339657",
    userGroupId: 12345678910,
    provinceId: 78458965475,
    districtId: 78454265475,
    wardId: 78447865475,
    address: "Thôn Đại Hạnh",
    status: 1,
  });
  db.medicalFacility.create({
    id: 12345678911,
    medicalFacilityName: "Phòng khám Trung Yên",
    email: "haminhlong3@gmail.com",
    mobile: "0963339657",
    userGroupId: 12345678910,
    provinceId: 78458965475,
    districtId: 78454265475,
    wardId: 78447865475,
    address: "Thôn Đại Hạnh",
    status: 1,
  });
  db.healthFacility.create({
    id: 12345678911,
    healthFacilityName: "Phòng khám Đa khoa Minh Đức",
    healthFacilityCode: "DKMD",
    taxCode: "123456789",
    representativeName: "Hà Minh Long",
    representativeMobile: "0963339657",
    medicalFacilityGroupId: 78458965475,
    email: "haminhlong3@gmail.com",
    mobile: "0963339657",
    provinceId: 78458965475,
    districtId: 78454265475,
    wardId: 78447865475,
    address: "Thôn Đại Hạnh",
    status: 1,
  });
  db.healthFacilitySpecialist.create({
    id: 58458965475,
    healthFacilityId: 12345678911,
    specialistId: 78458965475,
  });
  db.user.create({
    id: 12345678911,
    username: "admin",
    fullName: "Hà Minh Long",
    password: bcrypt.hashSync("admin", 8),
    email: "haminhlong3@gmail.com",
    mobile: "0963339657",
    userGroupId: 12345678910,
    provinceId: 78458965475,
    districtId: 78454265475,
    wardId: 78447865475,
    address: "Thôn Đại Hạnh",
    healthFacilityId: 12345678911,
    status: 1,
  });
  db.menu.bulkCreate([
    {
      id: 12345678910,
      menuName: "Hệ thống",
      orderBy: 1,
      url: "/",
      icon: "fas fa-cogs",
      parentId: null,
      status: 1,
    },
    {
      id: 12345678945,
      menuName: "Cấu hình hệ thống",
      orderBy: 1,
      url: "/config",
      icon: "",
      parentId: 12345678910,
      status: 1,
    },
    {
      id: 12345678911,
      menuName: "Thanh công cụ",
      orderBy: 2,
      url: "/menu",
      icon: "",
      parentId: 12345678910,
      status: 1,
    },
    {
      id: 12345678912,
      menuName: "Tài khoản - Phân quyền",
      orderBy: 2,
      url: "/",
      icon: "fas fa-users-cog",
      parentId: null,
      status: 1,
    },
    {
      id: 12345678913,
      menuName: "Nhóm tài khoản",
      orderBy: 1,
      url: "/user-group",
      icon: "",
      parentId: 12345678912,
      status: 1,
    },
    {
      id: 12345678920,
      menuName: "Tài khoản",
      orderBy: 2,
      url: "/user",
      icon: "",
      parentId: 12345678912,
      status: 1,
    },
    {
      id: 78459841259,
      menuName: "Danh mục chung",
      orderBy: 3,
      url: "/",
      icon: "fa fa-globe-asia",
      parentId: null,
      status: 1,
    },
    {
      id: 8495245694,
      menuName: "Phương thức thanh toán",
      orderBy: 1,
      url: "/payment-method",
      icon: "",
      parentId: 78459841259,
      status: 1,
    },
    {
      id: 423657912,
      menuName: "Quản lý Tỉnh/Thành phố",
      orderBy: 2,
      url: "/province",
      icon: "",
      parentId: 78459841259,
      status: 1,
    },
    {
      id: 479625893,
      menuName: "Quản lý Quận/Huyện",
      orderBy: 3,
      url: "/district",
      icon: "",
      parentId: 78459841259,
      status: 1,
    },
    {
      id: 1485236970,
      menuName: "Quản lý Xã/Phường",
      orderBy: 4,
      url: "/ward",
      icon: "",
      parentId: 78459841259,
      status: 1,
    },
    {
      id: 4785921450,
      menuName: "Quản lý CSYT",
      orderBy: 4,
      url: "/",
      icon: "fa fa-book-medical",
      parentId: null,
      status: 1,
    },
    {
      id: 1903649530,
      menuName: "Quản lý nhóm cơ sở y tế",
      orderBy: 1,
      url: "/medical-facility-group",
      icon: "",
      parentId: 4785921450,
      status: 1,
    },
    {
      id: 7821496253,
      menuName: "Quản lý cơ sở y tế",
      orderBy: 2,
      url: "/health-facility",
      icon: "",
      parentId: 4785921450,
      status: 1,
    },
    {
      id: 9863172019,
      menuName: "Quản lý cơ sở khám bệnh",
      orderBy: 3,
      url: "/medical-facility",
      icon: "",
      parentId: 4785921450,
      status: 1,
    },
    {
      id: 8963247820,
      menuName: "Quản lý chuyên khoa",
      orderBy: 4,
      url: "/specialist",
      icon: "",
      parentId: 4785921450,
      status: 1,
    },
    {
      id: 9874523641,
      menuName: "Quản lý địa điểm",
      orderBy: 5,
      url: "/place",
      icon: "",
      parentId: 4785921450,
      status: 1,
    },
  ]);
  db.userGroupRole.bulkCreate([
    {
      id: 12345678916,
      menuName: "Hệ thống",
      menuParentId: null,
      userGroupId: 12345678910,
      menuId: 12345678910,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 12345678925,
      menuName: "Cấu hình hệ thống",
      menuParentId: 12345678910,
      userGroupId: 12345678910,
      menuId: 12345678945,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 12345678917,
      menuName: "Thanh công cụ",
      menuParentId: 12345678910,
      userGroupId: 12345678910,
      menuId: 12345678911,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 12345678918,
      menuName: "Tài khoản - Phân quyền",
      menuParentId: null,
      userGroupId: 12345678910,
      menuId: 12345678912,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 12345678919,
      menuName: "Nhóm tài khoản",
      menuParentId: 12345678912,
      userGroupId: 12345678910,
      menuId: 12345678913,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 12345678930,
      menuName: "Tài khoản",
      menuParentId: 12345678912,
      userGroupId: 12345678910,
      menuId: 12345678920,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 7895126478,
      menuName: "Danh mục chung",
      menuParentId: null,
      userGroupId: 12345678910,
      menuId: 78459841259,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 1478965239,
      menuName: "Phương thức thanh toán",
      menuParentId: 78459841259,
      userGroupId: 12345678910,
      menuId: 8495245694,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 7589632489,
      menuName: "Quản lý Tỉnh/Thành phố",
      menuParentId: 78459841259,
      userGroupId: 12345678910,
      menuId: 423657912,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 6325478963,
      menuName: "Quản lý Quận/Huyện",
      menuParentId: 78459841259,
      userGroupId: 12345678910,
      menuId: 479625893,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 2496478536,
      menuName: "Quản lý Xã/Phường",
      menuParentId: 78459841259,
      userGroupId: 12345678910,
      menuId: 1485236970,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 8745963218,
      menuName: "Quản lý CSYT",
      menuParentId: null,
      userGroupId: 12345678910,
      menuId: 4785921450,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 6547820153,
      menuName: "Quản lý nhóm cơ sở y tế",
      menuParentId: 4785921450,
      userGroupId: 12345678910,
      menuId: 1903649530,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 2015896541,
      menuName: "Quản lý cơ sở y tế",
      menuParentId: 4785921450,
      userGroupId: 12345678910,
      menuId: 7821496253,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 9841203650,
      menuName: "Quản lý cơ sở khám bệnh",
      menuParentId: 4785921450,
      userGroupId: 12345678910,
      menuId: 9863172019,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 4785125963,
      menuName: "Quản lý chuyên khoa",
      menuParentId: 4785921450,
      userGroupId: 12345678910,
      menuId: 8963247820,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 98421502685,
      menuName: "Quản lý địa điểm",
      menuParentId: 4785921450,
      userGroupId: 12345678910,
      menuId: 9874523641,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
  ]);
};

// initialData();

module.exports = db;
