module.exports = (sequelize, DataTypes) => {
  const Supplier = sequelize.define("suppliers", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    supplierName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "supplierName",
    },
    supplierGroupId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "supplierGroupId",
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

  return Supplier;
};
