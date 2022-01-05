const db = require("../models");
const MedicineTransfer = db.medicineTransfer;
const Medicine = db.medicine;
const User = db.user;
const Warehouse = db.warehouse;
const MedicineTransferMedicine = db.medicineTransferMedicine;
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
        "medicineTransferCode",
        "userId",
        "description",
        "warehouseId",
        "warehouseTransferId",
        "healthFacilityId",
        "status",
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status || "";
  const medicineTransferCode = filters.medicineTransferCode || "";
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
          medicineTransferCode: {
            [Op.like]: "%" + medicineTransferCode + "%",
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

  MedicineTransfer.findAndCountAll(options)
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
  MedicineTransfer.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: Medicine,
        required: true,
        through: {
          where: {
            medicineTransferId: { [Op.like]: "%" + id + "%" },
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
    .then((medicineTransfer) => {
      res.status(200).json({
        results: {
          list: medicineTransfer,
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
        message: "Xảy ra lỗi khi lấy thông tin phiếu chuyển Thuốc/Vật tư!",
      });
    });
};

const create = async (req, res) => {
  const {
    id,
    medicineTransferCode,
    userId,
    description,
    healthFacilityId,
    warehouseId,
    warehouseTransferId,
    status,
    medicines,
  } = req.body;
  const medicineTransferId =
    id ||
    Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) + 100000000000;
  const medicineTransfer = await MedicineTransfer.findOne({
    where: {
      [Op.and]: [
        { medicineTransferCode: medicineTransferCode },
        { healthFacilityId: healthFacilityId },
      ],
    },
  });
  const MedicineTransferMedicineAdd = medicines?.filter(
    (item) => item.flag < 0
  );
  const MedicineTransferMedicineCreate = MedicineTransferMedicineAdd?.map(
    (item) => {
      return {
        id:
          Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
        amount: item.medicineTransferMedicines.amount,
        price: item.medicineTransferMedicines.price,
        total: item.medicineTransferMedicines.total || 0,
        unitId: item.medicineTransferMedicines.unitId,
        exchange: item.medicineTransferMedicines.exchange,
        medicineId: item.id,
        medicineTransferId: medicineTransferId,
      };
    }
  );
  if (medicineTransfer) {
    res.status(200).json({
      success: false,
      error: "Phiếu chuyển Thuốc/Vật tư đã tồn tại!",
      message: "Phiếu chuyển Thuốc/Vật tư đã tồn tại!",
    });
  } else {
    MedicineTransfer.create({
      id: medicineTransferId,
      medicineTransferCode,
      userId,
      description,
      healthFacilityId,
      warehouseId,
      warehouseTransferId,
      status,
    })
      .then((medicineTransfer) => {
        MedicineTransferMedicine.bulkCreate(MedicineTransferMedicineCreate);
        for (
          let index = 0;
          index < MedicineTransferMedicineCreate.length;
          index++
        ) {
          WarehouseMedicine.findOne({
            where: {
              [Op.and]: [
                {
                  medicineId: MedicineTransferMedicineCreate[index].medicineId,
                },
                {
                  warehouseId: warehouseId,
                },
              ],
            },
          }).then((warehouse) => {
            WarehouseMedicine.findOne({
              where: {
                [Op.and]: [
                  {
                    medicineId:
                      MedicineTransferMedicineCreate[index].medicineId,
                  },
                  {
                    warehouseId: warehouseTransferId,
                  },
                ],
              },
            }).then((warehouseTransfer) => {
              if (warehouseTransfer === null) {
                WarehouseMedicine.create({
                  id:
                    Math.floor(
                      Math.random() * (100000000000 - 1000000000 + 1)
                    ) + 100000000000,
                  exchange: MedicineTransferMedicineCreate[index].exchange,
                  inStock: MedicineTransferMedicineCreate[index].amount,
                  medicineId: MedicineTransferMedicineCreate[index].medicineId,
                  warehouseId: warehouseTransferId,
                  unitId: MedicineTransferMedicineCreate[index].unitId,
                });
              } else {
                WarehouseMedicine.update(
                  {
                    inStock:
                      warehouseTransfer.inStock +
                      MedicineTransferMedicineCreate[index].amount *
                        (warehouseTransfer.exchange /
                          MedicineTransferMedicineCreate[index].exchange),
                  },
                  {
                    where: {
                      [Op.and]: [
                        {
                          medicineId:
                            MedicineTransferMedicineCreate[index].medicineId,
                        },
                        {
                          warehouseId: warehouseTransferId,
                        },
                      ],
                    },
                  }
                );
                WarehouseMedicine.update(
                  {
                    inStock:
                      warehouse.inStock -
                      MedicineTransferMedicineCreate[index].amount *
                        (warehouse.exchange /
                          MedicineTransferMedicineCreate[index].exchange),
                  },
                  {
                    where: {
                      [Op.and]: [
                        {
                          medicineId:
                            MedicineTransferMedicineCreate[index].medicineId,
                        },
                        {
                          warehouseId: warehouseId,
                        },
                      ],
                    },
                  }
                );
              }
            });
          });
        }
        res.status(200).json({
          results: {
            list: medicineTransfer,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Tạo mới phiếu chuyển Thuốc/Vật tư thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi tạo mới phiếu chuyển Thuốc/Vật tư!",
        });
      });
  }
};

const updateRecord = async (req, res) => {
  const { id } = req.params;
  const {
    medicineTransferCode,
    medicineTransferCodeOld,
    userId,
    description,
    healthFacilityId,
    warehouseTransferId,
    warehouseId,
    status,
  } = req.body;
  const medicineTransfer = await MedicineTransfer.findOne({
    where: {
      [Op.and]: [
        { medicineTransferCode: medicineTransferCode },
        { healthFacilityId: healthFacilityId },
      ],
    },
  });
  if (medicineTransfer && medicineTransferCodeOld !== medicineTransferCode) {
    res.status(200).json({
      success: false,
      error: "Phiếu chuyển Thuốc/Vật tư đã tồn tại!",
      message: "Phiếu chuyển Thuốc/Vật tư đã tồn tại!",
    });
  } else {
    MedicineTransfer.update(
      {
        medicineTransferCode: medicineTransferCode,
        userId: userId,
        description: description,
        healthFacilityId: healthFacilityId,
        warehouseId: warehouseId,
        warehouseTransferId: warehouseTransferId,
        status: status,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((medicineTransfer) => {
        res.status(200).json({
          results: {
            list: medicineTransfer,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Cập nhật phiếu chuyển Thuốc/Vật tư thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi cập nhật phiếu chuyển Thuốc/Vật tư!",
        });
      });
  }
};
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  MedicineTransfer.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((medicineTransfer) => {
      res.status(200).json({
        results: {
          list: medicineTransfer,
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
  MedicineTransfer.destroy({
    where: {
      id: id,
    },
  })
    .then((medicineTransfer) => {
      res.status(200).json({
        results: {
          list: medicineTransfer,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa phiếu chuyển Thuốc/Vật tư thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa phiếu chuyển Thuốc/Vật tư!",
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
