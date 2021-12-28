const db = require("../models");
const MedicineIssue = db.medicineIssue;
const MedicineIssueMedicine = db.medicineIssueMedicine;
const WarehouseMedicine = db.warehouseMedicine;
const Medicine = db.medicine;
const Customer = db.customer;
const MedicineType = db.medicineType;
const Producer = db.producer;

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
        "medicineIssueCode",
        "customerId",
        "userId",
        "paymentMethodId",
        "debit",
        "description",
        "warehouseId",
        "healthFacilityId",
        "status",
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status || "";
  const medicineIssueCode = filters.medicineIssueCode || "";
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
          medicineIssueCode: {
            [Op.like]: "%" + medicineIssueCode + "%",
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
        model: Customer,
        required: true,
        attributes: ["id", "customerName"],
      },
      {
        model: Medicine,
        required: true,
        attributes: ["id", "medicineName"],
        through: {
          attributes: ["id", "total"],
        },
      },
    ],
  };

  MedicineIssue.findAndCountAll(options)
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
    where: {
      id: id,
    },
    include: [
      {
        model: Medicine,
        required: true,
        through: {
          where: {
            medicineIssueId: { [Op.like]: "%" + id + "%" },
          },
        },
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
        ],
      },
      {
        model: Customer,
        required: true,
        attributes: ["id", "customerName", "mobile", "address"],
      },
    ],
  })
    .then((medicineIssue) => {
      res.status(200).json({
        results: {
          list: medicineIssue,
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
        message: "Xảy ra lỗi khi lấy thông tin phiếu bán thuốc!",
      });
    });
};

