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
        message: "X???y ra l???i khi l???y danh s??ch!",
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
        message: "X???y ra l???i khi l???y th??ng tin g??i d???ch v???!",
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
      error: "G??i d???ch v??? ???? t???n t???i!",
      message: "G??i d???ch v??? ???? t???n t???i!",
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
          message: "T???o m???i g??i d???ch v??? th??nh c??ng!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "X???y ra l???i khi t???o m???i g??i d???ch v???!",
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
      error: "G??i d???ch v??? ???? t???n t???i!",
      message: "G??i d???ch v??? ???? t???n t???i!",
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
          message: "C???p nh???t g??i d???ch v??? th??nh c??ng!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "X???y ra l???i khi c???p nh???t g??i d???ch v???!",
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
        message: "X??a g??i d???ch v??? th??nh c??ng!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "X???y ra l??i khi x??a g??i d???ch v???!",
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
