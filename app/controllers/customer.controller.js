const db = require("../models");
const Customer = db.customer;
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
        "customerName",
        "mobile",
        "dateOfBirth",
        "gender",
        "email",
        "provinceId",
        "districtId",
        "wardId",
        "address",
        "customerGroupId",
        "healthFacilityId",
        "status",
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status || "";
  const customerName = filters.customerName || "";
  const customerGroupId = filters.customerGroupId || "";
  const gender = filters.gender || "";
  const provinceId = filters.customerGroupId || "";
  const districtId = filters.districtId || "";
  const wardId = filters.wardId || "";
  const healthFacilityId = filters.healthFacilityId || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        { status: { [Op.like]: "%" + status + "%" } },
        { customerName: { [Op.like]: "%" + customerName + "%" } },
        { customerGroupId: { [Op.like]: "%" + customerGroupId + "%" } },
        { gender: { [Op.like]: "%" + gender + "%" } },
        { provinceId: { [Op.like]: "%" + provinceId + "%" } },
        { districtId: { [Op.like]: "%" + districtId + "%" } },
        { wardId: { [Op.like]: "%" + wardId + "%" } },
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
    include: [
      {
        model: CustomerGroup,
        required: true,
        attributes: ["id", "customerGroupName"],
      },
    ],
  };

  Customer.findAndCountAll(options)
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
  Customer.findOne({
    where: {
      id: id,
    },
  })
    .then((customer) => {
      res.status(200).json({
        results: {
          list: customer,
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
        message: "Xảy ra lỗi khi lấy thông tin khách hàng!",
      });
    });
};

const create = async (req, res) => {
  const {
    id,
    customerName,
    mobile,
    dateOfBirth,
    gender,
    email,
    provinceId,
    districtId,
    wardId,
    address,
    customerGroupId,
    healthFacilityId,
    status,
  } = req.body;
  const customer = await Customer.findOne({
    where: {
      [Op.and]: [
        { customerName: customerName },
        { healthFacilityId: healthFacilityId },
      ],
    },
  });

  if (customer) {
    res.status(200).json({
      success: false,
      error: "Khách hàng đã tồn tại!",
      message: "Khách hàng đã tồn tại!",
    });
  } else {
    Customer.create({
      id:
        id ||
        Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
      customerName,
      mobile,
      dateOfBirth,
      gender,
      email,
      provinceId,
      districtId,
      wardId,
      address,
      customerGroupId,
      healthFacilityId,
      status,
    })
      .then((customer) => {
        res.status(200).json({
          results: {
            list: customer,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Tạo mới khách hàng thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi tạo mới khách hàng!",
        });
      });
  }
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const {
    customerName,
    mobile,
    dateOfBirth,
    gender,
    email,
    provinceId,
    districtId,
    wardId,
    address,
    customerGroupId,
    healthFacilityId,
    status,
  } = req.body;
  const customer = await Customer.findOne({
    where: {
      [Op.and]: [
        { customerName: customerName },
        { healthFacilityId: healthFacilityId },
      ],
    },
  });
  if (customer && customerNameOld !== customerName) {
    res.status(200).json({
      success: false,
      error: "Khách hàng đã tồn tại!",
      message: "Khách hàng đã tồn tại!",
    });
  } else {
    Customer.update(
      {
        customerName: customerName,
        mobile: mobile,
        dateOfBirth: dateOfBirth,
        gender: gender,
        email: email,
        provinceId: provinceId,
        districtId: districtId,
        wardId: wardId,
        address: address,
        customerGroupId: customerGroupId,
        healthFacilityId: healthFacilityId,
        status: status,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((customer) => {
        res.status(200).json({
          results: {
            list: customer,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Cập nhật khách hàng thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi cập nhật khách hàng!",
        });
      });
  }
};
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  Customer.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((customer) => {
      res.status(200).json({
        results: {
          list: customer,
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
  Customer.destroy({
    where: {
      id: id,
    },
  })
    .then((customer) => {
      res.status(200).json({
        results: {
          list: customer,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa khách hàng thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa khách hàng!",
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
