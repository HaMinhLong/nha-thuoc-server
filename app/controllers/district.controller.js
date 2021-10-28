const db = require("../models");
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
    : ["id", "districtName", "provinceId", "status", "createdAt", "updatedAt"];
  const status = filters.status || "";
  const districtName = filters.districtName || "";
  const provinceId = filters.provinceId || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        { status: { [Op.like]: "%" + status + "%" } },
        { districtName: { [Op.like]: "%" + districtName + "%" } },
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
        model: Province,
        required: true,
        attributes: ["id", "provinceName"],
      },
    ],
  };

  District.findAndCountAll(options)
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
  District.findOne({
    where: {
      id: id,
    },
  })
    .then((district) => {
      res.status(200).json({
        results: {
          list: district,
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
        message: "Xảy ra lỗi khi lấy thông tin quận/huyện!",
      });
    });
};

const create = async (req, res) => {
  const { id, districtName, provinceId, status } = req.body;
  const district = await District.findOne({
    where: { districtName: districtName },
  });

  if (district) {
    res.status(200).json({
      success: false,
      error: "Quận/Huyện đã tồn tại!",
      message: "Quận/Huyện đã tồn tại!",
    });
  } else {
    District.create({
      id:
        id ||
        Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
      districtName,
      provinceId,
      status,
    })
      .then((district) => {
        res.status(200).json({
          results: {
            list: district,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Tạo mới quận/huyện thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi tạo mới quận/huyện!",
        });
      });
  }
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const { districtName, provinceId, districtNameOld, status } = req.body;
  const district = await District.findOne({
    where: { districtName: districtName },
  });
  if (district && districtNameOld !== districtName) {
    res.status(200).json({
      success: false,
      error: "Quận/Huyện đã tồn tại!",
      message: "Quận/Huyện đã tồn tại!",
    });
  } else {
    District.update(
      {
        status: status,
        districtName: districtName,
        provinceId: provinceId,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((district) => {
        res.status(200).json({
          results: {
            list: district,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Cập nhật quận/huyện thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi cập nhật quận/huyện!",
        });
      });
  }
};
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  District.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((district) => {
      res.status(200).json({
        results: {
          list: district,
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
  District.destroy({
    where: {
      id: id,
    },
  })
    .then((district) => {
      res.status(200).json({
        results: {
          list: district,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa quận/huyện thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa quận/huyện!",
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
