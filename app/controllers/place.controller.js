const db = require("../models");
const Place = db.place;
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
    : [
        "id",
        "placeName",
        "status",
        "email",
        "mobile",
        "provinceId",
        "districtId",
        "wardId",
        "address",
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status || "";
  const placeName = filters.placeName || "";
  const provinceId = filters.provinceId || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        { status: { [Op.like]: "%" + status + "%" } },
        { placeName: { [Op.like]: "%" + placeName + "%" } },
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

  Place.findAndCountAll(options)
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
        message: "X???y ra l???i khi l???y danh s??ch!",
      });
    });
};

const getOne = async (req, res) => {
  const { id } = req.params;
  Place.findOne({
    where: {
      id: id,
    },
  })
    .then((place) => {
      res.status(200).json({
        results: {
          list: place,
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
        message: "X???y ra l???i khi l???y th??ng tin ?????a ??i???m!",
      });
    });
};

const create = async (req, res) => {
  const {
    id,
    placeName,
    email,
    mobile,
    provinceId,
    districtId,
    wardId,
    address,
    status,
  } = req.body;
  const place = await Place.findOne({
    where: { placeName: placeName },
  });

  if (place) {
    res.status(200).json({
      success: false,
      error: "?????a ??i???m ???? t???n t???i!",
      message: "?????a ??i???m ???? t???n t???i!",
    });
  } else {
    Place.create({
      id:
        id ||
        Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
      placeName,
      email,
      mobile,
      provinceId,
      districtId,
      wardId,
      address,
      status,
    })
      .then((place) => {
        res.status(200).json({
          results: {
            list: place,
            pagination: [],
          },
          success: true,
          error: "",
          message: "T???o m???i ?????a ??i???m th??nh c??ng!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "X???y ra l???i khi t???o m???i ?????a ??i???m!",
        });
      });
  }
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const {
    placeName,
    placeNameOld,
    email,
    mobile,
    provinceId,
    districtId,
    wardId,
    address,
    status,
  } = req.body;
  const place = await Place.findOne({
    where: { placeName: placeName },
  });
  if (place && placeNameOld !== placeName) {
    res.status(200).json({
      success: false,
      error: "?????a ??i???m ???? t???n t???i!",
      message: "?????a ??i???m ???? t???n t???i!",
    });
  } else {
    Place.update(
      {
        placeName: placeName,
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
      .then((place) => {
        res.status(200).json({
          results: {
            list: place,
            pagination: [],
          },
          success: true,
          error: "",
          message: "C???p nh???t ?????a ??i???m th??nh c??ng!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "X???y ra l???i khi c???p nh???t ?????a ??i???m!",
        });
      });
  }
};
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  Place.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((place) => {
      res.status(200).json({
        results: {
          list: place,
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

const deleteRecord = async (req, res) => {
  const { id } = req.params;
  Place.destroy({
    where: {
      id: id,
    },
  })
    .then((place) => {
      res.status(200).json({
        results: {
          list: place,
          pagination: [],
        },
        success: true,
        error: "",
        message: "X??a ?????a ??i???m th??nh c??ng!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "X???y ra l??i khi x??a ?????a ??i???m!",
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
