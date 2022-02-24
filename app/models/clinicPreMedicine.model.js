module.exports = (sequelize, DataTypes) => {
  const ClinicPreMedicine = sequelize.define("clinicPreMedicines", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "amount",
    },
    unitId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "unitId",
    },
    clinicPrescriptionId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "clinicPrescriptionId",
    },
    medicineId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "medicineId",
    },
  });

  return ClinicPreMedicine;
};
