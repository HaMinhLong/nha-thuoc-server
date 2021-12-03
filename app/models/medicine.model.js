module.exports = (sequelize, DataTypes) => {
  const Medicine = sequelize.define("medicines", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    medicineName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "medicineName",
    },
    registrationNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "registrationNumber",
    },
    standard: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "standard",
    },
    activeIngredientName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "activeIngredientName",
    },
    concentration: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "concentration",
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "country",
    },
    medicineTypeId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "medicineTypeId",
    },
    apothecaryId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "apothecaryId",
    },
    packageId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "packageId",
    },
    producerId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "producerId",
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

  return Medicine;
};
