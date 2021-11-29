const db = require("../models");
const Producer = db.producer;
const ProducerGroup = db.producerGroup;
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
        "producerName",
        "mobile",
        "email",
        "address",
        "producerGroupId",
        "healthFacilityId",
        "status",
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status || "";
  const producerName = filters.producerName || "";
  const producerGroupId = filters.producerGroupId || "";
  const healthFacilityId = filters.healthFacilityId || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        { status: { [Op.like]: "%" + status + "%" } },
        { producerName: { [Op.like]: "%" + producerName + "%" } },
        { producerGroupId: { [Op.like]: "%" + producerGroupId + "%" } },
        { healthFacilityId: { [Op.like]: "%" + healthFacilityId + "%" } },
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
        model: ProducerGroup,
        required: true,
        attributes: ["id", "producerGroupName"],
      },
    ],
  };

  Producer.findAndCountAll(options)
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
  Producer.findOne({
    where: {
      id: id,
    },
  })
    .then((producer) => {
      res.status(200).json({
        results: {
          list: producer,
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
        message: "Xảy ra lỗi khi lấy thông tin nhà sản xuất!",
      });
    });
};

const create = async (req, res) => {
  const {
    id,
    producerName,
    mobile,
    email,
    address,
    producerGroupId,
    healthFacilityId,
    status,
  } = req.body;
  const producer = await Producer.findOne({
    where: {
      [Op.and]: [
        { producerName: producerName },
        { healthFacilityId: healthFacilityId },
      ],
    },
  });

  if (producer) {
    res.status(200).json({
      success: false,
      error: "Nhà sản xuất đã tồn tại!",
      message: "Nhà sản xuất đã tồn tại!",
    });
  } else {
    Producer.create({
      id:
        id ||
        Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
      producerName,
      mobile,
      email,
      address,
      producerGroupId,
      healthFacilityId,
      status,
    })
      .then((producer) => {
        res.status(200).json({
          results: {
            list: producer,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Tạo mới nhà sản xuất thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi tạo mới nhà sản xuất!",
        });
      });
  }
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const {
    producerName,
    producerNameOld,
    mobile,
    email,
    address,
    producerGroupId,
    healthFacilityId,
    status,
  } = req.body;
  const producer = await Producer.findOne({
    where: {
      [Op.and]: [
        { producerName: producerName },
        { healthFacilityId: healthFacilityId },
      ],
    },
  });
  if (producer && producerNameOld !== producerName) {
    res.status(200).json({
      success: false,
      error: "Nhà sản xuất đã tồn tại!",
      message: "Nhà sản xuất đã tồn tại!",
    });
  } else {
    Producer.update(
      {
        producerName: producerName,
        mobile: mobile,
        email: email,
        address: address,
        producerGroupId: producerGroupId,
        healthFacilityId: healthFacilityId,
        status: status,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((producer) => {
        res.status(200).json({
          results: {
            list: producer,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Cập nhật nhà sản xuất thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi cập nhật nhà sản xuất!",
        });
      });
  }
};
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  Producer.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((producer) => {
      res.status(200).json({
        results: {
          list: producer,
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
  Producer.destroy({
    where: {
      id: id,
    },
  })
    .then((producer) => {
      res.status(200).json({
        results: {
          list: producer,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa nhà sản xuất thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa nhà sản xuất!",
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
