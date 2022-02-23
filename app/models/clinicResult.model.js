module.exports = (sequelize, DataTypes) => {
  const ClinicResult = sequelize.define("clinicResults", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "description",
    },
    medicalRegisterId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "medicalRegisterId",
    },
  });

  return ClinicResult;
};
