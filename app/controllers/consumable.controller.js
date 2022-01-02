const db = require("../models");
const Consumable = db.consumable;
const Medicine = db.medicine;
const User = db.user;
const Warehouse = db.warehouse;
const ConsumableMedicine = db.consumableMedicine;
const WarehouseMedicine = db.warehouseMedicine;

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
        "consumableCode",
        "userId",
        "description",
        "warehouseId",
        "healthFacilityId",
        "status",
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status || "";
  const consumableCode = filters.consumableCode || "";
  const warehouseId = filters.warehouseId || "";
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
          consumableCode: {
            [Op.like]: "%" + consumableCode + "%",
          },
        },
        { healthFacilityId: { [Op.like]: "%" + healthFacilityId + "%" } },
        { warehouseId: { [Op.like]: "%" + warehouseId + "%" } },
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
        model: User,
        required: true,
        attributes: ["id", "fullName"],
      },
      {
        model: Warehouse,
        required: true,
        attributes: ["id", "warehouseName"],
      },
    ],
  };

  Consumable.findAndCountAll(options)
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
  Consumable.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: Medicine,
        required: true,
        through: {
          where: {
            consumableId: { [Op.like]: "%" + id + "%" },
          },
        },
      },
      {
        model: User,
        required: true,
        attributes: ["id", "fullName"],
      },
      {
        model: Warehouse,
        required: true,
        attributes: ["id", "warehouseName"],
      },
    ],
  })
    .then((consumable) => {
      res.status(200).json({
        results: {
          list: consumable,
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
        message: "Xảy ra lỗi khi lấy thông tin phiếu vật tư tiêu hao!",
      });
    });
};

const create = async (req, res) => {
  const {
    id,
    consumableCode,
    userId,
    description,
    healthFacilityId,
    warehouseId,
    status,
    medicines,
  } = req.body;
  const consumableId =
    id ||
    Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) + 100000000000;
  const consumable = await Consumable.findOne({
    where: {
      [Op.and]: [
        { consumableCode: consumableCode },
        { healthFacilityId: healthFacilityId },
      ],
    },
  });
  const ConsumableMedicineAdd = medicines?.filter((item) => item.flag < 0);
  const ConsumableMedicineCreate = ConsumableMedicineAdd?.map((item) => {
    return {
      id:
        Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
        100000000000,
      amount: item.consumableMedicines.amount,
      price: item.consumableMedicines.price,
      total: item.consumableMedicines.total || 0,
      unitId: item.consumableMedicines.unitId,
      exchange: item.consumableMedicines.exchange,
      medicineId: item.id,
      consumableId: consumableId,
    };
  });
  if (consumable) {
    res.status(200).json({
      success: false,
      error: "Phiếu vật tư tiêu hao đã tồn tại!",
      message: "Phiếu vật tư tiêu hao đã tồn tại!",
    });
  } else {
    Consumable.create({
      id: consumableId,
      consumableCode,
      userId,
      description,
      healthFacilityId,
      warehouseId,
      status,
    })
      .then((consumable) => {
        ConsumableMedicine.bulkCreate(ConsumableMedicineCreate);
        for (let index = 0; index < ConsumableMedicineCreate.length; index++) {
          WarehouseMedicine.findOne({
            where: {
              [Op.and]: [
                {
                  medicineId: ConsumableMedicineCreate[index].medicineId,
                },
                {
                  warehouseId: warehouseId,
                },
              ],
            },
          }).then((warehouse) => {
            WarehouseMedicine.update(
              {
                inStock:
                  warehouse.inStock -
                  ConsumableMedicineCreate[index].amount *
                    (warehouse.exchange /
                      ConsumableMedicineCreate[index].exchange),
              },
              {
                where: {
                  [Op.and]: [
                    {
                      medicineId: ConsumableMedicineCreate[index].medicineId,
                    },
                    {
                      warehouseId: warehouseId,
                    },
                  ],
                },
              }
            );
          });
        }
        res.status(200).json({
          results: {
            list: consumable,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Tạo mới phiếu vật tư tiêu hao thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi tạo mới phiếu vật tư tiêu hao!",
        });
      });
  }
};

const updateRecord = async (req, res) => {
  const { id } = req.params;
  const {
    consumableCode,
    consumableCodeOld,
    userId,
    description,
    healthFacilityId,
    warehouseId,
    status,
  } = req.body;
  const consumable = await Consumable.findOne({
    where: {
      [Op.and]: [
        { consumableCode: consumableCode },
        { healthFacilityId: healthFacilityId },
      ],
    },
  });
  if (consumable && consumableCodeOld !== consumableCode) {
    res.status(200).json({
      success: false,
      error: "Phiếu vật tư tiêu hao đã tồn tại!",
      message: "Phiếu vật tư tiêu hao đã tồn tại!",
    });
  } else {
    Consumable.update(
      {
        consumableCode: consumableCode,
        userId: userId,
        description: description,
        healthFacilityId: healthFacilityId,
        warehouseId: warehouseId,
        status: status,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((consumable) => {
        res.status(200).json({
          results: {
            list: consumable,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Cập nhật phiếu vật tư tiêu hao thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi cập nhật phiếu vật tư tiêu hao!",
        });
      });
  }
};
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  Consumable.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((consumable) => {
      res.status(200).json({
        results: {
          list: consumable,
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
  Consumable.destroy({
    where: {
      id: id,
    },
  })
    .then((consumable) => {
      res.status(200).json({
        results: {
          list: consumable,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa phiếu vật tư tiêu hao thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa phiếu vật tư tiêu hao!",
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
