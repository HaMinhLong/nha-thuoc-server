const db = require("../models");
const Supplier = db.supplier;
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
        "supplierName",
        "supplierGroupId",
        "healthFacilityId",
        "status",
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status || "";
  const supplierName = filters.supplierName || "";
  const supplierGroupId = filters.supplierGroupId || "";
  const healthFacilityId = filters.healthFacilityId || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        { status: { [Op.like]: "%" + status + "%" } },
        { supplierName: { [Op.like]: "%" + supplierName + "%" } },
        { supplierGroupId: { [Op.like]: "%" + supplierGroupId + "%" } },
        { healthFacilityId: { [Op.like]: "%" + healthFacilityId + "%" } },
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

  Supplier.findAndCountAll(options)
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
  Supplier.findOne({
    where: {
      id: id,
    },
  })
    .then((supplier) => {
      res.status(200).json({
        results: {
          list: supplier,
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
        message: "Xảy ra lỗi khi lấy thông tin nhà cung cấp!",
      });
    });
};

const create = async (req, res) => {
  const { id, supplierName, supplierGroupId, healthFacilityId, status } =
    req.body;
  const supplier = await Supplier.findOne({
    where: {
      [Op.and]: [
        { supplierName: supplierName },
        { healthFacilityId: healthFacilityId },
      ],
    },
  });

  if (supplier) {
    res.status(200).json({
      success: false,
      error: "Nhà cung cấp đã tồn tại!",
      message: "Nhà cung cấp đã tồn tại!",
    });
  } else {
    Supplier.create({
      id:
        id ||
        Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
      supplierName,
      supplierGroupId,
      healthFacilityId,
      status,
    })
      .then((supplier) => {
        res.status(200).json({
          results: {
            list: supplier,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Tạo mới nhà cung cấp thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi tạo mới nhà cung cấp!",
        });
      });
  }
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const {
    supplierName,
    supplierNameOld,
    supplierGroupId,
    healthFacilityId,
    status,
  } = req.body;
  const supplier = await Supplier.findOne({
    where: {
      [Op.and]: [
        { supplierName: supplierName },
        { healthFacilityId: healthFacilityId },
      ],
    },
  });
  if (supplier && supplierNameOld !== supplierName) {
    res.status(200).json({
      success: false,
      error: "Nhà cung cấp đã tồn tại!",
      message: "Nhà cung cấp đã tồn tại!",
    });
  } else {
    Supplier.update(
      {
        status: status,
        supplierName: supplierName,
        supplierGroupId: supplierGroupId,
        healthFacilityId: healthFacilityId,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((supplier) => {
        res.status(200).json({
          results: {
            list: supplier,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Cập nhật nhà cung cấp thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi cập nhật nhà cung cấp!",
        });
      });
  }
};
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  Supplier.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((supplier) => {
      res.status(200).json({
        results: {
          list: supplier,
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
  Supplier.destroy({
    where: {
      id: id,
    },
  })
    .then((supplier) => {
      res.status(200).json({
        results: {
          list: supplier,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa nhà cung cấp thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa nhà cung cấp!",
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
