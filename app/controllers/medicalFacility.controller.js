const db = require("../models");
const MedicalFacility = db.medicalFacility;
const Province = db.province;

const moment = require("moment");

const Op = db.Sequelize.Op;

const getList = async (req, res) => {
  const { filter, range, sort, attributes } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const ranges = range ? JSON.parse(range) : [0, 20];
  const order = sort ? JSON.parse(sort) : ["createdAt", "DESC"];
  const attributesQuery = attributes
    ? attributes.split(",")
    : ["id", "medicalFacilityName", "status", "createdAt", "updatedAt"];
  const status = filters.status || "";
  const medicalFacilityName = filters.medicalFacilityName || "";
  const provinceId = filters.provinceId || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        { status: { [Op.like]: "%" + status + "%" } },
        { medicalFacilityName: { [Op.like]: "%" + medicalFacilityName + "%" } },
        { provinceId: { [Op.like]: "%" + provinceId + "%" } },
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
    ],
  };

  MedicalFacility.findAndCountAll(options)
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
  MedicalFacility.findOne({
    where: {
      id: id,
    },
  })
    .then((medicalFacility) => {
      res.status(200).json({
        results: {
          list: medicalFacility,
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
        message: "Xảy ra lỗi khi lấy thông tin cơ sở khám bệnh!",
      });
    });
};

const create = async (req, res) => {
  const {
    id,
    medicalFacilityName,
    email,
    mobile,
    provinceId,
    districtId,
    wardId,
    address,
    status,
  } = req.body;
  const medicalFacility = await MedicalFacility.findOne({
    where: { medicalFacilityName: medicalFacilityName },
  });

  if (medicalFacility) {
    res.status(200).json({
      success: false,
      error: "Cơ sở khám bệnh đã tồn tại!",
      message: "Cơ sở khám bệnh đã tồn tại!",
    });
  } else {
    MedicalFacility.create({
      id:
        id ||
        Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
      medicalFacilityName,
      email,
      mobile,
      provinceId,
      districtId,
      wardId,
      address,
      status,
    })
      .then((medicalFacility) => {
        res.status(200).json({
          results: {
            list: medicalFacility,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Tạo mới cơ sở khám bệnh thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi tạo mới cơ sở khám bệnh!",
        });
      });
  }
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const {
    medicalFacilityName,
    medicalFacilityNameOld,
    email,
    mobile,
    provinceId,
    districtId,
    wardId,
    address,
    status,
  } = req.body;
  const medicalFacility = await MedicalFacility.findOne({
    where: { medicalFacilityName: medicalFacilityName },
  });
  if (medicalFacility && medicalFacilityNameOld !== medicalFacilityName) {
    res.status(200).json({
      success: false,
      error: "Cơ sở khám bệnh đã tồn tại!",
      message: "Cơ sở khám bệnh đã tồn tại!",
    });
  } else {
    MedicalFacility.update(
      {
        medicalFacilityName: medicalFacilityName,
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
      .then((medicalFacility) => {
        res.status(200).json({
          results: {
            list: medicalFacility,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Cập nhật cơ sở khám bệnh thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi cập nhật cơ sở khám bệnh!",
        });
      });
  }
};
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  MedicalFacility.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((medicalFacility) => {
      res.status(200).json({
        results: {
          list: medicalFacility,
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
  MedicalFacility.destroy({
    where: {
      id: id,
    },
  })
    .then((medicalFacility) => {
      res.status(200).json({
        results: {
          list: medicalFacility,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa cơ sở khám bệnh thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa cơ sở khám bệnh!",
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
