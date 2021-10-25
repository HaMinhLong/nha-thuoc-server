const db = require("../models");
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
    : ["id", "provinceName", "status", "createdAt", "updatedAt"];
  const status = filters.status || "";
  const provinceName = filters.provinceName || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        { status: { [Op.like]: "%" + status + "%" } },
        { provinceName: { [Op.like]: "%" + provinceName + "%" } },
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

  Province.findAndCountAll(options)
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
  Province.findOne({
    where: {
      id: id,
    },
  })
    .then((province) => {
      res.status(200).json({
        results: {
          list: province,
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
        message: "Xảy ra lỗi khi lấy thông tin tỉnh/thành phố!",
      });
    });
};

const create = async (req, res) => {
  const { id, provinceName, status } = req.body;
  const province = await Province.findOne({
    where: { provinceName: provinceName },
  });

  if (province) {
    res.status(200).json({
      success: false,
      error: "Tỉnh/thành phố đã tồn tại!",
      message: "Tỉnh/thành phố đã tồn tại!",
    });
  } else {
    Province.create({
      id:
        id ||
        Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
      provinceName,
      status,
    })
      .then((province) => {
        res.status(200).json({
          results: {
            list: province,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Tạo mới tỉnh/thành phố thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi tạo mới tỉnh/thành phố!",
        });
      });
  }
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const { provinceName, userGroupNameOld, status } = req.body;
  const province = await Province.findOne({
    where: { provinceName: provinceName },
  });
  if (province && userGroupNameOld !== provinceName) {
    res.status(200).json({
      success: false,
      error: "Tỉnh/thành phố đã tồn tại!",
      message: "Tỉnh/thành phố đã tồn tại!",
    });
  } else {
    Province.update(
      {
        status: status,
        provinceName: provinceName,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((province) => {
        res.status(200).json({
          results: {
            list: province,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Cập nhật tỉnh/thành phố thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi cập nhật tỉnh/thành phố!",
        });
      });
  }
};
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  Province.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((province) => {
      User.update(
        { status: status },
        {
          where: {
            userGroupId: id,
          },
        }
      );
      res.status(200).json({
        results: {
          list: province,
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
  Province.destroy({
    where: {
      id: id,
    },
  })
    .then((province) => {
      res.status(200).json({
        results: {
          list: province,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa tỉnh/thành phố thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa tỉnh/thành phố!",
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
