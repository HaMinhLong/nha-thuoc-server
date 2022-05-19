const db = require("../models");
const ClinicService = db.clinicService;
const ClinicServicePackage = db.clinicServicePackage;
const User = db.user;

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
        "clinicServiceName",
        "clinicServicePackageId",
        "price",
        "description",
        "userId",
        "healthFacilityId",
        "time",
        "status",
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status || "";
  const clinicServiceName = filters.clinicServiceName || "";
  const clinicServicePackageId = filters.clinicServicePackageId || "";
  const userId = filters.userId || "";
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
          clinicServiceName: {
            [Op.like]: "%" + clinicServiceName + "%",
          },
        },
        {
          clinicServicePackageId: {
            [Op.like]: "%" + clinicServicePackageId + "%",
          },
        },
        { userId: { [Op.like]: "%" + userId + "%" } },
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
        model: ClinicServicePackage,
        required: true,
        attributes: ["id", "clinicServicePackageName"],
      },
      {
        model: User,
        required: true,
        attributes: ["id", "fullName"],
      },
    ],
  };

  ClinicService.findAndCountAll(options)
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
  ClinicService.findOne({
    where: {
      id: id,
    },
  })
    .then((clinicService) => {
      res.status(200).json({
        results: {
          list: clinicService,
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
        message: "Xảy ra lỗi khi lấy thông tin dịch vụ!",
      });
    });
};

const create = async (req, res) => {
  const {
    id,
    clinicServiceName,
    price,
    time,
    description,
    clinicServicePackageId,
    userId,
    healthFacilityId,
    status,
  } = req.body;
  const clinicService = await ClinicService.findOne({
    where: {
      [Op.and]: [
        { clinicServiceName: clinicServiceName },
        { healthFacilityId: healthFacilityId },
      ],
    },
  });

  if (clinicService) {
    res.status(200).json({
      success: false,
      error: "Dịch vụ đã tồn tại!",
      message: "Dịch vụ đã tồn tại!",
    });
  } else {
    ClinicService.create({
      id:
        id ||
        Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
      clinicServiceName,
      price,
      time,
      description,
      clinicServicePackageId,
      userId,
      healthFacilityId,
      status,
    })
      .then((clinicService) => {
        res.status(200).json({
          results: {
            list: clinicService,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Tạo mới dịch vụ thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi tạo mới dịch vụ!",
        });
      });
  }
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const {
    clinicServiceName,
    clinicServiceNameOld,
    price,
    time,
    description,
    clinicServicePackageId,
    userId,
    healthFacilityId,
    status,
  } = req.body;
  const clinicService = await ClinicService.findOne({
    where: {
      [Op.and]: [
        { clinicServiceName: clinicServiceName },
        { healthFacilityId: healthFacilityId },
      ],
    },
  });
  if (clinicService && clinicServiceNameOld !== clinicServiceName) {
    res.status(200).json({
      success: false,
      error: "Dịch vụ đã tồn tại!",
      message: "Dịch vụ đã tồn tại!",
    });
  } else {
    ClinicService.update(
      {
        status: status,
        clinicServiceName: clinicServiceName,
        price: price,
        time: time,
        description: description,
        clinicServicePackageId: clinicServicePackageId,
        userId: userId,
        healthFacilityId: healthFacilityId,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((clinicService) => {
        res.status(200).json({
          results: {
            list: clinicService,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Cập nhật dịch vụ thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi cập nhật dịch vụ!",
        });
      });
  }
};
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  ClinicService.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((clinicService) => {
      res.status(200).json({
        results: {
          list: clinicService,
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
  ClinicService.destroy({
    where: {
      id: id,
    },
  })
    .then((clinicService) => {
      res.status(200).json({
        results: {
          list: clinicService,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa dịch vụ thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa dịch vụ!",
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
