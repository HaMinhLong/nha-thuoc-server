const db = require("../models");
const Supplier = db.supplier;
const SupplierGroup = db.supplierGroup;
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
        "supplierName",
        "mobile",
        "taxCode",
        "email",
        "website",
        "address",
        "description",
        "supplierGroupId",
        "healthFacilityId",
        "status",
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status || "";
  const supplierName = filters.supplierName || "";
  const supplierGroupId = filters.supplierGroupId || "";
  const healthFacilityId = filters.healthFacilityId || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        { status: { [Op.like]: "%" + status + "%" } },
        { supplierName: { [Op.like]: "%" + supplierName + "%" } },
        { supplierGroupId: { [Op.like]: "%" + supplierGroupId + "%" } },
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
        model: SupplierGroup,
        required: true,
        attributes: ["id", "supplierGroupName"],
      },
    ],
  };

  Supplier.findAndCountAll(options)
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
  Supplier.findOne({
    where: {
      id: id,
    },
  })
    .then((supplier) => {
      res.status(200).json({
        results: {
          list: supplier,
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
        message: "X???y ra l???i khi l???y th??ng tin nh?? cung c???p!",
      });
    });
};

const create = async (req, res) => {
  const {
    id,
    supplierName,
    mobile,
    taxCode,
    email,
    website,
    address,
    description,
    supplierGroupId,
    healthFacilityId,
    status,
  } = req.body;
  const supplier = await Supplier.findOne({
    where: {
      [Op.and]: [
        { supplierName: supplierName },
        { healthFacilityId: healthFacilityId },
      ],
    },
  });

  if (supplier) {
    res.status(200).json({
      success: false,
      error: "Nh?? cung c???p ???? t???n t???i!",
      message: "Nh?? cung c???p ???? t???n t???i!",
    });
  } else {
    Supplier.create({
      id:
        id ||
        Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
      supplierName,
      mobile,
      taxCode,
      email,
      website,
      address,
      description,
      supplierGroupId,
      healthFacilityId,
      status,
    })
      .then((supplier) => {
        res.status(200).json({
          results: {
            list: supplier,
            pagination: [],
          },
          success: true,
          error: "",
          message: "T???o m???i nh?? cung c???p th??nh c??ng!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "X???y ra l???i khi t???o m???i nh?? cung c???p!",
        });
      });
  }
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const {
    supplierName,
    supplierNameOld,
    mobile,
    taxCode,
    email,
    website,
    address,
    description,
    supplierGroupId,
    healthFacilityId,
    status,
  } = req.body;
  const supplier = await Supplier.findOne({
    where: {
      [Op.and]: [
        { supplierName: supplierName },
        { healthFacilityId: healthFacilityId },
      ],
    },
  });
  if (supplier && supplierNameOld !== supplierName) {
    res.status(200).json({
      success: false,
      error: "Nh?? cung c???p ???? t???n t???i!",
      message: "Nh?? cung c???p ???? t???n t???i!",
    });
  } else {
    Supplier.update(
      {
        supplierName: supplierName,
        mobile: mobile,
        taxCode: taxCode,
        email: email,
        website: website,
        address: address,
        description: description,
        supplierGroupId: supplierGroupId,
        healthFacilityId: healthFacilityId,
        status: status,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((supplier) => {
        res.status(200).json({
          results: {
            list: supplier,
            pagination: [],
          },
          success: true,
          error: "",
          message: "C???p nh???t nh?? cung c???p th??nh c??ng!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "X???y ra l???i khi c???p nh???t nh?? cung c???p!",
        });
      });
  }
};
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  Supplier.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((supplier) => {
      res.status(200).json({
        results: {
          list: supplier,
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
  Supplier.destroy({
    where: {
      id: id,
    },
  })
    .then((supplier) => {
      res.status(200).json({
        results: {
          list: supplier,
          pagination: [],
        },
        success: true,
        error: "",
        message: "X??a nh?? cung c???p th??nh c??ng!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "X???y ra l??i khi x??a nh?? cung c???p!",
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
