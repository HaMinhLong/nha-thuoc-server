const db = require("../models");
const Warehouse = db.warehouse;
const Province = db.province;
const District = db.district;
const Ward = db.ward;
const moment = require("moment");

const Op = db.Sequelize.Op;

const getList = async (req, res) => {
  const { filter, range, sort, attributes } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const ranges = range ? JSON.parse(range) : [0, 20];
  const order = sort ? JSON.parse(sort) : ["createdAt", "DESC"];
  const attributesQuery = attributes
    ? attributes.split(",")
    : [
        "id",
        "warehouseName",
        "provinceId",
        "districtId",
        "wardId",
        "address",
        "status",
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status || "";
  const warehouseName = filters.warehouseName || "";
  const provinceId = filters.provinceId || "";
  const districtId = filters.districtId || "";
  const wardId = filters.wardId || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        { status: { [Op.like]: "%" + status + "%" } },
        { warehouseName: { [Op.like]: "%" + warehouseName + "%" } },
        { provinceId: { [Op.like]: "%" + provinceId + "%" } },
        { districtId: { [Op.like]: "%" + districtId + "%" } },
        { wardId: { [Op.like]: "%" + wardId + "%" } },
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
      {
        model: District,
        required: true,
        attributes: ["id", "districtName"],
      },
      {
        model: Ward,
        required: true,
        attributes: ["id", "wardName"],
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

const getOne = async (req, res) => {
  const { id } = req.params;
  Warehouse.findOne({
    where: {
      id: id,
    },
  })
    .then((warehouse) => {
      res.status(200).json({
        results: {
          list: warehouse,
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
        message: "Xảy ra lỗi khi lấy thông tin kho!",
      });
    });
};

const create = async (req, res) => {
  const { id, warehouseName, provinceId, districtId, wardId, address, status } =
    req.body;
  const warehouse = await Warehouse.findOne({
    where: {
      [Op.and]: [{ warehouseName: warehouseName }],
    },
  });

  if (warehouse) {
    res.status(200).json({
      success: false,
      error: "Kho đã tồn tại!",
      message: "Kho đã tồn tại!",
    });
  } else {
    Warehouse.create({
      id:
        id ||
        Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
      warehouseName,
      provinceId,
      districtId,
      wardId,
      address,
      status,
    })
      .then((warehouse) => {
        res.status(200).json({
          results: {
            list: warehouse,
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
  }
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const {
    warehouseName,
    warehouseNameOld,
    provinceId,
    districtId,
    wardId,
    address,
    status,
  } = req.body;
  const warehouse = await Warehouse.findOne({
    where: {
      [Op.and]: [{ warehouseName: warehouseName }],
    },
  });
  if (warehouse && warehouseNameOld !== warehouseName) {
    res.status(200).json({
      success: false,
      error: "Kho đã tồn tại!",
      message: "Kho đã tồn tại!",
    });
  } else {
    Warehouse.update(
      {
        warehouseName: warehouseName,
        provinceId: provinceId,
        districtId: districtId,
        wardId: wardId,
        address: address,
        status: status,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((warehouse) => {
        res.status(200).json({
          results: {
            list: warehouse,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Cập nhật kho thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi cập nhật kho!",
        });
      });
  }
};
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  Warehouse.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((warehouse) => {
      res.status(200).json({
        results: {
          list: warehouse,
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
  Warehouse.destroy({
    where: {
      id: id,
    },
  })
    .then((warehouse) => {
      res.status(200).json({
        results: {
          list: warehouse,
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
  getOne,
  create,
  updateRecord,
  updateStatus,
  deleteRecord,
};
