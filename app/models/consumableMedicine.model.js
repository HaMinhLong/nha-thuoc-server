module.exports = (sequelize, DataTypes) => {
  const ConsumableMedicine = sequelize.define("consumableMedicines", {
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
    consumableId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "consumableId",
    },
    medicineId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "medicineId",
    },
  });

  return ConsumableMedicine;
};
