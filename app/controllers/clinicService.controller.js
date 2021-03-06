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
        message: "X???y ra l???i khi l???y danh s??ch!",
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
        message: "X???y ra l???i khi l???y th??ng tin d???ch v???!",
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
      error: "D???ch v??? ???? t???n t???i!",
      message: "D???ch v??? ???? t???n t???i!",
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
          message: "T???o m???i d???ch v??? th??nh c??ng!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "X???y ra l???i khi t???o m???i d???ch v???!",
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
      error: "D???ch v??? ???? t???n t???i!",
      message: "D???ch v??? ???? t???n t???i!",
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
          message: "C???p nh???t d???ch v??? th??nh c??ng!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "X???y ra l???i khi c???p nh???t d???ch v???!",
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
        message: "C???p nh???t tr???ng th??i th??nh c??ng!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        error: err.message,
        message: "X???y ra l???i khi c???p nh???t tr???ng th??i",
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
        message: "X??a d???ch v??? th??nh c??ng!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "X???y ra l??i khi x??a d???ch v???!",
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
