const db = require("../models");
const ClinicResult = db.clinicResult;
const MedicalRegister = db.medicalRegister;
const User = db.user;
const Customer = db.customer;
const ClinicService = db.clinicService;
const ClinicServicePackage = db.clinicServicePackage;
const ClinicType = db.clinicType;
const moment = require("moment");

const Op = db.Sequelize.Op;

const getList = async (req, res) => {
  const { filter, range, sort, attributes } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const ranges = range ? JSON.parse(range) : [0, 20];
  const order = sort ? JSON.parse(sort) : ["createdAt", "DESC"];
  const attributesQuery = attributes
    ? attributes.split(",")
    : ["id", "description", "medicalRegisterId", "createdAt", "updatedAt"];
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
            model: ClinicService,
            required: true,
            attributes: ["id", "clinicServiceName", "price"],
            include: [
              {
                model: ClinicServicePackage,
                required: true,
                attributes: ["id", "clinicServicePackageName", "printFormId"],
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
          {
            model: User,
            required: true,
            attributes: ["id", "fullName"],
          },
          {
            model: Customer,
            required: true,
            attributes: [
              "id",
              "customerName",
              "mobile",
              "dateOfBirth",
              "address",
            ],
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

  ClinicResult.findAndCountAll(options)
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
  ClinicResult.findOne({
    where: {
      id: id,
    },
  })
    .then((clinicResult) => {
      res.status(200).json({
        results: {
          list: clinicResult,
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
        message: "Xảy ra lỗi khi lấy thông tin kết quả khám!",
      });
    });
};

const create = async (req, res) => {
  const { id, description, medicalRegisterId } = req.body;

  ClinicResult.create({
    id:
      id ||
      Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
        100000000000,
    description,
    medicalRegisterId,
  })
    .then((clinicResult) => {
      MedicalRegister.update(
        { status: 3 },
        {
          where: {
            id: medicalRegisterId,
          },
        }
      );
      res.status(200).json({
        results: {
          list: clinicResult,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Tạo mới kết quả khám thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi tạo mới kết quả khám!",
      });
    });
};

const updateRecord = async (req, res) => {
  const { id } = req.params;
  const { medicalRegisterId, description } = req.body;

  ClinicResult.update(
    {
      description: description,
      medicalRegisterId: medicalRegisterId,
    },
    {
      where: {
        id: id,
      },
    }
  )
    .then((clinicResult) => {
      MedicalRegister.update(
        { status: 3 },
        {
          where: {
            id: medicalRegisterId,
          },
        }
      );
      res.status(200).json({
        results: {
          list: clinicResult,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Cập nhật kết quả khám thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi cập nhật kết quả khám!",
      });
    });
};

const deleteRecord = async (req, res) => {
  const { id } = req.params;
  ClinicResult.destroy({
    where: {
      id: id,
    },
  })
    .then((clinicResult) => {
      res.status(200).json({
        results: {
          list: clinicResult,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa kết quả khám thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa kết quả khám!",
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
