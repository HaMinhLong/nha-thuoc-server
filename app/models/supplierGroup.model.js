module.exports = (sequelize, DataTypes) => {
  const SupplierGroup = sequelize.define("supplierGroups", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    supplierGroupName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "supplierGroupName",
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

  return SupplierGroup;
};
