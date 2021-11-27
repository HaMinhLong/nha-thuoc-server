const db = require("../models");
const HealthFacility = db.healthFacility;
const Province = db.province;
const District = db.district;
const Ward = db.ward;
const medicalFacilityGroup = db.medicalFacilityGroup;

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
        "healthFacilityName",
        "healthFacilityCode",
        "email",
        "mobile",
        "taxCode",
        "representativeName",
        "representativeMobile",
        "medicalFacilityGroupId",
        "provinceId",
        "districtId",
        "wardId",
        "address",
        "status",
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status || "";
  const healthFacilityName = filters.healthFacilityName || "";
  const healthFacilityCode = filters.healthFacilityCode || "";
  const mobile = filters.mobile || "";
  const provinceId = filters.provinceId || "";
  const districtId = filters.districtId || "";
  const wardId = filters.wardId || "";
  const medicalFacilityGroupId = filters.medicalFacilityGroupId || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        { status: { [Op.like]: "%" + status + "%" } },
        { healthFacilityName: { [Op.like]: "%" + healthFacilityName + "%" } },
        { healthFacilityCode: { [Op.like]: "%" + healthFacilityCode + "%" } },
        { mobile: { [Op.like]: "%" + mobile + "%" } },
        { provinceId: { [Op.like]: "%" + provinceId + "%" } },
        { districtId: { [Op.like]: "%" + districtId + "%" } },
        { wardId: { [Op.like]: "%" + wardId + "%" } },
        {
          medicalFacilityGroupId: {
            [Op.like]: "%" + medicalFacilityGroupId + "%",
          },
        },
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
        model: Province,
        required: true,
        attributes: ["id", "provinceName"],
      },
      {
        model: District,
        required: true,
        attributes: ["id", "districtName"],
      },
      {
        model: Ward,
        required: true,
        attributes: ["id", "wardName"],
      },
      {
        model: medicalFacilityGroup,
        required: true,
        attributes: ["id", "medicalFacilityGroupName"],
      },
    ],
  };

  HealthFacility.findAndCountAll(options)
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
  HealthFacility.findOne({
    where: {
      id: id,
    },
  })
    .then((healthFacility) => {
      res.status(200).json({
        results: {
          list: healthFacility,
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
        message: "Xảy ra lỗi khi lấy thông tin cơ sở y tế!",
      });
    });
};

const create = async (req, res) => {
  const {
    id,
    healthFacilityName,
    healthFacilityCode,
    taxCode,
    representativeName,
    representativeMobile,
    medicalFacilityGroupId,
    email,
    mobile,
    provinceId,
    districtId,
    wardId,
    address,
    status,
  } = req.body;
  const healthFacility = await HealthFacility.findOne({
    where: { healthFacilityName: healthFacilityName },
  });

  if (healthFacility) {
    res.status(200).json({
      success: false,
      error: "Cơ sở y tế đã tồn tại!",
      message: "Cơ sở y tế đã tồn tại!",
    });
  } else {
    HealthFacility.create({
      id:
        id ||
        Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
      healthFacilityName,
      healthFacilityCode,
      taxCode,
      representativeName,
      representativeMobile,
      medicalFacilityGroupId,
      email,
      mobile,
      provinceId,
      districtId,
      wardId,
      address,
      status,
    })
      .then((healthFacility) => {
        res.status(200).json({
          results: {
            list: healthFacility,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Tạo mới cơ sở y tế thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi tạo mới cơ sở y tế!",
        });
      });
  }
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const {
    healthFacilityName,
    healthFacilityNameOld,
    healthFacilityCode,
    taxCode,
    representativeName,
    representativeMobile,
    medicalFacilityGroupId,
    email,
    mobile,
    provinceId,
    districtId,
    wardId,
    address,
    status,
  } = req.body;
  const healthFacility = await HealthFacility.findOne({
    where: { healthFacilityName: healthFacilityName },
  });
  if (healthFacility && healthFacilityNameOld !== healthFacilityName) {
    res.status(200).json({
      success: false,
      error: "Cơ sở y tế đã tồn tại!",
      message: "Cơ sở y tế đã tồn tại!",
    });
  } else {
    HealthFacility.update(
      {
        healthFacilityName: healthFacilityName,
        healthFacilityCode: healthFacilityCode,
        taxCode: taxCode,
        representativeName: representativeName,
        representativeMobile: representativeMobile,
        medicalFacilityGroupId: medicalFacilityGroupId,
        email: email,
        mobile: mobile,
        provinceId: provinceId,
        districtId: districtId,
        wardId: wardId,
        address: address,
        status: status,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((healthFacility) => {
        res.status(200).json({
          results: {
            list: healthFacility,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Cập nhật cơ sở y tế thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi cập nhật cơ sở y tế!",
        });
      });
  }
};
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  HealthFacility.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((healthFacility) => {
      res.status(200).json({
        results: {
          list: healthFacility,
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
  HealthFacility.destroy({
    where: {
      id: id,
    },
  })
    .then((healthFacility) => {
      res.status(200).json({
        results: {
          list: healthFacility,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa cơ sở y tế thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa cơ sở y tế!",
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
