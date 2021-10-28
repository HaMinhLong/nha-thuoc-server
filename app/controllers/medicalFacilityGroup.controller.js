const db = require("../models");
const MedicalFacilityGroup = db.medicalFacilityGroup;
const moment = require("moment");

const Op = db.Sequelize.Op;

const getList = async (req, res) => {
  const { filter, range, sort, attributes } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const ranges = range ? JSON.parse(range) : [0, 20];
  const order = sort ? JSON.parse(sort) : ["createdAt", "DESC"];
  const attributesQuery = attributes
    ? attributes.split(",")
    : ["id", "medicalFacilityGroupName", "status", "createdAt", "updatedAt"];
  const status = filters.status || "";
  const medicalFacilityGroupName = filters.medicalFacilityGroupName || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        { status: { [Op.like]: "%" + status + "%" } },
        {
          medicalFacilityGroupName: {
            [Op.like]: "%" + medicalFacilityGroupName + "%",
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
  };

  MedicalFacilityGroup.findAndCountAll(options)
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
  MedicalFacilityGroup.findOne({
    where: {
      id: id,
    },
  })
    .then((medicalFacilityGroup) => {
      res.status(200).json({
        results: {
          list: medicalFacilityGroup,
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
        message: "Xảy ra lỗi khi lấy thông tin nhóm cơ sở y tế!",
      });
    });
};

const create = async (req, res) => {
  const { id, medicalFacilityGroupName, status } = req.body;
  const medicalFacilityGroup = await MedicalFacilityGroup.findOne({
    where: { medicalFacilityGroupName: medicalFacilityGroupName },
  });

  if (medicalFacilityGroup) {
    res.status(200).json({
      success: false,
      error: "Nhóm cơ sở y tế đã tồn tại!",
      message: "Nhóm cơ sở y tế đã tồn tại!",
    });
  } else {
    MedicalFacilityGroup.create({
      id:
        id ||
        Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
      medicalFacilityGroupName,
      status,
    })
      .then((medicalFacilityGroup) => {
        res.status(200).json({
          results: {
            list: medicalFacilityGroup,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Tạo mới nhóm cơ sở y tế thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi tạo mới nhóm cơ sở y tế!",
        });
      });
  }
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const { medicalFacilityGroupName, medicalFacilityGroupNameOld, status } =
    req.body;
  const medicalFacilityGroup = await MedicalFacilityGroup.findOne({
    where: { medicalFacilityGroupName: medicalFacilityGroupName },
  });
  if (
    medicalFacilityGroup &&
    medicalFacilityGroupNameOld !== medicalFacilityGroupName
  ) {
    res.status(200).json({
      success: false,
      error: "Nhóm cơ sở y tế đã tồn tại!",
      message: "Nhóm cơ sở y tế đã tồn tại!",
    });
  } else {
    MedicalFacilityGroup.update(
      {
        status: status,
        medicalFacilityGroupName: medicalFacilityGroupName,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((medicalFacilityGroup) => {
        res.status(200).json({
          results: {
            list: medicalFacilityGroup,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Cập nhật nhóm cơ sở y tế thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi cập nhật nhóm cơ sở y tế!",
        });
      });
  }
};
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  MedicalFacilityGroup.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((medicalFacilityGroup) => {
      res.status(200).json({
        results: {
          list: medicalFacilityGroup,
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
  MedicalFacilityGroup.destroy({
    where: {
      id: id,
    },
  })
    .then((medicalFacilityGroup) => {
      res.status(200).json({
        results: {
          list: medicalFacilityGroup,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa nhóm cơ sở y tế thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa nhóm cơ sở y tế!",
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
