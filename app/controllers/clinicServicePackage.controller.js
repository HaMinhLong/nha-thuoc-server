const db = require("../models");
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
    : [
        "id",
        "clinicServicePackageName",
        "clinicTypeId",
        "healthFacilityId",
        "printFormId",
        "sampleResults",
        "status",
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status || "";
  const clinicServicePackageName = filters.clinicServicePackageName || "";
  const clinicTypeId = filters.clinicTypeId || "";
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
          clinicServicePackageName: {
            [Op.like]: "%" + clinicServicePackageName + "%",
          },
        },
        { clinicTypeId: { [Op.like]: "%" + clinicTypeId + "%" } },
        // { healthFacilityId: { [Op.like]: "%" + healthFacilityId + "%" } },
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
        model: ClinicType,
        required: true,
        attributes: ["id", "clinicTypeName"],
      },
    ],
  };

  ClinicServicePackage.findAndCountAll(options)
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
  ClinicServicePackage.findOne({
    where: {
      id: id,
    },
  })
    .then((clinicServicePackage) => {
      res.status(200).json({
        results: {
          list: clinicServicePackage,
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
        message: "Xảy ra lỗi khi lấy thông tin gói dịch vụ!",
      });
    });
};

const create = async (req, res) => {
  const {
    id,
    clinicServicePackageName,
    sampleResults,
    clinicTypeId,
    printFormId,
    healthFacilityId,
    status,
  } = req.body;
  const clinicServicePackage = await ClinicServicePackage.findOne({
    where: {
      [Op.and]: [
        { clinicServicePackageName: clinicServicePackageName },
        { healthFacilityId: healthFacilityId },
      ],
    },
  });

  if (clinicServicePackage) {
    res.status(200).json({
      success: false,
      error: "Gói dịch vụ đã tồn tại!",
      message: "Gói dịch vụ đã tồn tại!",
    });
  } else {
    ClinicServicePackage.create({
      id:
        id ||
        Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
      clinicServicePackageName,
      sampleResults,
      clinicTypeId,
      printFormId,
      healthFacilityId,
      status,
    })
      .then((clinicServicePackage) => {
        res.status(200).json({
          results: {
            list: clinicServicePackage,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Tạo mới gói dịch vụ thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi tạo mới gói dịch vụ!",
        });
      });
  }
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const {
    clinicServicePackageName,
    clinicServicePackageNameOld,
    sampleResults,
    clinicTypeId,
    printFormId,
    healthFacilityId,
    status,
  } = req.body;
  const clinicServicePackage = await ClinicServicePackage.findOne({
    where: {
      [Op.and]: [
        { clinicServicePackageName: clinicServicePackageName },
        { healthFacilityId: healthFacilityId },
      ],
    },
  });
  if (
    clinicServicePackage &&
    clinicServicePackageNameOld !== clinicServicePackageName
  ) {
    res.status(200).json({
      success: false,
      error: "Gói dịch vụ đã tồn tại!",
      message: "Gói dịch vụ đã tồn tại!",
    });
  } else {
    ClinicServicePackage.update(
      {
        status: status,
        clinicServicePackageName: clinicServicePackageName,
        sampleResults: sampleResults,
        clinicTypeId: clinicTypeId,
        printFormId: printFormId,
        healthFacilityId: healthFacilityId,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((clinicServicePackage) => {
        res.status(200).json({
          results: {
            list: clinicServicePackage,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Cập nhật gói dịch vụ thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi cập nhật gói dịch vụ!",
        });
      });
  }
};
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  ClinicServicePackage.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((clinicServicePackage) => {
      res.status(200).json({
        results: {
          list: clinicServicePackage,
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
  ClinicServicePackage.destroy({
    where: {
      id: id,
    },
  })
    .then((clinicServicePackage) => {
      res.status(200).json({
        results: {
          list: clinicServicePackage,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa gói dịch vụ thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa gói dịch vụ!",
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
