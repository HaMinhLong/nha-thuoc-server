module.exports = (sequelize, DataTypes) => {
  const ClinicReceiptService = sequelize.define("clinicReceiptServices", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "amount",
    },
    price: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: "price",
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
    clinicReceiptId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "clinicReceiptId",
    },
    clinicServiceId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "clinicServiceId",
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "userId",
    },
  });

  return ClinicReceiptService;
};
