module.exports = (sequelize, DataTypes) => {
  const ReceiptCode = sequelize.define("receiptCodes", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    receiptCode: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "receiptCode",
    },
    formType: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "formType",
    },
    healthFacilityId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "healthFacilityId",
    },
  });

  return ReceiptCode;
};
