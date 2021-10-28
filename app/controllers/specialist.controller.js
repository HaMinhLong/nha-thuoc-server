const db = require("../models");
const Specialist = db.specialist;
const moment = require("moment");

const Op = db.Sequelize.Op;

const getList = async (req, res) => {
  const { filter, range, sort, attributes } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const ranges = range ? JSON.parse(range) : [0, 20];
  const order = sort ? JSON.parse(sort) : ["createdAt", "DESC"];
  const attributesQuery = attributes
    ? attributes.split(",")
    : ["id", "specialistName", "status", "createdAt", "updatedAt"];
  const status = filters.status || "";
  const specialistName = filters.specialistName || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        { status: { [Op.like]: "%" + status + "%" } },
        { specialistName: { [Op.like]: "%" + specialistName + "%" } },
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

  Specialist.findAndCountAll(options)
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
  Specialist.findOne({
    where: {
      id: id,
    },
  })
    .then((specialist) => {
      res.status(200).json({
        results: {
          list: specialist,
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
  const { id, specialistName, status } = req.body;
  const specialist = await Specialist.findOne({
    where: { specialistName: specialistName },
  });

  if (specialist) {
    res.status(200).json({
      success: false,
      error: "Phương thức thanh toán đã tồn tại!",
      message: "Phương thức thanh toán đã tồn tại!",
    });
  } else {
    Specialist.create({
      id:
        id ||
        Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
      specialistName,
      status,
    })
      .then((specialist) => {
        res.status(200).json({
          results: {
            list: specialist,
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
  const { specialistName, specialistOld, status } = req.body;
  const specialist = await Specialist.findOne({
    where: { specialistName: specialistName },
  });
  if (specialist && specialistOld !== specialistName) {
    res.status(200).json({
      success: false,
      error: "Phương thức thanh toán đã tồn tại!",
      message: "Phương thức thanh toán đã tồn tại!",
    });
  } else {
    Specialist.update(
      {
        status: status,
        specialistName: specialistName,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((specialist) => {
        res.status(200).json({
          results: {
            list: specialist,
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
  Specialist.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((specialist) => {
      res.status(200).json({
        results: {
          list: specialist,
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
  Specialist.destroy({
    where: {
      id: id,
    },
  })
    .then((specialist) => {
      res.status(200).json({
        results: {
          list: specialist,
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
