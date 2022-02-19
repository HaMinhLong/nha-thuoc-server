module.exports = (sequelize, DataTypes) => {
  const MedicalRegister = sequelize.define("medicalRegisters", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    clinicServiceId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "clinicServiceId",
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "date",
    },
    customerId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "customerId",
    },
    contactChannel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "contactChannel",
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "userId",
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "description",
    },
    healthFacilityId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "healthFacilityId",
    },
    clinicTimeId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: "clinicTimeId",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
  });
  return MedicalRegister;
};
