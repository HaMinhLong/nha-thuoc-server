module.exports = (sequelize, DataTypes) => {
  const UserGroupRole = sequelize.define("userGroupRoles", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    menuName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "menuName",
    },
    menuParentId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: "menuParentId",
    },
    userGroupId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "userGroupId",
    },
    menuId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "menuId",
    },
    isView: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "isView",
    },
    isAdd: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "isAdd",
    },
    isUpdate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "isUpdate",
    },
    isDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "isDelete",
    },
    isBlock: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "isBlock",
    },
    isApprove: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "isApprove",
    },
    isReceipts: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "isReceipts",
    },
    isPrescription: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "isPrescription",
    },
    isResult: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "isResult",
    },
  });
  UserGroupRole.sync().then(async () => {});
  return UserGroupRole;
};
