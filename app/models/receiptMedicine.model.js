module.exports = (sequelize, DataTypes) => {
  const ReceiptMedicine = sequelize.define("receiptMedicines", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    barcode: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "barcode",
    },
    lotNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "lotNumber",
    },
    dateOfManufacture: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "dateOfManufacture",
    },
    expiry: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "expiry",
    },
    price: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "price",
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "amount",
    },
    discount: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: "discount",
    },
    discountType: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "discountType",
    },
    tax: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: "tax",
    },
    taxType: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "taxType",
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
    receiptId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "receiptId",
    },
    medicineId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "medicineId",
    },
  });

  return ReceiptMedicine;
};
