const db = require("../models");
const ClinicReceiptService = db.clinicReceiptService;
const ClinicReceipt = db.clinicReceipt;
const ClinicService = db.clinicService;

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
        "price",
        "amount",
        "discount",
        "discountType",
        "tax",
        "taxType",
        "total",
        "clinicReceiptId",
        "clinicServiceId",
        "createdAt",
        "updatedAt",
      ];
  const clinicReceiptId = filters.clinicReceiptId || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        {
          clinicReceiptId: {
            [Op.like]: "%" + clinicReceiptId + "%",
          },
        },
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

  ClinicReceiptService.findAndCountAll(options)
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

  ClinicReceipt.findOne({
    attributes: ["id"],
    include: [
      {
        model: ClinicService,
        required: true,
        through: {
          where: {
            id: id,
          },
        },
      },
    ],
  })
    .then((clinicReceiptService) => {
      res.status(200).json({
        results: {
          list: clinicReceiptService,
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
        message: "Xảy ra lỗi khi lấy thông tin dịch vụ!",
      });
    });
};

const create = async (req, res) => {
  const {
    id,
    price,
    amount,
    discount,
    discountType,
    tax,
    taxType,
    total,
    clinicReceiptId,
    clinicServiceId,
  } = req.body;

  ClinicReceiptService.create({
    id:
      id ||
      Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
        100000000000,
    price,
    amount,
    discount,
    discountType,
    tax,
    taxType,
    total,
    clinicReceiptId,
    clinicServiceId,
  })
    .then((clinicReceiptService) => {
      res.status(200).json({
        results: {
          list: clinicReceiptService,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Tạo mới thông tin dịch vụ thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi tạo mới thông tin dịch vụ!",
      });
    });
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const {
    price,
    amount,
    discount,
    discountType,
    tax,
    taxType,
    total,
    clinicReceiptId,
    clinicServiceId,
  } = req.body;

  ClinicReceiptService.update(
    {
      price: price,
      amount: amount,
      discount: discount,
      discountType: discountType,
      tax: tax,
      taxType: taxType,
      total: total,
      clinicReceiptId: clinicReceiptId,
      clinicServiceId: clinicServiceId,
    },
    {
      where: {
        id: id,
      },
    }
  )
    .then((clinicReceiptService) => {
      res.status(200).json({
        results: {
          list: clinicReceiptService,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Cập nhật thông tin dịch vụ thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi cập nhật thông tin dịch vụ!",
      });
    });
};

const deleteRecord = async (req, res) => {
  const { id } = req.params;
  ClinicReceiptService.destroy({
    where: {
      id: id,
    },
  })
    .then((clinicReceiptService) => {
      res.status(200).json({
        results: {
          list: clinicReceiptService,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa thông tin dịch vụ thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa thông tin dịch vụ!",
      });
    });
};
module.exports = {
  getList,
  getOne,
  create,
  updateRecord,
  deleteRecord,
};
