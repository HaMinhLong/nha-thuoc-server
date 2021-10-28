const db = require("../models");
const Ward = db.ward;
const District = db.district;
const Province = db.province;
const moment = require("moment");

const Op = db.Sequelize.Op;

const getList = async (req, res) => {
  const { filter, range, sort, attributes } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const ranges = range ? JSON.parse(range) : [0, 20];
  const order = sort ? JSON.parse(sort) : ["createdAt", "DESC"];
  const attributesQuery = attributes
    ? attributes.split(",")
    : ["id", "wardName", "districtId", "status", "createdAt", "updatedAt"];
  const status = filters.status || "";
  const wardName = filters.wardName || "";
  const districtId = filters.districtId || "";
  const provinceId = filters.provinceId || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        { status: { [Op.like]: "%" + status + "%" } },
        { wardName: { [Op.like]: "%" + wardName + "%" } },
        { districtId: { [Op.like]: "%" + districtId + "%" } },
        { provinceId: { [Op.like]: "%" + provinceId + "%" } },
      ],
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
        model: District,
        required: true,
        attributes: ["id", "districtName"],
      },
      {
        model: Province,
        required: true,
        attributes: ["id", "provinceName"],
      },
    ],
  };

  Ward.findAndCountAll(options)
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
  Ward.findOne({
    where: {
      id: id,
    },
  })
    .then((ward) => {
      res.status(200).json({
        results: {
          list: ward,
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
        message: "Xảy ra lỗi khi lấy thông tin xã/phường!",
      });
    });
};

const create = async (req, res) => {
  const { id, wardName, districtId, provinceId, status } = req.body;
  const ward = await Ward.findOne({
    where: { wardName: wardName },
  });

  if (ward) {
    res.status(200).json({
      success: false,
      error: "Xã/Phường đã tồn tại!",
      message: "Xã/Phường đã tồn tại!",
    });
  } else {
    Ward.create({
      id:
        id ||
        Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
      wardName,
      districtId,
      provinceId,
      status,
    })
      .then((ward) => {
        res.status(200).json({
          results: {
            list: ward,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Tạo mới xã/phường thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi tạo mới xã/phường!",
        });
      });
  }
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const { wardName, districtId, provinceId, wardNameOld, status } = req.body;
  const ward = await Ward.findOne({
    where: { wardName: wardName },
  });
  if (ward && wardNameOld !== wardName) {
    res.status(200).json({
      success: false,
      error: "Xã/Phường đã tồn tại!",
      message: "Xã/Phường đã tồn tại!",
    });
  } else {
    Ward.update(
      {
        status: status,
        wardName: wardName,
        districtId: districtId,
        provinceId: provinceId,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((ward) => {
        res.status(200).json({
          results: {
            list: ward,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Cập nhật xã/phường thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi cập nhật xã/phường!",
        });
      });
  }
};
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  Ward.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((ward) => {
      res.status(200).json({
        results: {
          list: ward,
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
  Ward.destroy({
    where: {
      id: id,
    },
  })
    .then((ward) => {
      res.status(200).json({
        results: {
          list: ward,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa xã/phường thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa xã/phường!",
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
