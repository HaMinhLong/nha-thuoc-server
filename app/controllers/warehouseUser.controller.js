const db = require("../models");
const WarehouseUser = db.warehouseUser;
const Warehouse = db.warehouse;
const User = db.user;
const moment = require("moment");

const Op = db.Sequelize.Op;

const getList = async (req, res) => {
  const { filter, range, sort, attributes } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const ranges = range ? JSON.parse(range) : [0, 20];
  const order = sort ? JSON.parse(sort) : ["createdAt", "DESC"];
  const attributesQuery = attributes
    ? attributes.split(",")
    : ["id", "warehouseName", "status", "createdAt", "updatedAt"];
  const status = filters.status || "";
  const userId = filters.userId || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [{ status: { [Op.like]: "%" + status + "%" } }],
      createdAt: {
        [Op.between]: [fromDate, toDate],
      },
    },
    order: [order],
    attributes: attributesQuery,
    offset: ranges[0],
    limit: size,
    include: [
      {
        model: User,
        required: true,
        attributes: ["id", "username"],
        through: {
          where: {
            userId: { [Op.like]: "%" + userId + "%" },
          },
        },
      },
    ],
  };

  Warehouse.findAndCountAll(options)
    .then((result) => {
      res.status(200).json({
        results: {
          list: result.rows,
          pagination: {
            total: result.count,
            pageSize: size,
            current: current,
          },
        },
        success: true,
        error: "",
        message: "",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi lấy danh sách!",
      });
    });
};

const create = async (req, res) => {
  const { id, warehouseId, userId } = req.body;

  WarehouseUser.create({
    id:
      id ||
      Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
        100000000000,
    warehouseId,
    userId,
  })
    .then((warehouseUser) => {
      res.status(200).json({
        results: {
          list: warehouseUser,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Tạo mới kho thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi tạo mới kho!",
      });
    });
};

const deleteRecord = async (req, res) => {
  const { id } = req.params;
  WarehouseUser.destroy({
    where: {
      id: id,
    },
  })
    .then((warehouseUser) => {
      res.status(200).json({
        results: {
          list: warehouseUser,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa kho thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa kho!",
      });
    });
};
module.exports = {
  getList,
  create,
  deleteRecord,
};
