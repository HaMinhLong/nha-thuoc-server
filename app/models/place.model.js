module.exports = (sequelize, DataTypes) => {
  const Places = sequelize.define("places", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    placeName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "placeName",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "email",
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "mobile",
    },
    provinceId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: "provinceId",
    },
    districtId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: "districtId",
    },
    wardId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: "wardId",
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "address",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
  });
  Places.sync().then(async () => {});
  return Places;
};
