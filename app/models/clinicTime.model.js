module.exports = (sequelize, DataTypes) => {
  const ClinicTime = sequelize.define("clinicTimes", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    isClose: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "isClose",
    },
    ordinalNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "ordinalNumber",
    },
    hourFrame: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "hourFrame",
    },
    clinicServiceId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "clinicServiceId",
    },
  });
  return ClinicTime;
};
