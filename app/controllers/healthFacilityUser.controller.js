const db = require("../models");
const HealthFacilityUser = db.healthFacilityUser;
const HealthFacility = db.healthFacility;
const User = db.user;
const Ward = db.ward;
const District = db.district;
const Province = db.province;
const moment = require("moment");

const Op = db.Sequelize.Op;

const getList = async (req, res) => {
  const { filter, range, sort } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const ranges = range ? JSON.parse(range) : [0, 20];
  const order = sort ? JSON.parse(sort) : ["createdAt", "DESC"];
  const userId = filters.userId || "";
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
    attributes: ["id", "healthFacilityName", "mobile", "address", "createdAt"],
    include: [
      {
        model: User,
        required: true,
        attributes: ["id", "username"],
        through: {
          where: {
            userId: { [Op.like]: "%" + userId + "%" },
          },
          attributes: ["id", "healthFacilityId", "userId"],
        },
      },
      {
        model: District,
        required: true,
        attributes: ["id", "districtName"],
      },
      {
        model: Province,
        required: true,
        attributes: ["id", "provinceName"],
      },
      {
        model: Ward,
        required: true,
        attributes: ["id", "wardName"],
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
  HealthFacilityUser.findOne({
    where: {
      id: id,
    },
  })
    .then((healthFacilityUser) => {
      res.status(200).json({
        results: {
          list: healthFacilityUser,
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
        message: "Xảy ra lỗi khi lấy thông tin CSYT!",
      });
    });
};

const create = async (req, res) => {
  const { id, healthFacilityId, userId } = req.body;
  const healthFacilityUser = await HealthFacilityUser.findOne({
    where: {
      [Op.and]: [{ healthFacilityId: healthFacilityId }, { userId: userId }],
    },
  });

  if (healthFacilityUser) {
    res.status(200).json({
      success: false,
      error: "CSYT đã tồn tại!",
      message: "CSYT đã tồn tại!",
    });
  } else {
    HealthFacilityUser.create({
      id:
        id ||
        Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
      healthFacilityId,
      userId,
    })
      .then((healthFacilityUser) => {
        res.status(200).json({
          results: {
            list: healthFacilityUser,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Thiết lập CSYT thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi thiết lập CSYT!",
        });
      });
  }
};

const bulkCreate = async (req, res) => {
  const healthFacilityUsers = req.body;
  let err = false;
  let errMessage = "";
  for (let index = 0; index < healthFacilityUsers.length; index++) {
    const healthFacilityUser = await HealthFacilityUser.findOne({
      where: {
        [Op.and]: [
          {
            healthFacilityId: healthFacilityUsers[index].healthFacilityId,
          },
          { userId: healthFacilityUsers[index].userId },
        ],
      },
    });
    if (!healthFacilityUser) {
      HealthFacilityUser.create({
        id:
          Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
        healthFacilityId: healthFacilityUsers[index].healthFacilityId,
        userId: healthFacilityUsers[index].userId,
      })
        .then((healthFacilityUser) => {})
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
      message: "Xảy ra lỗi khi thiết lập CSYT thành công!",
    });
  } else {
    res.status(200).json({
      success: true,
      error: "",
      message: "Thiết lập CSYT thành công!",
    });
  }
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const { healthFacilityId, userId } = req.body;

  HealthFacilityUser.update(
    {
      healthFacilityId: healthFacilityId,
      userId: userId,
    },
    {
      where: {
        id: id,
      },
    }
  )
    .then((healthFacilityUser) => {
      res.status(200).json({
        results: {
          list: healthFacilityUser,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Cập nhật CSYT thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi cập nhật CSYT!",
      });
    });
};

const deleteRecord = async (req, res) => {
  const { id } = req.params;
  HealthFacilityUser.destroy({
    where: {
      id: id,
    },
  })
    .then((healthFacilityUser) => {
      res.status(200).json({
        results: {
          list: healthFacilityUser,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa CSYT thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa CSYT!",
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
