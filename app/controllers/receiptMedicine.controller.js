const db = require("../models");
const ReceiptMedicine = db.receiptMedicine;
const Medicine = db.medicine;
const Receipt = db.receipt;

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
        "barcode",
        "lotNumber",
        "dateOfManufacture",
        "expiry",
        "price",
        "amount",
        "discount",
        "discountType",
        "tax",
        "taxType",
        "unitId",
        "receiptId",
        "medicineId",
        "total",
        "createdAt",
        "updatedAt",
      ];
  const receiptId = filters.receiptId || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        {
          receiptId: {
            [Op.like]: "%" + receiptId + "%",
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

  ReceiptMedicine.findAndCountAll(options)
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

  Receipt.findOne({
    attributes: ["id"],
    include: [
      {
        model: Medicine,
        required: true,
        through: {
          where: {
            id: id,
          },
        },
      },
    ],
  })
    .then((receiptMedicine) => {
      res.status(200).json({
        results: {
          list: receiptMedicine,
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
        message: "Xảy ra lỗi khi lấy thông tin thông tin thuốc tại phiếu!",
      });
    });
};

const create = async (req, res) => {
  const {
    id,
    barcode,
    lotNumber,
    dateOfManufacture,
    expiry,
    price,
    amount,
    discount,
    discountType,
    tax,
    taxType,
    unitId,
    receiptId,
    medicineId,
    total,
  } = req.body;

  ReceiptMedicine.create({
    id:
      id ||
      Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
        100000000000,
    barcode,
    lotNumber,
    dateOfManufacture,
    expiry,
    price,
    amount,
    discount,
    discountType,
    tax,
    taxType,
    unitId,
    receiptId,
    medicineId,
    total,
  })
    .then((receiptMedicine) => {
      res.status(200).json({
        results: {
          list: receiptMedicine,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Tạo mới thông tin thuốc tại phiếu thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi tạo mới thông tin thuốc tại phiếu!",
      });
    });
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const {
    barcode,
    lotNumber,
    dateOfManufacture,
    expiry,
    price,
    amount,
    discount,
    discountType,
    tax,
    taxType,
    unitId,
    receiptId,
    medicineId,
    total,
  } = req.body;

  ReceiptMedicine.update(
    {
      barcode: barcode,
      lotNumber: lotNumber,
      dateOfManufacture: dateOfManufacture,
      expiry: expiry,
      price: price,
      amount: amount,
      discount: discount,
      discountType: discountType,
      tax: tax,
      taxType: taxType,
      unitId: unitId,
      receiptId: receiptId,
      medicineId: medicineId,
      total: total,
    },
    {
      where: {
        id: id,
      },
    }
  )
    .then((receiptMedicine) => {
      res.status(200).json({
        results: {
          list: receiptMedicine,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Cập nhật thông tin thuốc tại phiếu thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi cập nhật thông tin thuốc tại phiếu!",
      });
    });
};

const deleteRecord = async (req, res) => {
  const { id } = req.params;
  ReceiptMedicine.destroy({
    where: {
      id: id,
    },
  })
    .then((receiptMedicine) => {
      res.status(200).json({
        results: {
          list: receiptMedicine,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa thông tin thuốc tại phiếu thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa thông tin thuốc tại phiếu!",
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
