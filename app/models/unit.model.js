module.exports = (sequelize, DataTypes) => {
  const Unit = sequelize.define("units", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    unitName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "unitName",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
  });

  return Unit;
};
