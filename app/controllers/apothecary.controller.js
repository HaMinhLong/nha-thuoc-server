const db = require("../models");
const Apothecary = db.apothecary;
const moment = require("moment");

const Op = db.Sequelize.Op;

const getList = async (req, res) => {
  const { filter, range, sort, attributes } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const ranges = range ? JSON.parse(range) : [0, 20];
  const order = sort ? JSON.parse(sort) : ["createdAt", "DESC"];
  const attributesQuery = attributes
    ? attributes.split(",")
    : ["id", "apothecaryName", "status", "createdAt", "updatedAt"];
  const status = filters.status || "";
  const apothecaryName = filters.apothecaryName || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        { status: { [Op.like]: "%" + status + "%" } },
        { apothecaryName: { [Op.like]: "%" + apothecaryName + "%" } },
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

  Apothecary.findAndCountAll(options)
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
  Apothecary.findOne({
    where: {
      id: id,
    },
  })
    .then((apothecary) => {
      res.status(200).json({
        results: {
          list: apothecary,
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
        message: "Xảy ra lỗi khi lấy thông tin quy cách bào chế!",
      });
    });
};

const create = async (req, res) => {
  const { id, apothecaryName, status } = req.body;
  const apothecary = await Apothecary.findOne({
    where: { apothecaryName: apothecaryName },
  });

  if (apothecary) {
    res.status(200).json({
      success: false,
      error: "Quy cách bào chế đã tồn tại!",
      message: "Quy cách bào chế đã tồn tại!",
    });
  } else {
    Apothecary.create({
      id:
        id ||
        Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
      apothecaryName,
      status,
    })
      .then((apothecary) => {
        res.status(200).json({
          results: {
            list: apothecary,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Tạo mới quy cách bào chế thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi tạo mới quy cách bào chế!",
        });
      });
  }
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const { apothecaryName, apothecaryNameOld, status } = req.body;
  const apothecary = await Apothecary.findOne({
    where: { apothecaryName: apothecaryName },
  });
  if (apothecary && apothecaryNameOld !== apothecaryName) {
    res.status(200).json({
      success: false,
      error: "Quy cách bào chế đã tồn tại!",
      message: "Quy cách bào chế đã tồn tại!",
    });
  } else {
    Apothecary.update(
      {
        status: status,
        apothecaryName: apothecaryName,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((apothecary) => {
        res.status(200).json({
          results: {
            list: apothecary,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Cập nhật quy cách bào chế thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi cập nhật quy cách bào chế!",
        });
      });
  }
};
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  Apothecary.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((apothecary) => {
      res.status(200).json({
        results: {
          list: apothecary,
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
  Apothecary.destroy({
    where: {
      id: id,
    },
  })
    .then((apothecary) => {
      res.status(200).json({
        results: {
          list: apothecary,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa quy cách bào chế thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa quy cách bào chế!",
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
