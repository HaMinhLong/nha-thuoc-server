module.exports = (sequelize, DataTypes) => {
  const MedicalFacility = sequelize.define("medicalFacilities", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    medicalFacilityName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "medicalFacilityName",
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
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
  });
  MedicalFacility.sync().then(async () => {});
  return MedicalFacility;
};
