module.exports = (sequelize, DataTypes) => {
  const Province = sequelize.define("provinces", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    provinceName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "provinceName",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
  });

  return Province;
};
