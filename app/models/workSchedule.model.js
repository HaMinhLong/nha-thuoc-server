module.exports = (sequelize, DataTypes) => {
  const WorkSchedule = sequelize.define("workSchedules", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    open: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "open",
    },
    close: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "close",
    },
    weekday: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "weekday",
    },
    healthFacilityId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "healthFacilityId",
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "status",
    },
  });

  return WorkSchedule;
};
