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
    `SELECT C.customerName, C.mobile, medicineName, MIM.price, MIM.amount
    , MIM.discount, MIM.tax, MIM.price * MIM.amount AS totalRevenue, MIM.total
    , MI.createdAt, MIM.total - (RM.price * MIM.amount) AS profit 
    FROM customers AS C
    JOIN medicineIssues AS MI ON MI.customerId = C.id
    JOIN medicineIssueMedicines AS MIM ON MIM.medicineIssueId = MI.id
    JOIN medicines AS M ON M.id = MIM.medicineId
    JOIN receiptMedicines AS RM ON RM.medicineId = M.id
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

module.exports = {
  customerReport,
};
