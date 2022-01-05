module.exports = (sequelize, DataTypes) => {
  const MedicineTransferMedicine = sequelize.define(
    "medicineTransferMedicines",
    {
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
      price: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "price",
      },
      total: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "total",
      },
      unitId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "unitId",
      },
      medicineTransferId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "medicineTransferId",
      },
      medicineId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "medicineId",
      },
    }
  );

  return MedicineTransferMedicine;
};
