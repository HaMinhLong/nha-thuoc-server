module.exports = (sequelize, DataTypes) => {
  const HealthFacilityUser = sequelize.define("healthFacilityUsers", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    healthFacilityId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "healthFacilityId",
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: "userId",
    },
  });
  HealthFacilityUser.sync().then(async () => {});
  return HealthFacilityUser;
};
