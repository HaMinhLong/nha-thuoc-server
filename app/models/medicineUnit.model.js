module.exports = (sequelize, DataTypes) => {
  const MedicineUnit = sequelize.define("medicineUnits", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    retailPrice: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "retailPrice",
    },
    wholesalePrice: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "wholesalePrice",
    },
    amount: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "amount",
    },
    medicineId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "medicineId",
    },
    unitId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "unitId",
    },
  });
  MedicineUnit.sync().then(async () => {});
  return MedicineUnit;
};
