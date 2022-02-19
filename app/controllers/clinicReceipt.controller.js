const db = require("../models");
const ClinicReceipt = db.clinicReceipt;
const Customer = db.customer;
const ClinicReceiptService = db.clinicReceiptService;
const ClinicServicePackage = db.clinicServicePackage;
const ClinicService = db.clinicService;
const ClinicType = db.clinicType;
const MedicalRegister = db.medicalRegister;

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
        "clinicReceiptCode",
        "customerId",
        "paymentMethodId",
        "description",
        "debit",
        "total",
        "paid",
        "customerBrought",
        "giveBack",
        "payLater",
        "healthFacilityId",
        "medicalRegisterId",
        "status",
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status || "";
  const clinicReceiptCode = filters.clinicReceiptCode || "";
  const mobile = filters.mobile || "";
  const customerName = filters.customerName || "";
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
          clinicReceiptCode: {
            [Op.like]: "%" + clinicReceiptCode + "%",
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
        model: Customer,
        required: true,
        attributes: ["id", "customerName", "mobile", "dateOfBirth"],
        where: {
          [Op.and]: [
            {
              mobile: { [Op.like]: "%" + mobile + "%" },
            },
            {
              customerName: { [Op.like]: "%" + customerName + "%" },
            },
          ],
        },
      },
    ],
  };

  ClinicReceipt.findAndCountAll(options)
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
  ClinicReceipt.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: Customer,
        required: true,
        attributes: ["id", "customerName", "mobile", "dateOfBirth"],
      },
      {
        model: ClinicService,
        required: true,
        through: {
          where: {
            clinicReceiptId: { [Op.like]: "%" + id + "%" },
          },
        },
        include: [
          {
            model: ClinicServicePackage,
            required: true,
            attributes: ["id", "clinicServicePackageName"],
            include: [
              {
                model: ClinicType,
                required: true,
                attributes: ["id", "clinicTypeName"],
              },
            ],
          },
        ],
      },
    ],
  })
    .then((clinicReceipt) => {
      res.status(200).json({
        results: {
          list: clinicReceipt,
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
        message: "Xảy ra lỗi khi lấy thông tin phiếu thu dịch vụ!",
      });
    });
};

const create = async (req, res) => {
  const {
    id,
    clinicReceiptCode,
    customerId,
    paymentMethodId,
    description,
    debit,
    total,
    paid,
    customerBrought,
    giveBack,
    payLater,
    healthFacilityId,
    medicalRegisterId,
    status,
    clinicReceiptServices,
    exitsCustomer,
    customerName,
    mobile,
    address,
  } = req.body;

  const clinicReceipt = await ClinicReceipt.findOne({
    where: {
      [Op.and]: [
        { clinicReceiptCode: clinicReceiptCode },
        { healthFacilityId: healthFacilityId },
      ],
    },
  });

  if (clinicReceipt) {
    res.status(200).json({
      success: false,
      error: "Phiếu thu dịch vụ đã tồn tại!",
      message: "Phiếu thu dịch vụ đã tồn tại!",
    });
  } else {
    const clinicReceiptID =
      Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
      100000000000;
    const medicalRegisterID =
      Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
      100000000000;
    const customerID =
      Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
      100000000000;

    const clinicReceiptServiceAdd = clinicReceiptServices?.filter(
      (item) => item.flag < 0
    );

    const clinicReceiptServiceCreate = clinicReceiptServiceAdd?.map((item) => {
      return {
        id:
          Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
        amount: item.amount,
        price: item.price,
        discount: item.discount,
        discountType: item.discountType,
        tax: item.tax,
        taxType: item.taxType,
        total: item.total,
        clinicReceiptId: clinicReceiptID,
        clinicServiceId: item.clinicServiceId,
        userId: item.userId,
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
        address: address,
        customerGroupId: 58458965475,
        healthFacilityId,
        status: 1,
      })
        .then((customer) => {
          MedicalRegister.create({
            id: medicalRegisterID,
            clinicServiceId: clinicReceiptServiceCreate[0]?.clinicServiceId,
            date: moment(),
            clinicTimeId: null,
            customerId: customerID,
            contactChannel: 1,
            userId: clinicReceiptServiceCreate[0]?.userId,
            description: "",
            healthFacilityId: healthFacilityId,
            status: 1,
          })
            .then((medicineRegister) => {
              ClinicReceipt.create({
                id: id || clinicReceiptID,
                clinicReceiptCode,
                customerId: customerID,
                paymentMethodId,
                description,
                debit,
                total,
                paid,
                customerBrought,
                giveBack,
                payLater,
                healthFacilityId,
                medicalRegisterId: medicalRegisterID,
                status,
              })
                .then((clinicReceipt) => {
                  ClinicReceiptService.bulkCreate(clinicReceiptServiceCreate);
                  res.status(200).json({
                    results: {
                      list: clinicReceipt,
                      pagination: [],
                    },
                    success: true,
                    error: "",
                    message: "Tạo mới phiếu thu dịch vụ thành công!",
                  });
                })
                .catch((err) => {
                  res.status(200).json({
                    success: false,
                    error: err.message,
                    message: "Xảy ra lỗi khi tạo mới phiếu thu dịch vụ!",
                  });
                });
            })
            .catch((err) => {
              res.status(200).json({
                success: false,
                error: err.message,
                message: "Xảy ra lỗi khi tạo mới phiếu đăng ký khám!",
              });
            });
        })
        .catch((err) => {
          res.status(200).json({
            success: false,
            error: err.message,
            message: "Xảy ra lỗi khi tạo mới phiếu bán thuốc!",
          });
        });
    } else {
      MedicalRegister.create({
        id: medicalRegisterID,
        clinicServiceId: clinicReceiptServiceCreate[0]?.clinicServiceId,
        date: moment(),
        clinicTimeId: null,
        customerId: customerId,
        contactChannel: 1,
        userId: clinicReceiptServiceCreate[0]?.userId,
        description: "",
        healthFacilityId: healthFacilityId,
        status: 1,
      })
        .then((medicineRegister) => {
          ClinicReceipt.create({
            id: id || clinicReceiptID,
            clinicReceiptCode,
            customerId,
            paymentMethodId,
            description,
            debit,
            total,
            paid,
            customerBrought,
            giveBack,
            payLater,
            healthFacilityId,
            medicalRegisterId: medicalRegisterID,
            status,
          })
            .then((clinicReceipt) => {
              ClinicReceiptService.bulkCreate(clinicReceiptServiceCreate);
              res.status(200).json({
                results: {
                  list: clinicReceipt,
                  pagination: [],
                },
                success: true,
                error: "",
                message: "Tạo mới phiếu thu dịch vụ thành công!",
              });
            })
            .catch((err) => {
              res.status(200).json({
                success: false,
                error: err.message,
                message: "Xảy ra lỗi khi tạo mới phiếu thu dịch vụ!",
              });
            });
        })
        .catch((err) => {
          res.status(200).json({
            success: false,
            error: err.message,
            message: "Xảy ra lỗi khi tạo mới phiếu đăng ký khám!",
          });
        });
    }
  }
};

