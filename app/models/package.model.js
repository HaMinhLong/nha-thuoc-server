module.exports = (sequelize, DataTypes) => {
  const Package = sequelize.define("packages", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    packageName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "packageName",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
  });

  return Package;
};
