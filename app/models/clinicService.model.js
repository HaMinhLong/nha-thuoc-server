module.exports = (sequelize, DataTypes) => {
  const ClinicService = sequelize.define("clinicServices", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    clinicServiceName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "clinicServiceName",
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "price",
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "description",
    },
    clinicServicePackageId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "clinicServicePackageId",
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "userId",
    },
    healthFacilityId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "healthFacilityId",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
  });

  return ClinicService;
};
