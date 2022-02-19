module.exports = (sequelize, DataTypes) => {
  const ClinicReceipt = sequelize.define("clinicReceipts", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    clinicReceiptCode: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "clinicReceiptCode",
    },
    customerId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "customerId",
    },
    paymentMethodId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "paymentMethodId",
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "description",
    },
    debit: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: "debit",
    },
    total: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "total",
    },
    paid: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "paid",
    },
    customerBrought: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "customerBrought",
    },
    giveBack: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "giveBack",
    },
    payLater: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: "payLater",
    },
    healthFacilityId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "healthFacilityId",
    },
    medicalRegisterId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "medicalRegisterId",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
  });

  return ClinicReceipt;
};
