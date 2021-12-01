module.exports = (sequelize, DataTypes) => {
  const MedicineType = sequelize.define("medicineTypes", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    medicineTypeName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "medicineTypeName",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
  });

  return MedicineType;
};
