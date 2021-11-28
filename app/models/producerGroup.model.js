module.exports = (sequelize, DataTypes) => {
  const ProducerGroup = sequelize.define("producerGroups", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    producerGroupName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "producerGroupName",
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

  return ProducerGroup;
};
