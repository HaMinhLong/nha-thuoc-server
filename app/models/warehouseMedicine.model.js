module.exports = (sequelize, DataTypes) => {
  const WarehouseMedicine = sequelize.define("warehouseMedicines", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    exchange: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "exchange",
    },
    inStock: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: "inStock",
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
    warehouseId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "warehouseId",
    },
    receiptMedicineId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "receiptMedicineId",
    },
  });

  return WarehouseMedicine;
};
