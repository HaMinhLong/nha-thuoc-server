module.exports = (sequelize, DataTypes) => {
  const ClinicPrescription = sequelize.define("clinicPrescriptions", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "description",
    },
    sick: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "sick",
    },
    customerId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "customerId",
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "userId",
    },
    medicalRegisterId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "medicalRegisterId",
    },
  });

  return ClinicPrescription;
};
