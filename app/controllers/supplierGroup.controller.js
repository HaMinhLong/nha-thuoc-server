const db = require("../models");
const SupplierGroup = db.supplierGroup;
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
        "supplierGroupName",
        "healthFacilityId",
        "status",
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status || "";
  const supplierGroupName = filters.supplierGroupName || "";
  const healthFacilityId = filters.healthFacilityId || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        { status: { [Op.like]: "%" + status + "%" } },
        { supplierGroupName: { [Op.like]: "%" + supplierGroupName + "%" } },
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

  SupplierGroup.findAndCountAll(options)
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
  SupplierGroup.findOne({
    where: {
      id: id,
    },
  })
    .then((supplierGroup) => {
      res.status(200).json({
        results: {
          list: supplierGroup,
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
        message: "Xảy ra lỗi khi lấy thông tin nhóm nhà cung cấp!",
      });
    });
};

const create = async (req, res) => {
  const { id, supplierGroupName, healthFacilityId, status } = req.body;
  const supplierGroup = await SupplierGroup.findOne({
    where: {
      [Op.and]: [
        { supplierGroupName: supplierGroupName },
        { healthFacilityId: healthFacilityId },
      ],
    },
  });

  if (supplierGroup) {
    res.status(200).json({
      success: false,
      error: "Nhóm nhà cung cấp đã tồn tại!",
      message: "Nhóm nhà cung cấp đã tồn tại!",
    });
  } else {
    SupplierGroup.create({
      id:
        id ||
        Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
      supplierGroupName,
      healthFacilityId,
      status,
    })
      .then((supplierGroup) => {
        res.status(200).json({
          results: {
            list: supplierGroup,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Tạo mới nhóm nhà cung cấp thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi tạo mới nhóm nhà cung cấp!",
        });
      });
  }
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const { supplierGroupName, provinceNameOld, healthFacilityId, status } =
    req.body;
  const supplierGroup = await SupplierGroup.findOne({
    where: {
      [Op.and]: [
        { supplierGroupName: supplierGroupName },
        { healthFacilityId: healthFacilityId },
      ],
    },
  });
  if (supplierGroup && provinceNameOld !== supplierGroupName) {
    res.status(200).json({
      success: false,
      error: "Nhóm nhà cung cấp đã tồn tại!",
      message: "Nhóm nhà cung cấp đã tồn tại!",
    });
  } else {
    SupplierGroup.update(
      {
        status: status,
        supplierGroupName: supplierGroupName,
        healthFacilityId: healthFacilityId,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((supplierGroup) => {
        res.status(200).json({
          results: {
            list: supplierGroup,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Cập nhật nhóm nhà cung cấp thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi cập nhật nhóm nhà cung cấp!",
        });
      });
  }
};
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  SupplierGroup.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((supplierGroup) => {
      res.status(200).json({
        results: {
          list: supplierGroup,
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
  SupplierGroup.destroy({
    where: {
      id: id,
    },
  })
    .then((supplierGroup) => {
      res.status(200).json({
        results: {
          list: supplierGroup,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa nhóm nhà cung cấp thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa nhóm nhà cung cấp!",
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
