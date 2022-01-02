module.exports = (sequelize, DataTypes) => {
  const Consumable = sequelize.define("consumables", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    consumableCode: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "consumableCode",
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

  return Consumable;
};