const updateRecord = async (req, res) => {
  const { id } = req.params;
  const {
    clinicReceiptCode,
    customerId,
    paymentMethodId,
    description,
    debit,
    total,
    paid,
    customerBrought,
    giveBack,
    payLater,
    healthFacilityId,
    medicalRegisterId,
    status,
    clinicReceiptServices,
  } = req.body;

  const clinicReceiptServiceUpdate = clinicReceiptServices?.filter(
    (item) => item.flag > 0
  );
  const clinicReceiptServiceAdd = clinicReceiptServices?.filter(
    (item) => item.flag < 0
  );

  const clinicReceiptServiceCreate = clinicReceiptServiceAdd?.map((item) => {
    return {
      id:
        Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
        100000000000,
      amount: item.amount,
      price: item.price,
      discount: item.discount,
      discountType: item.discountType,
      tax: item.tax,
      taxType: item.taxType,
      total: item.total,
      clinicReceiptId: id,
      clinicServiceId: item.clinicServiceId,
      userId: item.userId,
    };
  });

  ClinicReceipt.update(
    {
      clinicReceiptCode: clinicReceiptCode,
      customerId: customerId,
      paymentMethodId: paymentMethodId,
      description: description,
      debit: debit,
      total: total,
      paid: paid,
      customerBrought: customerBrought,
      giveBack: giveBack,
      payLater: payLater,
      healthFacilityId: healthFacilityId,
      medicalRegisterId: medicalRegisterId,
      status: status,
    },
    {
      where: {
        id: id,
      },
    }
  )
    .then((clinicReceipt) => {
      ClinicReceiptService.bulkCreate(clinicReceiptServiceCreate);
      for (let index = 0; index < clinicReceiptServiceUpdate.length; index++) {
        ClinicReceiptService.update(
          {
            amount: clinicReceiptServiceUpdate[index].amount,
            price: clinicReceiptServiceUpdate[index].price,
            discount: clinicReceiptServiceUpdate[index].discount,
            discountType: clinicReceiptServiceUpdate[index].discountType,
            tax: clinicReceiptServiceUpdate[index].tax,
            taxType: clinicReceiptServiceUpdate[index].taxType,
            total: clinicReceiptServiceUpdate[index].total,
            clinicServiceId: clinicReceiptServiceUpdate[index].clinicServiceId,
            userId: clinicReceiptServiceUpdate[index].userId,
          },
          {
            where: {
              id: clinicReceiptServiceUpdate[index].id,
            },
          }
        );
      }
      res.status(200).json({
        results: {
          list: clinicReceipt,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Cập nhật phiếu thu dịch vụ thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi cập nhật phiếu thu dịch vụ!",
      });
    });
};
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  ClinicReceipt.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((clinicReceipt) => {
      res.status(200).json({
        results: {
          list: clinicReceipt,
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
  ClinicReceipt.destroy({
    where: {
      id: id,
    },
  })
    .then((clinicReceipt) => {
      res.status(200).json({
        results: {
          list: clinicReceipt,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa phiếu thu dịch vụ thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa phiếu thu dịch vụ!",
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
