module.exports = (sequelize, DataTypes) => {
  const HealthFacility = sequelize.define("healthFacilities", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    healthFacilityName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "healthFacilityName",
    },
    healthFacilityCode: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "healthFacilityCode",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "email",
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "mobile",
    },
    taxCode: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "taxCode",
    },
    representativeName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "representativeName",
    },
    representativeMobile: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "representativeMobile",
    },
    provinceId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: "provinceId",
    },
    districtId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: "districtId",
    },
    wardId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: "wardId",
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "address",
    },
    medicalFacilityGroupId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "medicalFacilityGroupId",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
  });
  HealthFacility.sync().then(async () => {});
  return HealthFacility;
};
