module.exports = (sequelize, DataTypes) => {
  const District = sequelize.define("districts", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    districtName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "districtName",
    },
    provinceId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "provinceId",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
  });

  return District;
};
