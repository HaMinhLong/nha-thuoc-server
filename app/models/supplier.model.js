module.exports = (sequelize, DataTypes) => {
  const Supplier = sequelize.define("suppliers", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    supplierName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "supplierName",
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "mobile",
    },
    taxCode: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "taxCode",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "email",
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "website",
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "address",
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "description",
    },
    supplierGroupId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "supplierGroupId",
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

  return Supplier;
};
