module.exports = (sequelize, DataTypes) => {
  const Apothecary = sequelize.define("apothecaries", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    apothecaryName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "apothecaryName",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
  });

  return Apothecary;
};
