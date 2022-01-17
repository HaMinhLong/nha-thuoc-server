const db = require("../models");
const Receipt = db.receipt;
const Supplier = db.supplier;
const Medicine = db.medicine;
const ReceiptMedicine = db.receiptMedicine;
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
        "receiptCode",
        "shipperName",
        "userId",
        "paymentMethodId",
        "warehouseId",
        "supplierId",
        "debit",
        "description",
        "healthFacilityId",
        "status",
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status || "";
  const receiptCode = filters.receiptCode || "";
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
          receiptCode: {
            [Op.like]: "%" + receiptCode + "%",
          },
        },
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
        model: Supplier,
        required: true,
        attributes: ["id", "supplierName"],
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

  Receipt.findAndCountAll(options)
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
    where: {
      id: id,
    },
    include: [
      {
        model: Medicine,
        required: true,
        through: {
          where: {
            receiptId: { [Op.like]: "%" + id + "%" },
          },
        },
      },
    ],
  })
    .then((receipt) => {
      res.status(200).json({
        results: {
          list: receipt,
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
        message: "Xảy ra lỗi khi lấy thông tin phiếu nhập thuốc!",
      });
    });
};

const create = async (req, res) => {
  const {
    id,
    receiptCode,
    shipperName,
    userId,
    paymentMethodId,
    warehouseId,
    supplierId,
    debit,
    description,
    healthFacilityId,
    status,
    medicines,
  } = req.body;
  const receiptId =
    id ||
    Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) + 100000000000;
  const receipt = await Receipt.findOne({
    where: {
      [Op.and]: [
        { receiptCode: receiptCode },
        { healthFacilityId: healthFacilityId },
      ],
    },
  });

  if (receipt) {
    res.status(200).json({
      success: false,
      error: "Phiếu nhập thuốc đã tồn tại!",
      message: "Phiếu nhập thuốc đã tồn tại!",
    });
  } else {
    const receiptMedicineAdd = medicines?.filter((item) => item.flag < 0);
    const receiptMedicineCreate = receiptMedicineAdd?.map((item) => {
      return {
        id:
          Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
        barcode: item.receiptMedicines.barcode,
        lotNumber: item.receiptMedicines.lotNumber,
        dateOfManufacture: item.receiptMedicines.dateOfManufacture,
        expiry: item.receiptMedicines.expiry,
        price: item.receiptMedicines.price,
        amount: item.receiptMedicines.amount,
        discount: item.receiptMedicines.discount,
        discountType: item.receiptMedicines.discountType,
        tax: item.receiptMedicines.tax,
        taxType: item.receiptMedicines.taxType,
        unitId: item.receiptMedicines.unitId,
        total: item.receiptMedicines.total,
        medicineId: item.id,
        receiptId: receiptId,
      };
    });
    const warehouseMedicineCreate = receiptMedicineAdd?.map((item) => {
      return {
        id:
          Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
        exchange: Number(
          item.medicineUnits.find(
            (it) => it.unitId === item.receiptMedicines.unitId
          ).amount
        ),
        inStock: Number(item.receiptMedicines.amount),
        medicineId: item.id,
        unitId: item.receiptMedicines.unitId,
        warehouseId: warehouseId,
      };
    });
    console.log("warehouseMedicineCreate", warehouseMedicineCreate);
    Receipt.create({
      id: receiptId,
      receiptCode,
      shipperName,
      userId,
      paymentMethodId,
      warehouseId,
      supplierId,
      debit,
      description,
      healthFacilityId,
      status,
    })
      .then((receipt) => {
        ReceiptMedicine.bulkCreate(receiptMedicineCreate);
        WarehouseMedicine.bulkCreate(warehouseMedicineCreate)
          .then((warehouseMedicine) => {})
          .catch((err) => {
            console.log("err", err);
          });
        res.status(200).json({
          results: {
            list: receipt,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Tạo mới phiếu nhập thuốc thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi tạo mới phiếu nhập thuốc!",
        });
      });
  }
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const {
    receiptCode,
    receiptCodeOld,
    shipperName,
    userId,
    paymentMethodId,
    warehouseId,
    supplierId,
    debit,
    description,
    healthFacilityId,
    status,
    medicines,
  } = req.body;
  const receipt = await Receipt.findOne({
    where: {
      [Op.and]: [
        { receiptCode: receiptCode },
        { healthFacilityId: healthFacilityId },
      ],
    },
  });
  if (receipt && receiptCodeOld !== receiptCode) {
    res.status(200).json({
      success: false,
      error: "Phiếu nhập thuốc đã tồn tại!",
      message: "Phiếu nhập thuốc đã tồn tại!",
    });
  } else {
    const receiptMedicineUpdate = medicines?.filter((item) => item.flag > 0);
    const receiptMedicineAdd = medicines?.filter((item) => item.flag < 0);
    const receiptMedicineCreate = receiptMedicineAdd?.map((item) => {
      return {
        id:
          Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
        barcode: item.receiptMedicines.barcode,
        lotNumber: item.receiptMedicines.lotNumber,
        dateOfManufacture: item.receiptMedicines.dateOfManufacture,
        expiry: item.receiptMedicines.expiry,
        price: item.receiptMedicines.price,
        amount: item.receiptMedicines.amount,
        discount: item.receiptMedicines.discount,
        discountType: item.receiptMedicines.discountType,
        tax: item.receiptMedicines.tax,
        taxType: item.receiptMedicines.taxType,
        unitId: item.receiptMedicines.unitId,
        total: item.receiptMedicines.total,
        medicineId: item.id,
        receiptId: id,
      };
    });
    Receipt.update(
      {
        status: status,
        description: description,
        receiptCode: receiptCode,
        userId: userId,
        healthFacilityId: healthFacilityId,
        shipperName: shipperName,
        paymentMethodId: paymentMethodId,
        warehouseId: warehouseId,
        supplierId: supplierId,
        debit: debit,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((receipt) => {
        ReceiptMedicine.bulkCreate(receiptMedicineCreate);
        for (let index = 0; index < receiptMedicineUpdate.length; index++) {
          ReceiptMedicine.update(
            {
              barcode: receiptMedicineUpdate[index].receiptMedicines.barcode,
              lotNumber:
                receiptMedicineUpdate[index].receiptMedicines.lotNumber,
              dateOfManufacture:
                receiptMedicineUpdate[index].receiptMedicines.dateOfManufacture,
              expiry: receiptMedicineUpdate[index].receiptMedicines.expiry,
              price: receiptMedicineUpdate[index].receiptMedicines.price,
              amount: receiptMedicineUpdate[index].receiptMedicines.amount,
              discount: receiptMedicineUpdate[index].receiptMedicines.discount,
              discountType:
                receiptMedicineUpdate[index].receiptMedicines.discountType,
              tax: receiptMedicineUpdate[index].receiptMedicines.tax,
              taxType: receiptMedicineUpdate[index].receiptMedicines.taxType,
              unitId: receiptMedicineUpdate[index].receiptMedicines.unitId,
              total: receiptMedicineUpdate[index].receiptMedicines.total,
              medicineId: receiptMedicineUpdate[index].id,
              receiptId: id,
            },
            {
              where: {
                id: receiptMedicineUpdate[index].receiptMedicines.id,
              },
            }
          );
        }
        res.status(200).json({
          results: {
            list: receipt,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Cập nhật phiếu nhập thuốc thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi cập nhật phiếu nhập thuốc!",
        });
      });
  }
};
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  Receipt.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((receipt) => {
      res.status(200).json({
        results: {
          list: receipt,
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
  Receipt.destroy({
    where: {
      id: id,
    },
  })
    .then((receipt) => {
      res.status(200).json({
        results: {
          list: receipt,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa phiếu nhập thuốc thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa phiếu nhập thuốc!",
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
