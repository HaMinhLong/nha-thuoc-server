const db = require("../models");
const MedicineType = db.medicineType;
const moment = require("moment");

const Op = db.Sequelize.Op;

const getList = async (req, res) => {
  const { filter, range, sort, attributes } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const ranges = range ? JSON.parse(range) : [0, 20];
  const order = sort ? JSON.parse(sort) : ["createdAt", "DESC"];
  const attributesQuery = attributes
    ? attributes.split(",")
    : ["id", "medicineTypeName", "status", "createdAt", "updatedAt"];
  const status = filters.status || "";
  const medicineTypeName = filters.medicineTypeName || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        { status: { [Op.like]: "%" + status + "%" } },
        { medicineTypeName: { [Op.like]: "%" + medicineTypeName + "%" } },
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

  MedicineType.findAndCountAll(options)
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
  MedicineType.findOne({
    where: {
      id: id,
    },
  })
    .then((medicineType) => {
      res.status(200).json({
        results: {
          list: medicineType,
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
        message: "Xảy ra lỗi khi lấy thông tin vị trí thuốc!",
      });
    });
};

const create = async (req, res) => {
  const { id, medicineTypeName, status } = req.body;
  const medicineType = await MedicineType.findOne({
    where: { medicineTypeName: medicineTypeName },
  });

  if (medicineType) {
    res.status(200).json({
      success: false,
      error: "Vị trí thuốc đã tồn tại!",
      message: "Vị trí thuốc đã tồn tại!",
    });
  } else {
    MedicineType.create({
      id:
        id ||
        Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
      medicineTypeName,
      status,
    })
      .then((medicineType) => {
        res.status(200).json({
          results: {
            list: medicineType,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Tạo mới vị trí thuốc thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi tạo mới vị trí thuốc!",
        });
      });
  }
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const { medicineTypeName, medicineTypeNameOld, status } = req.body;
  const medicineType = await MedicineType.findOne({
    where: { medicineTypeName: medicineTypeName },
  });
  if (medicineType && medicineTypeNameOld !== medicineTypeName) {
    res.status(200).json({
      success: false,
      error: "Vị trí thuốc đã tồn tại!",
      message: "Vị trí thuốc đã tồn tại!",
    });
  } else {
    MedicineType.update(
      {
        status: status,
        medicineTypeName: medicineTypeName,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((medicineType) => {
        res.status(200).json({
          results: {
            list: medicineType,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Cập nhật vị trí thuốc thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi cập nhật vị trí thuốc!",
        });
      });
  }
};
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  MedicineType.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((medicineType) => {
      res.status(200).json({
        results: {
          list: medicineType,
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
  MedicineType.destroy({
    where: {
      id: id,
    },
  })
    .then((medicineType) => {
      res.status(200).json({
        results: {
          list: medicineType,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa vị trí thuốc thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa vị trí thuốc!",
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
