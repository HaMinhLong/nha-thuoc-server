module.exports = (sequelize, DataTypes) => {
  const Producer = sequelize.define("producers", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    producerName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "producerName",
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "mobile",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "email",
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "address",
    },
    producerGroupId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "producerGroupId",
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

  return Producer;
};
