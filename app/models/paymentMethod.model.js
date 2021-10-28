module.exports = (sequelize, DataTypes) => {
  const PaymentMethod = sequelize.define("paymentMethods", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    paymentMethodName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "paymentMethodName",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
  });

  return PaymentMethod;
};
