const db = require("../models");
const MedicineIssueMedicine = db.medicineIssueMedicine;
const Medicine = db.medicine;
const MedicineIssue = db.medicineIssue;

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
        "retail",
        "description",
        "discount",
        "discountType",
        "tax",
        "taxType",
        "total",
        "unitId",
        "medicineIssueId",
        "medicineId",
        "createdAt",
        "updatedAt",
      ];
  const medicineIssueId = filters.medicineIssueId || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        {
          medicineIssueId: {
            [Op.like]: "%" + medicineIssueId + "%",
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

  MedicineIssueMedicine.findAndCountAll(options)
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

  MedicineIssue.findOne({
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
    .then((medicineIssueMedicine) => {
      res.status(200).json({
        results: {
          list: medicineIssueMedicine,
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
        message: "Xảy ra lỗi khi lấy thông tin thuốc tại phiếu!",
      });
    });
};

const create = async (req, res) => {
  const {
    id,
    price,
    amount,
    retail,
    description,
    discount,
    discountType,
    tax,
    taxType,
    total,
    unitId,
    medicineIssueId,
    medicineId,
  } = req.body;

  MedicineIssueMedicine.create({
    id:
      id ||
      Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
        100000000000,
    price,
    amount,
    retail,
    description,
    discount,
    discountType,
    tax,
    taxType,
    total,
    unitId,
    medicineIssueId,
    medicineId,
  })
    .then((medicineIssueMedicine) => {
      res.status(200).json({
        results: {
          list: medicineIssueMedicine,
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
    price,
    amount,
    retail,
    description,
    discount,
    discountType,
    tax,
    taxType,
    total,
    unitId,
    medicineIssueId,
    medicineId,
  } = req.body;

  MedicineIssueMedicine.update(
    {
      price: price,
      amount: amount,
      retail: retail,
      description: description,
      discount: discount,
      discountType: discountType,
      tax: tax,
      taxType: taxType,
      total: total,
      unitId: unitId,
      medicineIssueId: medicineIssueId,
      medicineId: medicineId,
    },
    {
      where: {
        id: id,
      },
    }
  )
    .then((medicineIssueMedicine) => {
      res.status(200).json({
        results: {
          list: medicineIssueMedicine,
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
  MedicineIssueMedicine.destroy({
    where: {
      id: id,
    },
  })
    .then((medicineIssueMedicine) => {
      res.status(200).json({
        results: {
          list: medicineIssueMedicine,
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
