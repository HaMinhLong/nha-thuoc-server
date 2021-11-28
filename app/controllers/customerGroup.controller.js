const db = require("../models");
const CustomerGroup = db.customerGroup;
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
        "customerGroupName",
        "healthFacilityId",
        "status",
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status || "";
  const customerGroupName = filters.customerGroupName || "";
  const healthFacilityId = filters.healthFacilityId || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        { status: { [Op.like]: "%" + status + "%" } },
        { customerGroupName: { [Op.like]: "%" + customerGroupName + "%" } },
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

  CustomerGroup.findAndCountAll(options)
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
  CustomerGroup.findOne({
    where: {
      id: id,
    },
  })
    .then((customerGroup) => {
      res.status(200).json({
        results: {
          list: customerGroup,
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
        message: "Xảy ra lỗi khi lấy thông tin nhóm khách hàng!",
      });
    });
};

const create = async (req, res) => {
  const { id, customerGroupName, healthFacilityId, status } = req.body;
  const customerGroup = await CustomerGroup.findOne({
    where: {
      [Op.and]: [
        { customerGroupName: customerGroupName },
        { healthFacilityId: healthFacilityId },
      ],
    },
  });

  if (customerGroup) {
    res.status(200).json({
      success: false,
      error: "Nhóm khách hàng đã tồn tại!",
      message: "Nhóm khách hàng đã tồn tại!",
    });
  } else {
    CustomerGroup.create({
      id:
        id ||
        Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
      customerGroupName,
      healthFacilityId,
      status,
    })
      .then((customerGroup) => {
        res.status(200).json({
          results: {
            list: customerGroup,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Tạo mới nhóm khách hàng thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi tạo mới nhóm khách hàng!",
        });
      });
  }
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const { customerGroupName, customerGroupNameOld, healthFacilityId, status } =
    req.body;
  const customerGroup = await CustomerGroup.findOne({
    where: {
      [Op.and]: [
        { customerGroupName: customerGroupName },
        { healthFacilityId: healthFacilityId },
      ],
    },
  });
  if (customerGroup && customerGroupNameOld !== customerGroupName) {
    res.status(200).json({
      success: false,
      error: "Nhóm khách hàng đã tồn tại!",
      message: "Nhóm khách hàng đã tồn tại!",
    });
  } else {
    CustomerGroup.update(
      {
        status: status,
        customerGroupName: customerGroupName,
        healthFacilityId: healthFacilityId,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((customerGroup) => {
        res.status(200).json({
          results: {
            list: customerGroup,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Cập nhật nhóm khách hàng thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi cập nhật nhóm khách hàng!",
        });
      });
  }
};
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  CustomerGroup.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((customerGroup) => {
      res.status(200).json({
        results: {
          list: customerGroup,
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
  CustomerGroup.destroy({
    where: {
      id: id,
    },
  })
    .then((customerGroup) => {
      res.status(200).json({
        results: {
          list: customerGroup,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa nhóm khách hàng thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa nhóm khách hàng!",
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
