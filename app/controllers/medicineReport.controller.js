const db = require("../models");
const Sequelize = db.sequelize;
const moment = require("moment");
const { QueryTypes } = require("sequelize");

const customerReport = async (req, res) => {
  const { filter } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const customerName = `%${filters.customerName ? filters?.customerName : ""}%`;
  const mobile = `%${filters.mobile ? filters?.mobile : ""}%`;
  const healthFacilityId = `%${
    filters.healthFacilityId ? filters?.healthFacilityId : ""
  }%`;
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment().format();

  const report = await Sequelize.query(
    `SELECT DISTINCT RM.medicineId, C.customerName, C.mobile, medicineName, MIM.price, MIM.amount
    , MIM.discount, MIM.tax, MIM.price * MIM.amount AS totalRevenue, MIM.total
    , MIM.total - (RM.price * MIM.amount) AS profit
    , MIM.discountType, MIM.taxType, MI.debit
    FROM medicineIssueMedicines AS MIM 
    JOIN medicineIssues AS MI ON MI.id = MIM.medicineIssueId
    JOIN medicines AS M ON M.id = MIM.medicineId
    JOIN receiptMedicines AS RM ON RM.medicineId = M.id
    JOIN customers AS C ON C.id = MI.customerId
    WHERE C.healthFacilityId LIKE :healthFacilityId AND C.customerName LIKE :customerName
    AND C.mobile LIKE :mobile AND MI.createdAt >= :fromDate AND MI.createdAt <= :toDate;
    `,
    {
      replacements: {
        healthFacilityId: healthFacilityId,
        customerName: customerName,
        mobile: mobile,
        fromDate: fromDate,
        toDate: toDate,
      },
      type: QueryTypes.SELECT,
    }
  );

  res.status(200).json({
    results: {
      list: report,
      pagination: {},
    },
    success: true,
    error: "",
    message: "",
  });
};

const employeeReport = async (req, res) => {
  const { filter } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const fullName = `%${filters.fullName ? filters?.fullName : ""}%`;
  const mobile = `%${filters.mobile ? filters?.mobile : ""}%`;
  const healthFacilityId = `%${
    filters.healthFacilityId ? filters?.healthFacilityId : ""
  }%`;
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment().format();

  const report = await Sequelize.query(
    `SELECT U.fullName, U.mobile, medicineName, MIM.price, MIM.amount
    , MIM.discount, MIM.tax, MIM.price * MIM.amount AS totalRevenue, MIM.total
    , MIM.discountType, MIM.taxType, MI.debit
    FROM medicineIssueMedicines AS MIM
    JOIN medicineIssues AS MI ON MI.id = MIM.medicineIssueId
    JOIN medicines AS M ON M.id = MIM.medicineId
    JOIN users AS U ON U.id = MI.userId
    WHERE MI.healthFacilityId LIKE :healthFacilityId AND U.fullName LIKE :fullName
    AND U.mobile LIKE :mobile AND MI.createdAt >= :fromDate AND MI.createdAt <= :toDate;
    `,
    {
      replacements: {
        healthFacilityId: healthFacilityId,
        fullName: fullName,
        mobile: mobile,
        fromDate: fromDate,
        toDate: toDate,
      },
      type: QueryTypes.SELECT,
    }
  );

  res.status(200).json({
    results: {
      list: report,
      pagination: {},
    },
    success: true,
    error: "",
    message: "",
  });
};

const supplierReport = async (req, res) => {
  const { filter } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const supplierName = `%${filters.supplierName ? filters?.supplierName : ""}%`;
  const mobile = `%${filters.mobile ? filters?.mobile : ""}%`;
  const healthFacilityId = `%${
    filters.healthFacilityId ? filters?.healthFacilityId : ""
  }%`;
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment().format();

  const report = await Sequelize.query(
    `SELECT supplierName, mobile, medicineName
    , RM.price, RM.amount, RM.discount, RM.discountType
    , RM.tax, RM.taxType, RM.total, R.debit
    , RM.price * RM.amount AS totalRevenue
    FROM receiptMedicines AS RM
    JOIN receipts AS R ON R.id = RM.receiptId
    JOIN medicines AS M ON M.id = RM.medicineId
    JOIN suppliers AS S ON S.id = R.supplierId
    WHERE R.healthFacilityId LIKE :healthFacilityId AND S.supplierName LIKE :supplierName
    AND S.mobile LIKE :mobile AND R.createdAt >= :fromDate AND R.createdAt <= :toDate;
    `,
    {
      replacements: {
        healthFacilityId: healthFacilityId,
        supplierName: supplierName,
        mobile: mobile,
        fromDate: fromDate,
        toDate: toDate,
      },
      type: QueryTypes.SELECT,
    }
  );

  res.status(200).json({
    results: {
      list: report,
      pagination: {},
    },
    success: true,
    error: "",
    message: "",
  });
};

