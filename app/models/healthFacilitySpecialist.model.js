module.exports = (sequelize, DataTypes) => {
  const HealthFacilitySpecialist = sequelize.define(
    "healthFacilitySpecialists",
    {
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
      specialistId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: "specialistId",
      },
    }
  );
  HealthFacilitySpecialist.sync().then(async () => {});
  return HealthFacilitySpecialist;
};
