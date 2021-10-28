const db = require("../models");
const PaymentMethod = db.paymentMethod;
const moment = require("moment");

const Op = db.Sequelize.Op;

const getList = async (req, res) => {
  const { filter, range, sort, attributes } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const ranges = range ? JSON.parse(range) : [0, 20];
  const order = sort ? JSON.parse(sort) : ["createdAt", "DESC"];
  const attributesQuery = attributes
    ? attributes.split(",")
    : ["id", "paymentMethodName", "status", "createdAt", "updatedAt"];
  const status = filters.status || "";
  const paymentMethodName = filters.paymentMethodName || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        { status: { [Op.like]: "%" + status + "%" } },
        { paymentMethodName: { [Op.like]: "%" + paymentMethodName + "%" } },
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

  PaymentMethod.findAndCountAll(options)
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
  PaymentMethod.findOne({
    where: {
      id: id,
    },
  })
    .then((paymentMethod) => {
      res.status(200).json({
        results: {
          list: paymentMethod,
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
        message: "Xảy ra lỗi khi lấy thông tin phương thức thanh toán!",
      });
    });
};

const create = async (req, res) => {
  const { id, paymentMethodName, status } = req.body;
  const paymentMethod = await PaymentMethod.findOne({
    where: { paymentMethodName: paymentMethodName },
  });

  if (paymentMethod) {
    res.status(200).json({
      success: false,
      error: "Phương thức thanh toán đã tồn tại!",
      message: "Phương thức thanh toán đã tồn tại!",
    });
  } else {
    PaymentMethod.create({
      id:
        id ||
        Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
      paymentMethodName,
      status,
    })
      .then((paymentMethod) => {
        res.status(200).json({
          results: {
            list: paymentMethod,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Tạo mới phương thức thanh toán thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi tạo mới phương thức thanh toán!",
        });
      });
  }
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const { paymentMethodName, provinceNameOld, status } = req.body;
  const paymentMethod = await PaymentMethod.findOne({
    where: { paymentMethodName: paymentMethodName },
  });
  if (paymentMethod && provinceNameOld !== paymentMethodName) {
    res.status(200).json({
      success: false,
      error: "Phương thức thanh toán đã tồn tại!",
      message: "Phương thức thanh toán đã tồn tại!",
    });
  } else {
    PaymentMethod.update(
      {
        status: status,
        paymentMethodName: paymentMethodName,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((paymentMethod) => {
        res.status(200).json({
          results: {
            list: paymentMethod,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Cập nhật phương thức thanh toán thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi cập nhật phương thức thanh toán!",
        });
      });
  }
};
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  PaymentMethod.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((paymentMethod) => {
      res.status(200).json({
        results: {
          list: paymentMethod,
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
  PaymentMethod.destroy({
    where: {
      id: id,
    },
  })
    .then((paymentMethod) => {
      res.status(200).json({
        results: {
          list: paymentMethod,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa phương thức thanh toán thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa phương thức thanh toán!",
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
