const db = require("../models");
const Package = db.package;
const moment = require("moment");

const Op = db.Sequelize.Op;

const getList = async (req, res) => {
  const { filter, range, sort, attributes } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const ranges = range ? JSON.parse(range) : [0, 20];
  const order = sort ? JSON.parse(sort) : ["createdAt", "DESC"];
  const attributesQuery = attributes
    ? attributes.split(",")
    : ["id", "packageName", "status", "createdAt", "updatedAt"];
  const status = filters.status || "";
  const packageName = filters.packageName || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        { status: { [Op.like]: "%" + status + "%" } },
        { packageName: { [Op.like]: "%" + packageName + "%" } },
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

  Package.findAndCountAll(options)
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
  Package.findOne({
    where: {
      id: id,
    },
  })
    .then((package) => {
      res.status(200).json({
        results: {
          list: package,
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
        message: "Xảy ra lỗi khi lấy thông tin quy cách đóng gói!",
      });
    });
};

const create = async (req, res) => {
  const { id, packageName, status } = req.body;
  const package = await Package.findOne({
    where: { packageName: packageName },
  });

  if (package) {
    res.status(200).json({
      success: false,
      error: "Quy cách đóng gói đã tồn tại!",
      message: "Quy cách đóng gói đã tồn tại!",
    });
  } else {
    Package.create({
      id:
        id ||
        Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
      packageName,
      status,
    })
      .then((package) => {
        res.status(200).json({
          results: {
            list: package,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Tạo mới quy cách đóng gói thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi tạo mới quy cách đóng gói!",
        });
      });
  }
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const { packageName, packageNameOld, status } = req.body;
  const package = await Package.findOne({
    where: { packageName: packageName },
  });
  if (package && packageNameOld !== packageName) {
    res.status(200).json({
      success: false,
      error: "Quy cách đóng gói đã tồn tại!",
      message: "Quy cách đóng gói đã tồn tại!",
    });
  } else {
    Package.update(
      {
        status: status,
        packageName: packageName,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((package) => {
        res.status(200).json({
          results: {
            list: package,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Cập nhật quy cách đóng gói thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi cập nhật quy cách đóng gói!",
        });
      });
  }
};
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  Package.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((package) => {
      res.status(200).json({
        results: {
          list: package,
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
  Package.destroy({
    where: {
      id: id,
    },
  })
    .then((package) => {
      res.status(200).json({
        results: {
          list: package,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa quy cách đóng gói thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa quy cách đóng gói!",
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
