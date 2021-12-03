module.exports = (sequelize, DataTypes) => {
  const PrintForm = sequelize.define("printForms", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    printFormName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "printFormName",
    },
    paperSizeTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "paperSizeTypeId",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
  });

  return PrintForm;
};
