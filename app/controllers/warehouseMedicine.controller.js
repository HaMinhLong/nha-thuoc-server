const db = require("../models");
const WarehouseMedicine = db.warehouseMedicine;
const Medicine = db.medicine;
const Producer = db.producer;
const MedicineType = db.medicineType;
const ReceiptMedicine = db.receiptMedicine;

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
        "exchange",
        "inStock",
        "medicineId",
        "unitId",
        "warehouseId",
        "createdAt",
        "updatedAt",
      ];
  const warehouseId = filters.warehouseId || "";
  const healthFacilityId = filters.healthFacilityId || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        {
          warehouseId: { [Op.like]: "%" + warehouseId + "%" },
        },
        {
          inStock: { [Op.gt]: 0 },
        },
        {
          createdAt: {
            [Op.between]: [fromDate, toDate],
          },
        },
      ],
    },
    order: [order],
    attributes: attributesQuery,
    offset: ranges[0],
    limit: size,
    include: [
      {
        model: ReceiptMedicine,
        required: true,
        attributes: ["id", "expiry", "receiptId"],
      },
      {
        model: Medicine,
        required: true,
        where: {
          [Op.and]: [
            { status: { [Op.like]: "%" + 1 + "%" } },
            { healthFacilityId: { [Op.like]: "%" + healthFacilityId + "%" } },
          ],
        },
        include: [
          {
            model: Producer,
            required: true,
            attributes: ["id", "producerName"],
          },
          {
            model: MedicineType,
            required: true,
            attributes: ["id", "medicineTypeName"],
          },
        ],
      },
    ],
  };

  WarehouseMedicine.findAndCountAll(options)
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
  const { filter } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const medicineId = filters.medicineId || "";
  const warehouseId = filters.warehouseId || "";

  WarehouseMedicine.findOne({
    where: {
      [Op.and]: [
        {
          medicineId: medicineId,
        },
        {
          warehouseId: warehouseId,
        },
      ],
    },
  }).then((warehouse) => {
    res.json({
      results: {
        list: warehouse,
      },
    });
  });
};

module.exports = {
  getList,
  getOne,
};
