module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define("customers", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "customerName",
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "mobile",
    },
    dateOfBirth: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "dateOfBirth",
    },
    gender: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "gender",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "email",
    },
    provinceId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "provinceId",
    },
    districtId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "districtId",
    },
    wardId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "wardId",
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "address",
    },
    customerGroupId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "customerGroupId",
    },
    healthFacilityId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "healthFacilityId",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
  });

  return Customer;
};
