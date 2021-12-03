const db = require("../models");
const MedicineUnit = db.medicineUnit;
const Medicine = db.medicine;
const Unit = db.unit;
const moment = require("moment");

const Op = db.Sequelize.Op;

const getList = async (req, res) => {
  const { filter, range, sort, attributes } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const ranges = range ? JSON.parse(range) : [0, 20];
  const order = sort ? JSON.parse(sort) : ["createdAt", "DESC"];
  const attributesQuery = attributes
    ? attributes.split(",")
    : ["id", "unitName", "createdAt"];
  const medicineId = filters.medicineId || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [{ status: { [Op.like]: "%" + 1 + "%" } }],
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
        model: Medicine,
        required: true,
        attributes: ["id", "medicineName"],
        through: {
          where: {
            medicineId: { [Op.like]: "%" + medicineId + "%" },
          },
          attributes: [
            "id",
            "retailPrice",
            "wholesalePrice",
            "amount",
            "medicineId",
            "unitId",
          ],
        },
      },
    ],
  };

  Unit.findAndCountAll(options)
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
  MedicineUnit.findOne({
    where: {
      id: id,
    },
  })
    .then((medicineUnit) => {
      res.status(200).json({
        results: {
          list: medicineUnit,
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
        message: "Xảy ra lỗi khi lấy thông tin đơn vị tính!",
      });
    });
};

const create = async (req, res) => {
  const { id, retailPrice, wholesalePrice, amount, medicineId, unitId } =
    req.body;
  const medicineUnit = await MedicineUnit.findOne({
    where: {
      [Op.and]: [{ medicineId: medicineId }, { unitId: unitId }],
    },
  });

  if (medicineUnit) {
    res.status(200).json({
      success: false,
      error: "Đơn vị tính đã tồn tại!",
      message: "Đơn vị tính đã tồn tại!",
    });
  } else {
    MedicineUnit.create({
      id:
        id ||
        Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
      retailPrice,
      wholesalePrice,
      amount,
      medicineId,
      unitId,
    })
      .then((medicineUnit) => {
        res.status(200).json({
          results: {
            list: medicineUnit,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Tạo mới đơn vị tính thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi tạo mới đơn vị tính!",
        });
      });
  }
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const { retailPrice, wholesalePrice, amount, medicineId, unitId } = req.body;
  const medicineUnit = await MedicineUnit.findOne({
    where: {
      [Op.and]: [{ medicineId: medicineId }, { unitId: unitId }],
    },
  });
  if (medicineUnit) {
    res.status(200).json({
      success: false,
      error: "Đơn vị tính đã tồn tại!",
      message: "Đơn vị tính đã tồn tại!",
    });
  } else {
    MedicineUnit.update(
      {
        retailPrice: retailPrice,
        wholesalePrice: wholesalePrice,
        amount: amount,
        medicineId: medicineId,
        unitId: unitId,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((medicineUnit) => {
        res.status(200).json({
          results: {
            list: medicineUnit,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Cập nhật đơn vị tính thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi cập nhật đơn vị tính!",
        });
      });
  }
};

const deleteRecord = async (req, res) => {
  const { id } = req.params;
  MedicineUnit.destroy({
    where: {
      id: id,
    },
  })
    .then((medicineUnit) => {
      res.status(200).json({
        results: {
          list: medicineUnit,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa đơn vị tính thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa đơn vị tính!",
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
