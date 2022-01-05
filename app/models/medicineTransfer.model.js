module.exports = (sequelize, DataTypes) => {
  const MedicineTransfer = sequelize.define("medicineTransfers", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    medicineTransferCode: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "medicineTransferCode",
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
    warehouseId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "warehouseId",
    },
    warehouseTransferId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "warehouseTransferId",
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

  return MedicineTransfer;
};
