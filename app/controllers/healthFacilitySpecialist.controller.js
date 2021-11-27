const db = require("../models");
const HealthFacilitySpecialist = db.healthFacilitySpecialist;
const HealthFacility = db.healthFacility;
const Specialist = db.specialist;

const moment = require("moment");

const Op = db.Sequelize.Op;

const getList = async (req, res) => {
  const { filter, range, sort, attributes } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const ranges = range ? JSON.parse(range) : [0, 20];
  const order = sort ? JSON.parse(sort) : ["createdAt", "DESC"];
  const healthFacilityId = filters.healthFacilityId || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);
  const options = {
    where: {
      createdAt: {
        [Op.between]: [fromDate, toDate],
      },
    },
    order: [order],
    offset: ranges[0],
    limit: size,
    include: [
      {
        model: HealthFacility,
        required: true,
        attributes: ["id", "healthFacilityName"],
        through: {
          where: {
            healthFacilityId: { [Op.like]: "%" + healthFacilityId + "%" },
          },
          attributes: ["healthFacilityId", "specialistId"],
        },
      },
    ],
  };

  Specialist.findAndCountAll(options)
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
  HealthFacilitySpecialist.findOne({
    where: {
      id: id,
    },
  })
    .then((healthFacilitySpecialist) => {
      res.status(200).json({
        results: {
          list: healthFacilitySpecialist,
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
        message: "Xảy ra lỗi khi lấy thông tin chuyên khoa!",
      });
    });
};

const create = async (req, res) => {
  const { id, healthFacilityId, specialistId } = req.body;
  const healthFacilitySpecialist = await HealthFacilitySpecialist.findOne({
    where: {
      [Op.and]: [
        { healthFacilityId: healthFacilityId },
        { specialistId: specialistId },
      ],
    },
  });

  if (healthFacilitySpecialist) {
    res.status(200).json({
      success: false,
      error: "Chuyên khoa đã tồn tại!",
      message: "Chuyên khoa đã tồn tại!",
    });
  } else {
    HealthFacilitySpecialist.create({
      id:
        id ||
        Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
      healthFacilityId,
      specialistId,
    })
      .then((healthFacilitySpecialist) => {
        res.status(200).json({
          results: {
            list: healthFacilitySpecialist,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Thêm mới chuyên khoa thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi thêm mới chuyên khoa!",
        });
      });
  }
};

const bulkCreate = async (req, res) => {
  const healthFacilitySpecialists = req.body;
  let err = false;
  let errMessage = "";
  for (let index = 0; index < healthFacilitySpecialists.length; index++) {
    const healthFacilitySpecialist = await HealthFacilitySpecialist.findOne({
      where: {
        [Op.and]: [
          {
            healthFacilityId: healthFacilitySpecialists[index].healthFacilityId,
          },
          { specialistId: healthFacilitySpecialists[index].specialistId },
        ],
      },
    });
    if (!healthFacilitySpecialist) {
      HealthFacilitySpecialist.create({
        id:
          Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
        healthFacilityId: healthFacilitySpecialists[index].healthFacilityId,
        specialistId: healthFacilitySpecialists[index].specialistId,
      })
        .then((healthFacilitySpecialist) => {})
        .catch((err) => {
          err = true;
          errMessage: err.message;
        });
    }
  }
  if (err) {
    res.status(200).json({
      success: false,
      error: errMessage,
      message: "Xảy ra lỗi khi thêm mới chuyên khoa thành công!",
    });
  } else {
    res.status(200).json({
      success: true,
      error: "",
      message: "Thêm mới chuyên khoa thành công!",
    });
  }
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const { healthFacilityId, specialistId } = req.body;

  HealthFacilitySpecialist.update(
    {
      healthFacilityId: healthFacilityId,
      specialistId: specialistId,
    },
    {
      where: {
        id: id,
      },
    }
  )
    .then((healthFacilitySpecialist) => {
      res.status(200).json({
        results: {
          list: healthFacilitySpecialist,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Cập nhật chuyên khoa thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi cập nhật chuyên khoa!",
      });
    });
};

const deleteRecord = async (req, res) => {
  const { id } = req.params;
  HealthFacilitySpecialist.destroy({
    where: {
      id: id,
    },
  })
    .then((healthFacilitySpecialist) => {
      res.status(200).json({
        results: {
          list: healthFacilitySpecialist,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa chuyên khoa thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa chuyên khoa!",
      });
    });
};
module.exports = {
  getList,
  getOne,
  create,
  bulkCreate,
  updateRecord,
  deleteRecord,
};
