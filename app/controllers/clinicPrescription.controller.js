const db = require("../models");
const ClinicPrescription = db.clinicPrescription;
const MedicalRegister = db.medicalRegister;
const User = db.user;
const Customer = db.customer;
const ClinicPreMedicine = db.clinicPreMedicine;
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
    : [
        "id",
        "description",
        "sick",
        "customerId",
        "userId",
        "medicalRegisterId",
        "createdAt",
        "updatedAt",
      ];
  const customerName = filters.customerName || "";
  const healthFacilityId = filters.healthFacilityId || "";
  const mobile = filters.mobile || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
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
        model: MedicalRegister,
        required: true,
        attributes: ["id", "date"],
        where: {
          healthFacilityId: { [Op.like]: "%" + healthFacilityId + "%" },
        },
        include: [
          {
            model: User,
            required: true,
            attributes: ["id", "fullName"],
          },
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
      },
    ],
  };

  ClinicPrescription.findAndCountAll(options)
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
  ClinicPrescription.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: Medicine,
        required: true,
        attributes: ["id", "medicineName"],
        through: {
          where: {
            clinicPrescriptionId: { [Op.like]: "%" + id + "%" },
          },
        },
        include: [
          {
            model: Unit,
            attributes: ["id", "unitName"],
          },
        ],
      },
    ],
  })
    .then((clinicPrescription) => {
      res.status(200).json({
        results: {
          list: clinicPrescription,
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
        message: "Xảy ra lỗi khi lấy thông tin kê đơn thuốc!",
      });
    });
};

const create = async (req, res) => {
  const {
    id,
    description,
    sick,
    customerId,
    userId,
    clinicPreMedicines,
    medicalRegisterId,
  } = req.body;

  const clinicPrescriptionID =
    Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) + 100000000000;

  ClinicPrescription.create({
    id: id || clinicPrescriptionID,
    description,
    sick,
    customerId,
    userId,
    medicalRegisterId,
  })
    .then((clinicPrescription) => {
      const clinicPreMedicineAdd = clinicPreMedicines?.filter(
        (item) => item.flag < 0
      );
      const clinicPreMedicineCreate = clinicPreMedicineAdd?.map((item) => {
        return {
          id:
            Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
            100000000000,
          amount: item.amount,
          unitId: item.unitId,
          clinicPrescriptionId: clinicPrescriptionID,
          medicineId: item.medicineId,
        };
      });

      ClinicPreMedicine.bulkCreate(clinicPreMedicineCreate);

      res.status(200).json({
        results: {
          list: clinicPrescription,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Tạo mới kê đơn thuốc thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi tạo mới kê đơn thuốc!",
      });
    });
};

const updateRecord = async (req, res) => {
  const { id } = req.params;
  const {
    medicalRegisterId,
    description,
    sick,
    customerId,
    userId,
    clinicPreMedicines,
  } = req.body;

  ClinicPrescription.update(
    {
      description: description,
      sick: sick,
      customerId: customerId,
      userId: userId,
      medicalRegisterId: medicalRegisterId,
    },
    {
      where: {
        id: id,
      },
    }
  )
    .then((clinicPrescription) => {
      const clinicPreMedicineUpdate = clinicPreMedicines?.filter(
        (item) => item.flag > 0
      );
      const clinicPreMedicineAdd = clinicPreMedicines?.filter(
        (item) => item.flag < 0
      );

      const clinicPreMedicineCreate = clinicPreMedicineAdd?.map((item) => {
        return {
          id:
            Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
            100000000000,
          amount: item.amount,
          unitId: item.unitId,
          clinicPrescriptionId: id,
          medicineId: item.medicineId,
        };
      });

      ClinicPreMedicine.bulkCreate(clinicPreMedicineCreate);

      for (let index = 0; index < clinicPreMedicineUpdate.length; index++) {
        ClinicReceiptService.update(
          {
            amount: clinicPreMedicineUpdate[index].amount,
            unitId: clinicPreMedicineUpdate[index].unitId,
            clinicPrescriptionId: id,
            medicineId: clinicPreMedicineUpdate[index].medicineId,
          },
          {
            where: {
              id: clinicPreMedicineUpdate[index].id,
            },
          }
        );
      }
      res.status(200).json({
        results: {
          list: clinicPrescription,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Cập nhật kê đơn thuốc thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi cập nhật kê đơn thuốc!",
      });
    });
};

const deleteRecord = async (req, res) => {
  const { id } = req.params;
  ClinicPrescription.destroy({
    where: {
      id: id,
    },
  })
    .then((clinicPrescription) => {
      res.status(200).json({
        results: {
          list: clinicPrescription,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa kê đơn thuốc thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa kê đơn thuốc!",
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
