module.exports = (sequelize, DataTypes) => {
  const Specialist = sequelize.define("specialists", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    specialistName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "specialistName",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
  });

  return Specialist;
};
