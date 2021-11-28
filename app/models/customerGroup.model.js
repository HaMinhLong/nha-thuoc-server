module.exports = (sequelize, DataTypes) => {
  const CustomerGroup = sequelize.define("customerGroups", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    customerGroupName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "customerGroupName",
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

  return CustomerGroup;
};
