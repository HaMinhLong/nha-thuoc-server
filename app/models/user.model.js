module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("users", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "username",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "password",
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "fullName",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "email",
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: true,
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
    userGroupId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "userGroupId",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
  });
  User.sync().then(async () => {});
  return User;
};
