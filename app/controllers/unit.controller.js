const db = require("../models");
const Unit = db.unit;
const moment = require("moment");

const Op = db.Sequelize.Op;

const getList = async (req, res) => {
  const { filter, range, sort, attributes } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const ranges = range ? JSON.parse(range) : [0, 20];
  const order = sort ? JSON.parse(sort) : ["createdAt", "DESC"];
  const attributesQuery = attributes
    ? attributes.split(",")
    : ["id", "unitName", "status", "createdAt", "updatedAt"];
  const status = filters.status || "";
  const unitName = filters.unitName || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        { status: { [Op.like]: "%" + status + "%" } },
        { unitName: { [Op.like]: "%" + unitName + "%" } },
      ],
      createdAt: {
        [Op.between]: [fromDate, toDate],
      },
    },
    order: [order],
    attributes: attributesQuery,
    offset: ranges[0],
    limit: size,
  };

  Unit.findAndCountAll(options)
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

const getOne = async (req, res) => {
  const { id } = req.params;
  Unit.findOne({
    where: {
      id: id,
    },
  })
    .then((unit) => {
      res.status(200).json({
        results: {
          list: unit,
          pagination: [],
        },
        success: true,
        error: "",
        message: "",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: true,
        error: err.message,
        message: "Xảy ra lỗi khi lấy thông tin đơn vị tính!",
      });
    });
};

const create = async (req, res) => {
  const { id, unitName, status } = req.body;
  const unit = await Unit.findOne({
    where: { unitName: unitName },
  });

  if (unit) {
    res.status(200).json({
      success: false,
      error: "Đơn vị tính đã tồn tại!",
      message: "Đơn vị tính đã tồn tại!",
    });
  } else {
    Unit.create({
      id:
        id ||
        Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
      unitName,
      status,
    })
      .then((unit) => {
        res.status(200).json({
          results: {
            list: unit,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Tạo mới đơn vị tính thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi tạo mới đơn vị tính!",
        });
      });
  }
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const { unitName, unitNameOld, status } = req.body;
  const unit = await Unit.findOne({
    where: { unitName: unitName },
  });
  if (unit && unitNameOld !== unitName) {
    res.status(200).json({
      success: false,
      error: "Đơn vị tính đã tồn tại!",
      message: "Đơn vị tính đã tồn tại!",
    });
  } else {
    Unit.update(
      {
        status: status,
        unitName: unitName,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((unit) => {
        res.status(200).json({
          results: {
            list: unit,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Cập nhật đơn vị tính thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi cập nhật đơn vị tính!",
        });
      });
  }
};
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  Unit.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((unit) => {
      res.status(200).json({
        results: {
          list: unit,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Cập nhật trạng thái thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi cập nhật trạng thái",
      });
    });
};

const deleteRecord = async (req, res) => {
  const { id } = req.params;
  Unit.destroy({
    where: {
      id: id,
    },
  })
    .then((unit) => {
      res.status(200).json({
        results: {
          list: unit,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa đơn vị tính thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa đơn vị tính!",
      });
    });
};
module.exports = {
  getList,
  getOne,
  create,
  updateRecord,
  updateStatus,
  deleteRecord,
};
