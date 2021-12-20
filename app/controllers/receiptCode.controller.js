const db = require("../models");
const ReceiptCode = db.receiptCode;
const HealthFacility = db.healthFacility;

const Op = db.Sequelize.Op;

const getOne = async (req, res) => {
  const { filter } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const healthFacilityId = filters.healthFacilityId || "";
  const formType = filters.formType || "";
  const formTypeText =
    formType === "1"
      ? "PTNT"
      : formType === "2"
      ? "PTBT"
      : formType === "3"
      ? "PTTH"
      : formType === "4"
      ? "PTCK"
      : formType === "5"
      ? "PTPK"
      : "PTPT";
  ReceiptCode.findOne({
    where: {
      [Op.and]: [
        { healthFacilityId: { [Op.like]: "%" + healthFacilityId + "%" } },
        { formType: { [Op.like]: "%" + formType + "%" } },
      ],
    },
    include: [
      {
        model: HealthFacility,
        required: true,
        attributes: ["id", "healthFacilityCode"],
      },
    ],
  })
    .then((receiptCode) => {
      res.status(200).json({
        results: {
          list: {
            id: receiptCode.id,
            receiptCode: `${receiptCode?.healthFacility?.healthFacilityCode}${formTypeText}${receiptCode.receiptCode}`,
            formType: receiptCode.formType,
          },
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
        message: "Xảy ra lỗi khi lấy thông tin mã hóa đơn!",
      });
    });
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const receiptCode = await ReceiptCode.findOne({
    where: {
      id: id,
    },
  });
  ReceiptCode.update(
    {
      receiptCode: receiptCode?.receiptCode + 1,
    },
    {
      where: {
        id: id,
      },
    }
  )
    .then((receiptCode) => {
      res.status(200).json({
        results: {
          list: receiptCode,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Cập nhật mã hóa đơn thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi cập nhật mã hóa đơn!",
      });
    });
};

module.exports = {
  getOne,
  updateRecord,
};
