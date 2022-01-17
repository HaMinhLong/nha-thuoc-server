module.exports = (sequelize, DataTypes) => {
  const ClinicServicePackage = sequelize.define("clinicServicePackages", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    clinicServicePackageName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "clinicServicePackageName",
    },
    sampleResults: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "sampleResults",
    },
    clinicTypeId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "clinicTypeId",
    },
    printFormId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "printFormId",
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

  return ClinicServicePackage;
};