const expiredMedicineReport = async (req, res) => {
  const { filter } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const medicineName = `%${filters.medicineName ? filters?.medicineName : ""}%`;
  const warehouseId = `%${filters.warehouseId ? filters?.warehouseId : ""}%`;
  const healthFacilityId = `%${
    filters.healthFacilityId ? filters?.healthFacilityId : ""
  }%`;
  const toDate = filters.toDate || moment().format();

  const report = await Sequelize.query(
    `SELECT medicineName, expiry, unitName, WM.inStock, price
    , warehouseName, registrationNumber, producerName, price * WM.inStock AS total
    FROM warehouseMedicines AS WM
    JOIN medicines AS M ON M.id = WM.medicineId
    JOIN units AS U ON U.id = WM.unitId
    JOIN warehouses AS W ON W.id = WM.warehouseId
    JOIN producers AS P ON P.id = M.producerId
    JOIN receiptMedicines AS RM ON RM.id = WM.receiptMedicineId
    WHERE expiry < :toDate AND M.healthFacilityId LIKE :healthFacilityId
    AND W.id LIKE :warehouseId AND medicineName LIKE :medicineName;
    `,
    {
      replacements: {
        healthFacilityId: healthFacilityId,
        medicineName: medicineName,
        warehouseId: warehouseId,
        toDate: toDate,
      },
      type: QueryTypes.SELECT,
    }
  );

  res.status(200).json({
    results: {
      list: report,
      pagination: {},
    },
    success: true,
    error: "",
    message: "",
  });
};

const expiredMedicineReportV2 = async (req, res) => {
  const { filter } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const medicineName = `%${filters.medicineName ? filters?.medicineName : ""}%`;
  const warehouseId = `%${filters.warehouseId ? filters?.warehouseId : ""}%`;
  const healthFacilityId = `%${
    filters.healthFacilityId ? filters?.healthFacilityId : ""
  }%`;

  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment().format();

  const report = await Sequelize.query(
    `SELECT medicineName, expiry, unitName, WM.inStock, price
    , warehouseName, registrationNumber, producerName, price * WM.inStock AS total
    FROM warehouseMedicines AS WM
    JOIN medicines AS M ON M.id = WM.medicineId
    JOIN units AS U ON U.id = WM.unitId
    JOIN warehouses AS W ON W.id = WM.warehouseId
    JOIN producers AS P ON P.id = M.producerId
    JOIN receiptMedicines AS RM ON RM.id = WM.receiptMedicineId
    WHERE expiry <= :toDate AND expiry >= :fromDate AND M.healthFacilityId LIKE :healthFacilityId
    AND W.id LIKE :warehouseId AND medicineName LIKE :medicineName;
    `,
    {
      replacements: {
        healthFacilityId: healthFacilityId,
        medicineName: medicineName,
        warehouseId: warehouseId,
        fromDate: fromDate,
        toDate: toDate,
      },
      type: QueryTypes.SELECT,
    }
  );

  res.status(200).json({
    results: {
      list: report,
      pagination: {},
    },
    success: true,
    error: "",
    message: "",
  });
};

const medicine = async (req, res) => {
  const { filter } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const medicineName = `%${filters.medicineName ? filters?.medicineName : ""}%`;
  const healthFacilityId = `%${
    filters.healthFacilityId ? filters?.healthFacilityId : ""
  }%`;

  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment().format();

  const report = await Sequelize.query(
    `SELECT medicineName, registrationNumber, price, amount, country
    , discount, discountType, tax, taxType, total,
    price * amount AS totalRevenue, MIM.createdAt
    FROM medicineIssueMedicines AS MIM
    JOIN medicines AS M ON M.id = MIM.medicineId
    WHERE MIM.createdAt <= :toDate AND MIM.createdAt >= :fromDate 
    AND M.healthFacilityId LIKE :healthFacilityId
    AND medicineName LIKE :medicineName;
    `,
    {
      replacements: {
        healthFacilityId: healthFacilityId,
        medicineName: medicineName,
        fromDate: fromDate,
        toDate: toDate,
      },
      type: QueryTypes.SELECT,
    }
  );

  res.status(200).json({
    results: {
      list: report,
      pagination: {},
    },
    success: true,
    error: "",
    message: "",
  });
};

module.exports = {
  customerReport,
  employeeReport,
  supplierReport,
  expiredMedicineReport,
  expiredMedicineReportV2,
  medicine,
};
