module.exports = (sequelize, DataTypes) => {
  const MedicineIssueMedicine = sequelize.define("medicineIssueMedicines", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
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
    retail: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "retail",
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "description",
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
    medicineIssueId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "medicineIssueId",
    },
    medicineId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "medicineId",
    },
  });

  return MedicineIssueMedicine;
};
