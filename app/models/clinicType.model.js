module.exports = (sequelize, DataTypes) => {
  const ClinicType = sequelize.define("clinicTypes", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    clinicTypeName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "clinicTypeName",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
  });

  return ClinicType;
};
