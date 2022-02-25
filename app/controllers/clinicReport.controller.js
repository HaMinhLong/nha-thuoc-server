const db = require("../models");
const Sequelize = db.sequelize;
const moment = require("moment");
const { QueryTypes } = require("sequelize");

const doctorReport = async (req, res) => {
  const { filter } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const doctorName = `%${filters.doctorName ? filters?.doctorName : ""}%`;
  const healthFacilityId = `%${
    filters.healthFacilityId ? filters?.healthFacilityId : ""
  }%`;
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment().format();

  const report = await Sequelize.query(
    `SELECT CR.clinicReceiptCode, fullName, clinicServiceName, date, CRS.price, CRS.amount, discount, tax, CRS.total, CR.createdAt 
    FROM users AS U
    JOIN medicalRegisters AS MR ON U.id = MR.userId
    JOIN clinicReceipts AS CR ON MR.id = CR.medicalRegisterId
    JOIN clinicReceiptServices AS CRS ON CRS.clinicReceiptId = CR.id
    JOIN clinicServices AS CS ON CRS.clinicServiceId = CS.id
    WHERE userGroupId = 12345678911 AND fullName LIKE :doctorName
    AND MR.healthFacilityId LIKE :healthFacilityId
    AND CR.createdAt >= :fromDate AND CR.createdAt <= :toDate;
    `,
    {
      replacements: {
        healthFacilityId: healthFacilityId,
        doctorName: doctorName,
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
  doctorReport,
};
