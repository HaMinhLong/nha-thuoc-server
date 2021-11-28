const db = require("../models");
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
        "producerGroupName",
        "healthFacilityId",
        "status",
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status || "";
  const producerGroupName = filters.producerGroupName || "";
  const healthFacilityId = filters.healthFacilityId || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        { status: { [Op.like]: "%" + status + "%" } },
        { producerGroupName: { [Op.like]: "%" + producerGroupName + "%" } },
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
  };

  ProducerGroup.findAndCountAll(options)
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
  ProducerGroup.findOne({
    where: {
      id: id,
    },
  })
    .then((producerGroup) => {
      res.status(200).json({
        results: {
          list: producerGroup,
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
        message: "Xảy ra lỗi khi lấy thông tin nhóm nhà sản xuất!",
      });
    });
};

const create = async (req, res) => {
  const { id, producerGroupName, healthFacilityId, status } = req.body;
  const producerGroup = await ProducerGroup.findOne({
    where: {
      [Op.and]: [
        { producerGroupName: producerGroupName },
        { healthFacilityId: healthFacilityId },
      ],
    },
  });

  if (producerGroup) {
    res.status(200).json({
      success: false,
      error: "Nhóm nhà sản xuất đã tồn tại!",
      message: "Nhóm nhà sản xuất đã tồn tại!",
    });
  } else {
    ProducerGroup.create({
      id:
        id ||
        Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
      producerGroupName,
      healthFacilityId,
      status,
    })
      .then((producerGroup) => {
        res.status(200).json({
          results: {
            list: producerGroup,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Tạo mới nhóm nhà sản xuất thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi tạo mới nhóm nhà sản xuất!",
        });
      });
  }
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const { producerGroupName, producerGroupNameOld, healthFacilityId, status } =
    req.body;
  const producerGroup = await ProducerGroup.findOne({
    where: {
      [Op.and]: [
        { producerGroupName: producerGroupName },
        { healthFacilityId: healthFacilityId },
      ],
    },
  });
  if (producerGroup && producerGroupNameOld !== producerGroupName) {
    res.status(200).json({
      success: false,
      error: "Nhóm nhà sản xuất đã tồn tại!",
      message: "Nhóm nhà sản xuất đã tồn tại!",
    });
  } else {
    ProducerGroup.update(
      {
        status: status,
        producerGroupName: producerGroupName,
        healthFacilityId: healthFacilityId,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((producerGroup) => {
        res.status(200).json({
          results: {
            list: producerGroup,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Cập nhật nhóm nhà sản xuất thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi cập nhật nhóm nhà sản xuất!",
        });
      });
  }
};
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  ProducerGroup.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((producerGroup) => {
      res.status(200).json({
        results: {
          list: producerGroup,
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
  ProducerGroup.destroy({
    where: {
      id: id,
    },
  })
    .then((producerGroup) => {
      res.status(200).json({
        results: {
          list: producerGroup,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa nhóm nhà sản xuất thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa nhóm nhà sản xuất!",
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
