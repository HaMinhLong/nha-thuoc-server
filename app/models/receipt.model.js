module.exports = (sequelize, DataTypes) => {
  const Receipt = sequelize.define("receipts", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    receiptCode: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "receiptCode",
    },
    shipperName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "shipperName",
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "userId",
    },
    paymentMethodId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "paymentMethodId",
    },
    warehouseId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "warehouseId",
    },
    supplierId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "supplierId",
    },
    debit: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "debit",
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
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
  });

  return Receipt;
};
