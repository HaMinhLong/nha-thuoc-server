const db = require("../models");
const Medicine = db.medicine;
const MedicineUnit = db.medicineUnit;
const MedicineType = db.medicineType;
const Producer = db.producer;
const Package = db.package;
const WarehouseUser = db.warehouseUser;
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
        "medicineName",
        "registrationNumber",
        "standard",
        "activeIngredientName",
        "concentration",
        "country",
        "medicineTypeId",
        "apothecaryId",
        "packageId",
        "producerId",
        "healthFacilityId",
        "status",
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status || "";
  const medicineName = filters.medicineName || "";
  const medicineTypeId = filters.medicineTypeId || "";
  const producerId = filters.producerId || "";
  const healthFacilityId = filters.healthFacilityId || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        { status: { [Op.like]: "%" + status + "%" } },
        { medicineName: { [Op.like]: "%" + medicineName + "%" } },
        { medicineTypeId: { [Op.like]: "%" + medicineTypeId + "%" } },
        { producerId: { [Op.like]: "%" + producerId + "%" } },
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
        model: MedicineType,
        required: true,
        attributes: ["id", "medicineTypeName"],
      },
      {
        model: Producer,
        required: true,
        attributes: ["id", "producerName"],
      },
      {
        model: Package,
        required: true,
        attributes: ["id", "packageName"],
      },
    ],
  };

  Medicine.findAndCountAll(options)
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
  Medicine.findOne({
    where: {
      id: id,
    },
  })
    .then((medicine) => {
      res.status(200).json({
        results: {
          list: medicine,
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
        message: "Xảy ra lỗi khi lấy thông tin thuốc!",
      });
    });
};

const create = async (req, res) => {
  const {
    id,
    medicineName,
    registrationNumber,
    standard,
    activeIngredientName,
    concentration,
    country,
    medicineTypeId,
    apothecaryId,
    packageId,
    producerId,
    healthFacilityId,
    status,
    medicineUnits,
  } = req.body;
  const medicineId =
    Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) + 100000000000;
  const medicine = await Medicine.findOne({
    where: {
      [Op.and]: [
        { medicineName: medicineName },
        { healthFacilityId: healthFacilityId },
      ],
    },
  });
  if (medicine) {
    res.status(200).json({
      success: false,
      error: "Thuốc đã tồn tại!",
      message: "Thuốc đã tồn tại!",
    });
  } else {
    const medicineUnitAdd = medicineUnits?.filter((item) => item.id < 0);
    const medicineCreate = medicineUnitAdd?.map((item) => {
      return {
        ...item,
        id:
          Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
        medicineId: medicineId,
      };
    });

    Medicine.create({
      id: id || medicineId,
      medicineName,
      registrationNumber,
      standard,
      activeIngredientName,
      concentration,
      country,
      medicineTypeId,
      apothecaryId,
      packageId,
      producerId,
      healthFacilityId,
      status,
    })
      .then((medicine) => {
        MedicineUnit.bulkCreate(medicineCreate);
        res.status(200).json({
          results: {
            list: medicine,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Tạo mới thuốc thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi tạo mới thuốc!",
        });
      });
  }
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const {
    medicineName,
    medicineNameOld,
    registrationNumber,
    standard,
    activeIngredientName,
    concentration,
    country,
    medicineTypeId,
    apothecaryId,
    packageId,
    producerId,
    healthFacilityId,
    status,
    medicineUnits,
  } = req.body;
  const medicine = await Medicine.findOne({
    where: {
      [Op.and]: [
        { medicineName: medicineName },
        { healthFacilityId: healthFacilityId },
      ],
    },
  });
  if (medicine && medicineNameOld !== medicineName) {
    res.status(200).json({
      success: false,
      error: "Thuốc đã tồn tại!",
      message: "Thuốc đã tồn tại!",
    });
  } else {
    const medicineUnitUpdate = medicineUnits?.filter((item) => item.id > 0);
    const medicineUnitAdd = medicineUnits?.filter((item) => item.id < 0);
    const medicineCreate = medicineUnitAdd?.map((item) => {
      return {
        ...item,
        id:
          Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
      };
    });
    Medicine.update(
      {
        medicineName: medicineName,
        registrationNumber: registrationNumber,
        standard: standard,
        activeIngredientName: activeIngredientName,
        concentration: concentration,
        country: country,
        medicineTypeId: medicineTypeId,
        apothecaryId: apothecaryId,
        packageId: packageId,
        producerId: producerId,
        healthFacilityId: healthFacilityId,
        status: status,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((medicine) => {
        MedicineUnit.bulkCreate(medicineCreate);
        for (let index = 0; index < medicineUnitUpdate.length; index++) {
          MedicineUnit.update(
            {
              retailPrice: medicineUnitUpdate[index].retailPrice,
              wholesalePrice: medicineUnitUpdate[index].wholesalePrice,
              amount: medicineUnitUpdate[index].amount,
            },
            {
              where: {
                id: medicineUnitUpdate[index].id,
              },
            }
          );
        }
        res.status(200).json({
          results: {
            list: medicine,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Cập nhật thuốc thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi cập nhật thuốc!",
        });
      });
  }
};
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  Medicine.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((medicine) => {
      res.status(200).json({
        results: {
          list: medicine,
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
  WarehouseUser.destroy({
    where: {
      medicineId: id,
    },
  });
  Medicine.destroy({
    where: {
      id: id,
    },
  })
    .then((medicine) => {
      res.status(200).json({
        results: {
          list: medicine,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa thuốc thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa thuốc!",
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
