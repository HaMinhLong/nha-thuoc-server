const db = require("../models");
const WorkSchedule = db.workSchedule;
const moment = require("moment");

const Op = db.Sequelize.Op;

const getList = async (req, res) => {
  const { filter, range, sort, attributes } = req.query;
  console.log("filter", filter);
  const filters = filter ? JSON.parse(filter) : {};
  const ranges = range ? JSON.parse(range) : [0, 20];
  const order = sort ? JSON.parse(sort) : ["createdAt", "ASC"];
  const attributesQuery = attributes
    ? attributes.split(",")
    : [
        "id",
        "open",
        "close",
        "weekday",
        "healthFacilityId",
        "status",
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status || "";
  const healthFacilityId = filters.healthFacilityId || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        { status: { [Op.like]: "%" + status + "%" } },
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

  WorkSchedule.findAndCountAll(options)
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

const updateRecord = async (req, res) => {
  const workSchedule = req.body;
  let err = false;
  let errMessage = "";
  for (let index = 0; index < workSchedule.length; index++) {
    WorkSchedule.update(
      {
        open: workSchedule[index].open,
        close: workSchedule[index].close,
        status: workSchedule[index].status,
      },
      {
        where: {
          id: workSchedule[index].id,
        },
      }
    )
      .then((workSchedule) => {})
      .catch((err) => {
        err = true;
        errMessage: err.message;
      });
  }
  if (err) {
    res.status(200).json({
      success: false,
      error: errMessage,
      message: "Xảy ra lỗi khi cập nhật lịch làm việc!",
    });
  } else {
    res.status(200).json({
      success: true,
      error: "",
      message: "Cập nhật lịch làm việc thành công!",
    });
  }
};

module.exports = {
  getList,
  updateRecord,
};