const create = async (req, res) => {
  const {
    id,
    medicineIssueCode,
    customerId,
    mobile,
    customerName,
    userId,
    paymentMethodId,
    debit,
    description,
    healthFacilityId,
    warehouseId,
    status,
    exitsCustomer,
    medicines,
  } = req.body;
  const medicineIssueId =
    id ||
    Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) + 100000000000;
  const customerID =
    Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) + 100000000000;
  const medicineIssue = await MedicineIssue.findOne({
    where: {
      [Op.and]: [
        { medicineIssueCode: medicineIssueCode },
        { healthFacilityId: healthFacilityId },
      ],
    },
  });
  const warehouseMedicine = [];
  const MedicineIssueMedicineAdd = medicines?.filter((item) => item.flag < 0);
  const MedicineIssueMedicineCreate = MedicineIssueMedicineAdd?.map((item) => {
    return {
      id:
        Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
        100000000000,
      price: item.medicineIssueMedicines.price,
      amount: item.medicineIssueMedicines.amount,
      retail: item.medicineIssueMedicines.retail || false,
      description: item.medicineIssueMedicines.description || "",
      discount: item.medicineIssueMedicines.discount || 0,
      discountType: item.medicineIssueMedicines.discountType || 1,
      tax: item.medicineIssueMedicines.tax || 0,
      taxType: item.medicineIssueMedicines.taxType || 1,
      total: item.medicineIssueMedicines.total || 0,
      unitId: item.medicineIssueMedicines.unitId,
      exchange: item.medicineIssueMedicines.exchange,
      medicineId: item.id,
      medicineIssueId: medicineIssueId,
    };
  });
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
      if (medicineIssue) {
        res.status(200).json({
          success: false,
          error: "Phiếu bán thuốc đã tồn tại!",
          message: "Phiếu bán thuốc đã tồn tại!",
        });
      } else {
        MedicineIssue.create({
          id: medicineIssueId,
          medicineIssueCode,
          customerId: customerID,
          userId,
          paymentMethodId,
          debit,
          description,
          healthFacilityId,
          warehouseId,
          status,
        })
          .then((medicineIssue) => {
            MedicineIssueMedicine.bulkCreate(MedicineIssueMedicineCreate);
            for (
              let index = 0;
              index < MedicineIssueMedicineCreate.length;
              index++
            ) {
              WarehouseMedicine.findOne({
                where: {
                  [Op.and]: [
                    {
                      medicineId: MedicineIssueMedicineCreate[index].medicineId,
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
                      MedicineIssueMedicineCreate[index].amount *
                        (warehouse.exchange /
                          MedicineIssueMedicineCreate[index].exchange),
                  },
                  {
                    where: {
                      [Op.and]: [
                        {
                          medicineId:
                            MedicineIssueMedicineCreate[index].medicineId,
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
                list: medicineIssue,
                pagination: [],
              },
              success: true,
              error: "",
              message: "Tạo mới phiếu bán thuốc thành công!",
            });
          })
          .catch((err) => {
            res.status(200).json({
              success: false,
              error: err.message,
              message: "Xảy ra lỗi khi tạo mới phiếu bán thuốc!",
            });
          });
      }
    });
  } else {
    if (medicineIssue) {
      res.status(200).json({
        success: false,
        error: "Phiếu bán thuốc đã tồn tại!",
        message: "Phiếu bán thuốc đã tồn tại!",
      });
    } else {
      MedicineIssue.create({
        id: medicineIssueId,
        medicineIssueCode,
        customerId,
        userId,
        paymentMethodId,
        debit,
        description,
        healthFacilityId,
        warehouseId,
        status,
      })
        .then((medicineIssue) => {
          MedicineIssueMedicine.bulkCreate(MedicineIssueMedicineCreate);
          for (
            let index = 0;
            index < MedicineIssueMedicineCreate.length;
            index++
          ) {
            WarehouseMedicine.findOne({
              where: {
                [Op.and]: [
                  {
                    medicineId: MedicineIssueMedicineCreate[index].medicineId,
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
                    MedicineIssueMedicineCreate[index].amount *
                      (warehouse.exchange /
                        MedicineIssueMedicineCreate[index].exchange),
                },
                {
                  where: {
                    [Op.and]: [
                      {
                        medicineId:
                          MedicineIssueMedicineCreate[index].medicineId,
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
              list: medicineIssue,
              pagination: [],
            },
            success: true,
            error: "",
            message: "Tạo mới phiếu bán thuốc thành công!",
          });
        })
        .catch((err) => {
          res.status(200).json({
            success: false,
            error: err.message,
            message: "Xảy ra lỗi khi tạo mới phiếu bán thuốc!",
          });
        });
    }
  }
};

const updateRecord = async (req, res) => {
  const { id } = req.params;
  const {
    medicineIssueCode,
    medicineIssueCodeOld,
    customerId,
    userId,
    paymentMethodId,
    debit,
    description,
    warehouseId,
    healthFacilityId,
    status,
  } = req.body;
  const medicineIssue = await MedicineIssue.findOne({
    where: {
      [Op.and]: [
        { medicineIssueCode: medicineIssueCode },
        { healthFacilityId: healthFacilityId },
      ],
    },
  });
  if (medicineIssue && medicineIssueCodeOld !== medicineIssueCode) {
    res.status(200).json({
      success: false,
      error: "Phiếu bán thuốc đã tồn tại!",
      message: "Phiếu bán thuốc đã tồn tại!",
    });
  } else {
    MedicineIssue.update(
      {
        status: status,
        description: description,
        medicineIssueCode: medicineIssueCode,
        userId: userId,
        healthFacilityId: healthFacilityId,
        customerId: customerId,
        paymentMethodId: paymentMethodId,
        debit: debit,
        warehouseId: warehouseId,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((medicineIssue) => {
        res.status(200).json({
          results: {
            list: medicineIssue,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Cập nhật phiếu bán thuốc thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi cập nhật phiếu bán thuốc!",
        });
      });
  }
};
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  MedicineIssue.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((medicineIssue) => {
      res.status(200).json({
        results: {
          list: medicineIssue,
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
  MedicineIssue.destroy({
    where: {
      id: id,
    },
  })
    .then((medicineIssue) => {
      res.status(200).json({
        results: {
          list: medicineIssue,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa phiếu bán thuốc thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa phiếu bán thuốc!",
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
