module.exports = (sequelize, DataTypes) => {
  const Warehouse = sequelize.define("warehouses", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    warehouseName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "warehouseName",
    },
    provinceId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "provinceId",
    },
    districtId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "districtId",
    },
    wardId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "wardId",
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "address",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
  });

  return Warehouse;
};
