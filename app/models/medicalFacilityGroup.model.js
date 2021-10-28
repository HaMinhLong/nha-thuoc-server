module.exports = (sequelize, DataTypes) => {
  const MedicalFacilityGroup = sequelize.define("medicalFacilityGroups", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    medicalFacilityGroupName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "medicalFacilityGroupName",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
  });

  return MedicalFacilityGroup;
};
