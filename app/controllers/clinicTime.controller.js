const db = require("../models");
const ClinicTime = db.clinicTime;
const WorkSchedule = db.workSchedule;

const Moment = require("moment");
const MomentRange = require("moment-range");

const moment = MomentRange.extendMoment(Moment);

const Op = db.Sequelize.Op;

const getList = async (req, res) => {
  const { filter, range, sort, attributes } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const ranges = range ? JSON.parse(range) : [0, 100];
  const order = sort ? JSON.parse(sort) : ["ordinalNumber", "ASC"];
  const attributesQuery = attributes
    ? attributes.split(",")
    : [
        "id",
        "isClose",
        "ordinalNumber",
        "hourFrame",
        "clinicServiceId",
        "createdAt",
        "updatedAt",
      ];
  const clinicServiceId = filters.clinicServiceId || "";
  const healthFacilityId = filters.healthFacilityId || "";
  const time = filters.time || "";
  const fromDate =
    filters.fromDate ||
    Moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  const toDate =
    filters.toDate ||
    Moment().set({ hour: 23, minute: 59, second: 59, millisecond: 99 });
  const hour = Number(time.split(":")[0]);
  const minute = Number(time.split(":")[1]);
  const second = Number(time.split(":")[2]);
  const minutesSlice = hour * 60 + minute + second / 60;
  const today = filters.day;
  const dateNow =
    today === 1
      ? "Monday"
      : today === 2
      ? "Tuesday"
      : today === 3
      ? "Wednesday"
      : today === 4
      ? "Thursday"
      : today === 5
      ? "Friday"
      : today === 6
      ? "Saturday"
      : "Sunday";
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      clinicServiceId: {
        [Op.like]: "%" + clinicServiceId + "%",
      },
      createdAt: {
        [Op.between]: [fromDate, toDate],
      },
    },
    order: [order],
    attributes: attributesQuery,
    offset: ranges[0],
    limit: size,
  };

  WorkSchedule.findOne({
    where: {
      [Op.and]: [
        { healthFacilityId: healthFacilityId },
        {
          weekday: dateNow,
        },
      ],
    },
  })
    .then((workSchedule) => {
      ClinicTime.findAndCountAll(options)
        .then((result) => {
          if (result.count === 0) {
            if (workSchedule.status) {
              const { open, close } = workSchedule;
              const dayStart = moment(open, "HH:mm:ss");
              const dayEnd = moment(close, "HH:mm:ss");
              const day = moment.range(dayStart, dayEnd);
              const timeSlots = Array.from(
                day.by("minutes", { step: minutesSlice })
              );
              const clinicTimeAdd = [];
              for (let index = 0; index < timeSlots.length; index++) {
                clinicTimeAdd.push({
                  id:
                    Math.floor(
                      Math.random() * (100000000000 - 1000000000 + 1)
                    ) + 100000000000,
                  isClose: false,
                  ordinalNumber: index,
                  hourFrame: Moment(timeSlots[index]).format("HH:mm:ss"),
                  clinicServiceId: Number(clinicServiceId),
                  createdAt: fromDate,
                });
              }
              if (clinicTimeAdd.length > 0) {
                ClinicTime.bulkCreate(clinicTimeAdd);
              }
              res.status(200).json({
                results: {
                  list: clinicTimeAdd,
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
            } else {
              res.status(200).json({
                results: {
                  list: [],
                  pagination: [],
                },
                success: false,
                error: "",
                message: "Ph??ng kh??m kh??ng l??m vi???c v??o ng??y n??y",
              });
            }
          } else {
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
          }
        })
        .catch((err) => {
          res.status(200).json({
            success: false,
            error: err.message,
            message: "X???y ra l???i khi l???y danh s??ch!",
          });
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

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { isClose } = req.body;
  ClinicTime.update(
    { isClose: isClose },
    {
      where: {
        id: id,
      },
    }
  )
    .then((clinicTime) => {
      res.status(200).json({
        results: {
          list: clinicTime,
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

module.exports = {
  getList,
  updateStatus,
};
