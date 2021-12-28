module.exports = (sequelize, DataTypes) => {
  const MedicineIssue = sequelize.define("medicineIssues", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    medicineIssueCode: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "medicineIssueCode",
    },
    customerId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "customerId",
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
    debit: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: "debit",
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

  return MedicineIssue;
};
