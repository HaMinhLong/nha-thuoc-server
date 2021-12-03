module.exports = (sequelize, DataTypes) => {
  const PaperSizeType = sequelize.define("paperSizeTypes", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    paperSizeTypeName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "paperSizeTypeName",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
  });

  return PaperSizeType;
};
