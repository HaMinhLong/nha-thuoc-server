module.exports = (sequelize, DataTypes) => {
  const Ward = sequelize.define("wards", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    wardName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "wardName",
    },
    districtId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "districtId",
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

  return Ward;
};
