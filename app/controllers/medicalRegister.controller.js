const db = require("../models");
const MedicalRegister = db.medicalRegister;
const ClinicService = db.clinicService;
const ClinicServicePackage = db.clinicServicePackage;
const User = db.user;
const Customer = db.customer;

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
        "clinicServiceId",
        "date",
        "customerId",
        "contactChannel",
        "userId",
        "description",
        "healthFacilityId",
        "status",
        "clinicTimeId",
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status || "";
  const customerId = filters.customerId || "";
  const customerName = filters.customerName || "";
  const mobile = filters.mobile || "";
  const clinicServiceId = filters.clinicServiceId || "";
  const userId = filters.userId || "";
  const healthFacilityId = filters.healthFacilityId || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        { status: { [Op.like]: "%" + status + "%" } },
        {
          customerId: {
            [Op.like]: "%" + customerId + "%",
          },
        },
        {
          clinicServiceId: {
            [Op.like]: "%" + clinicServiceId + "%",
          },
        },
        { userId: { [Op.like]: "%" + userId + "%" } },
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
        model: ClinicService,
        required: true,
        attributes: ["id", "clinicServiceName"],
      },
      {
        model: User,
        required: true,
        attributes: ["id", "fullName"],
      },
      {
        model: Customer,
        required: true,
        attributes: ["id", "customerName", "mobile", "dateOfBirth"],
        where: {
          [Op.and]: [
            {
              mobile: { [Op.like]: "%" + mobile + "%" },
            },
            {
              customerName: { [Op.like]: "%" + customerName + "%" },
            },
          ],
        },
      },
    ],
  };

  MedicalRegister.findAndCountAll(options)
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
  MedicalRegister.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: ClinicService,
        required: true,
        attributes: ["id", "clinicServiceName", "time"],
        include: [
          {
            model: ClinicServicePackage,
            required: true,
            attributes: ["id", "clinicServicePackageName"],
          },
        ],
      },
      {
        model: User,
        required: true,
        attributes: ["id", "fullName"],
      },
      {
        model: Customer,
        required: true,
        attributes: ["id", "customerName", "mobile", "dateOfBirth"],
      },
    ],
  })
    .then((medicalRegister) => {
      res.status(200).json({
        results: {
          list: medicalRegister,
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
        message: "Xảy ra lỗi khi lấy thông tin lịch khám!",
      });
    });
};

const create = async (req, res) => {
  const {
    id,
    clinicServiceId,
    date,
    customerId,
    customerName,
    mobile,
    contactChannel,
    userId,
    description,
    healthFacilityId,
    clinicTimeId,
    status,
    exitsCustomer,
  } = req.body;

  const customerID =
    Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) + 100000000000;

  if (!exitsCustomer) {
    Customer.create({
      id: customerID,
      customerName,
      mobile,
      dateOfBirth: moment(),
      gender: 1,
      email: "",
      address: "",
      customerGroupId: 58458965475,
      healthFacilityId,
      status: 1,
    }).then((customer) => {
      MedicalRegister.create({
        id:
          id ||
          Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
            100000000000,
        clinicServiceId,
        date,
        clinicTimeId,
        customerId: customerID,
        contactChannel,
        userId,
        description,
        healthFacilityId,
        status,
      })
        .then((medicalRegister) => {
          res.status(200).json({
            results: {
              list: medicalRegister,
              pagination: [],
            },
            success: true,
            error: "",
            message: "Tạo mới lịch khám thành công!",
          });
        })
        .catch((err) => {
          res.status(200).json({
            success: false,
            error: err.message,
            message: "Xảy ra lỗi khi tạo mới lịch khám!",
          });
        });
    });
  } else {
    MedicalRegister.create({
      id:
        id ||
        Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
      clinicServiceId,
      date,
      clinicTimeId,
      customerId,
      contactChannel,
      userId,
      description,
      healthFacilityId,
      status,
    })
      .then((medicalRegister) => {
        res.status(200).json({
          results: {
            list: medicalRegister,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Tạo mới lịch khám thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi tạo mới lịch khám!",
        });
      });
  }
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const {
    clinicServiceId,
    date,
    clinicTimeId,
    customerId,
    contactChannel,
    userId,
    description,
    healthFacilityId,
    status,
  } = req.body;

  MedicalRegister.update(
    {
      clinicServiceId: clinicServiceId,
      date: date,
      clinicTimeId: clinicTimeId,
      customerId: customerId,
      contactChannel: contactChannel,
      userId: userId,
      description: description,
      healthFacilityId: healthFacilityId,
      status: status,
    },
    {
      where: {
        id: id,
      },
    }
  )
    .then((medicalRegister) => {
      res.status(200).json({
        results: {
          list: medicalRegister,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Cập nhật lịch khám thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi cập nhật lịch khám!",
      });
    });
};
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  MedicalRegister.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((medicalRegister) => {
      res.status(200).json({
        results: {
          list: medicalRegister,
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
  MedicalRegister.destroy({
    where: {
      id: id,
    },
  })
    .then((medicalRegister) => {
      res.status(200).json({
        results: {
          list: medicalRegister,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa lịch khám thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa lịch khám!",
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
