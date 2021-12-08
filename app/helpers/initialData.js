var bcrypt = require("bcryptjs");
initialData = (db) => {
  db.userGroup.create({
    id: 12345678910,
    userGroupName: "Quản trị hệ thống",
    userGroupDescriptions: "",
    status: 1,
  });
  db.userGroup.create({
    id: 12345678911,
    userGroupName: "Bác sĩ",
    userGroupDescriptions: "",
    status: 1,
  });
  db.specialist.create({
    id: 78458965475,
    specialistName: "Răng hàm mặt",
    status: 1,
  });
  db.medicalFacilityGroup.create({
    id: 78458965475,
    medicalFacilityGroupName: "Nhà thuốc",
    status: 1,
  });
  db.paymentMethod.create({
    id: 78458965475,
    paymentMethodName: "Tiền mặt",
    status: 1,
  });
  db.province.create({
    id: 78458965475,
    provinceName: "Hưng Yên",
    status: 1,
  });
  db.district.create({
    id: 78454265475,
    districtName: "Yên Mỹ",
    provinceId: 78458965475,
    status: 1,
  });
  db.ward.create({
    id: 78447865475,
    wardName: "Hoàn Long",
    districtId: 78454265475,
    provinceId: 78458965475,
    status: 1,
  });
  db.place.create({
    id: 12345678911,
    placeName: "Nhà thuốc Trung Yên",
    email: "haminhlong3@gmail.com",
    mobile: "0963339657",
    userGroupId: 12345678910,
    provinceId: 78458965475,
    districtId: 78454265475,
    wardId: 78447865475,
    address: "Thôn Đại Hạnh",
    status: 1,
  });

  db.medicalFacility.create({
    id: 12345678911,
    medicalFacilityName: "Phòng khám Trung Yên",
    email: "haminhlong3@gmail.com",
    mobile: "0963339657",
    userGroupId: 12345678910,
    provinceId: 78458965475,
    districtId: 78454265475,
    wardId: 78447865475,
    address: "Thôn Đại Hạnh",
    status: 1,
  });
  db.healthFacility.create({
    id: 12345678911,
    healthFacilityName: "Phòng khám Đa khoa Minh Đức",
    healthFacilityCode: "DKMD",
    taxCode: "123456789",
    representativeName: "Hà Minh Long",
    representativeMobile: "0963339657",
    medicalFacilityGroupId: 78458965475,
    email: "haminhlong3@gmail.com",
    mobile: "0963339657",
    provinceId: 78458965475,
    districtId: 78454265475,
    wardId: 78447865475,
    address: "Thôn Đại Hạnh",
    status: 1,
  });
  db.workSchedule.create({
    id: 4587512036,
    open: "08:00:00",
    close: "17:30:00",
    weekday: "Monday",
    healthFacilityId: 12345678911,
    status: true,
  });
  db.workSchedule.create({
    id: 8541203658,
    open: "08:00:00",
    close: "17:30:00",
    weekday: "Tuesday",
    healthFacilityId: 12345678911,
    status: true,
  });
  db.workSchedule.create({
    id: 4120320125,
    open: "08:00:00",
    close: "17:30:00",
    weekday: "Wednesday",
    healthFacilityId: 12345678911,
    status: true,
  });
  db.workSchedule.create({
    id: 9512032558,
    open: "08:00:00",
    close: "17:30:00",
    weekday: "Thursday",
    healthFacilityId: 12345678911,
    status: true,
  });
  db.workSchedule.create({
    id: 8420120320,
    open: "08:00:00",
    close: "17:30:00",
    weekday: "Friday",
    healthFacilityId: 12345678911,
    status: true,
  });
  db.workSchedule.create({
    id: 4120120125,
    open: "08:00:00",
    close: "17:30:00",
    weekday: "Saturday",
    healthFacilityId: 12345678911,
    status: true,
  });
  db.workSchedule.create({
    id: 1201203201,
    open: "08:00:00",
    close: "17:30:00",
    weekday: "Sunday",
    healthFacilityId: 12345678911,
    status: true,
  });
  db.clinicType.create({
    id: 1,
    clinicTypeName: "BÁN THUỐC",
    status: 1,
  });
  db.clinicType.create({
    id: 2,
    clinicTypeName: "KHÁM LÂM SÀNG",
    status: 1,
  });
  db.clinicType.create({
    id: 3,
    clinicTypeName: "KHÁM CẬN LÂM SÀNG",
    status: 1,
  });
  db.paperSizeType.create({
    id: 1,
    paperSizeTypeName: "Khổ A4",
    status: 1,
  });
  db.paperSizeType.create({
    id: 2,
    paperSizeTypeName: "Khổ A5",
    status: 1,
  });
  db.paperSizeType.create({
    id: 3,
    paperSizeTypeName: "Khổ Bill K57",
    status: 1,
  });
  db.paperSizeType.create({
    id: 4,
    paperSizeTypeName: "Khổ Bill K80",
    status: 1,
  });
  db.printForm.create({
    id: 689,
    printFormName: "MẪU XÉT NGHIỆM",
    paperSizeTypeId: 1,
    status: 1,
  });
  db.printForm.create({
    id: 789,
    printFormName: "MẪU X-QUANG",
    paperSizeTypeId: 1,
    status: 1,
  });
  db.printForm.create({
    id: 889,
    printFormName: "MẪU SIÊU ÂM THAI",
    paperSizeTypeId: 1,
    status: 1,
  });
  db.printForm.create({
    id: 1089,
    printFormName: "PHIẾU ĐIỆN TIM",
    paperSizeTypeId: 1,
    status: 1,
  });
  db.printForm.create({
    id: 1189,
    printFormName: "MẪU PHIẾU XÉT NGHIỆM",
    paperSizeTypeId: 1,
    status: 1,
  });
  db.printForm.create({
    id: 1289,
    printFormName: "MẪU PHIẾU X-QUANG",
    paperSizeTypeId: 1,
    status: 1,
  });
  db.printForm.create({
    id: 1389,
    printFormName: "MẪU PHIẾU SIÊU ÂM CHẨN ĐOÁN",
    paperSizeTypeId: 1,
    status: 1,
  });
  db.printForm.create({
    id: 1489,
    printFormName: "MẪU SIÊU ÂM TAI MŨI HỌNG",
    paperSizeTypeId: 1,
    status: 1,
  });
  db.printForm.create({
    id: 1589,
    printFormName: "MẪU PHIẾU KẾT QUẢ LÂM SÀNG",
    paperSizeTypeId: 2,
    status: 1,
  });
  db.clinicServicePackage.create({
    id: 194974585981,
    clinicServicePackageName: "Khám tổng thể",
    time: "00:30:00",
    sampleResults: "<p>Mẫu khám tổng thể</p>",
    clinicTypeId: 3,
    printFormId: 1589,
    healthFacilityId: 12345678911,
    status: 1,
  });
  db.warehouse.create({
    id: 12345678911,
    warehouseName: "Kho thuốc Minh Đức",
    provinceId: 78458965475,
    districtId: 78454265475,
    wardId: 78447865475,
    address: "Thôn Đại Hạnh",
    healthFacilityId: 12345678911,
    status: 1,
  });
  db.supplierGroup.create({
    id: 58458965475,
    supplierGroupName: "Nhà cung cấp thực phẩm chức năng",
    healthFacilityId: 12345678911,
    status: 1,
  });
  db.supplier.create({
    id: 28448165375,
    supplierName: "Nhà cung cấp thực phẩm chức năng Minh Đức",
    mobile: "",
    taxCode: "",
    email: "minhduc@gmail.com",
    website: "minhduc.com",
    address: "",
    description: "",
    supplierGroupId: 58458965475,
    healthFacilityId: 12345678911,
    status: 1,
  });
  db.producerGroup.create({
    id: 58458965475,
    producerGroupName: "Công ty dược phẩm NAR",
    healthFacilityId: 12345678911,
    status: 1,
  });
  db.producer.create({
    id: 28448165375,
    producerName: "Cơ sở sản xuất dược phẩm số 1",
    mobile: "0963339657",
    email: "narso1@gmail.com",
    address: "",
    producerGroupId: 58458965475,
    healthFacilityId: 12345678911,
    status: 1,
  });
  db.customerGroup.create({
    id: 58458965475,
    customerGroupName: "Khách hàng lẻ",
    healthFacilityId: 12345678911,
    status: 1,
  });
  db.customer.create({
    id: 28448165375,
    customerName: "Hà Minh Long",
    mobile: 0963339657,
    dateOfBirth: null,
    gender: 1,
    email: "haminhlong3@gmail.com",
    provinceId: 78458965475,
    districtId: 78454265475,
    wardId: 78447865475,
    address: "",
    customerGroupId: 58458965475,
    healthFacilityId: 12345678911,
    status: 1,
  });
  db.medicine.create({
    id: 28448165375,
    medicineName: "Paracetamol Winthrop",
    registrationNumber: "GC-236-15",
    standard: "TCCS",
    activeIngredientName: "Paracetamol 500mg",
    concentration: "Paracetamol 500mg",
    country: "Việt Nam",
    medicineTypeId: 28448165375,
    apothecaryId: 28448165375,
    packageId: 28448165375,
    producerId: 28448165375,
    healthFacilityId: 12345678911,
    status: 1,
  });
  db.medicineUnit.create({
    id: 28448165375,
    retailPrice: "100000",
    wholesalePrice: "90000",
    amount: "1",
    medicineId: 28448165375,
    unitId: 28448165375,
  });
  db.medicineType.create({
    id: 28448165375,
    medicineTypeName: "Thuốc kháng sinh",
    status: 1,
  });
  db.apothecary.create({
    id: 28448165375,
    apothecaryName: "Viên nén",
    status: 1,
  });
  db.package.create({
    id: 28448165375,
    packageName: "Hộp 2 vỉ x 14 viên",
    status: 1,
  });
  db.unit.create({
    id: 28448165375,
    unitName: "Hộp",
    status: 1,
  });
  db.healthFacilitySpecialist.create({
    id: 58458965475,
    healthFacilityId: 12345678911,
    specialistId: 78458965475,
  });
  db.user.create({
    id: 12345678911,
    username: "admin",
    fullName: "Hà Minh Long",
    password: bcrypt.hashSync("admin", 8),
    email: "haminhlong3@gmail.com",
    mobile: "0963339657",
    userGroupId: 12345678910,
    provinceId: 78458965475,
    districtId: 78454265475,
    wardId: 78447865475,
    address: "Thôn Đại Hạnh",
    healthFacilityId: 12345678911,
    status: 1,
  });
  db.user.create({
    id: 45214524524,
    username: "bs_minhduc",
    fullName: "Bác sĩ Minh Đức",
    password: bcrypt.hashSync("admin", 8),
    email: "haminhduc3@gmail.com",
    mobile: "0963339657",
    userGroupId: 12345678911,
    provinceId: 78458965475,
    districtId: 78454265475,
    wardId: 78447865475,
    address: "Thôn Đại Hạnh",
    healthFacilityId: 12345678911,
    status: 1,
  });
  db.healthFacilityUser.create({
    id: 58458965475,
    healthFacilityId: 12345678911,
    userId: 12345678911,
  });
  db.menu.bulkCreate([
    {
      id: 12345678910,
      menuName: "Hệ thống",
      orderBy: 1,
      url: "/",
      icon: "fas fa-cogs",
      parentId: null,
      status: 1,
    },
    {
      id: 12345678945,
      menuName: "Cấu hình hệ thống",
      orderBy: 1,
      url: "/config",
      icon: "",
      parentId: 12345678910,
      status: 1,
    },
    {
      id: 12345678911,
      menuName: "Thanh công cụ",
      orderBy: 2,
      url: "/menu",
      icon: "",
      parentId: 12345678910,
      status: 1,
    },
    {
      id: 12345678912,
      menuName: "Tài khoản - Phân quyền",
      orderBy: 2,
      url: "/",
      icon: "fas fa-users-cog",
      parentId: null,
      status: 1,
    },
    {
      id: 12345678913,
      menuName: "Nhóm tài khoản",
      orderBy: 1,
      url: "/user-group",
      icon: "",
      parentId: 12345678912,
      status: 1,
    },
    {
      id: 12345678920,
      menuName: "Tài khoản",
      orderBy: 2,
      url: "/user",
      icon: "",
      parentId: 12345678912,
      status: 1,
    },
    {
      id: 78459841259,
      menuName: "Danh mục chung",
      orderBy: 9,
      url: "/",
      icon: "fa fa-globe-asia",
      parentId: null,
      status: 1,
    },
    {
      id: 8495245694,
      menuName: "Phương thức thanh toán",
      orderBy: 1,
      url: "/payment-method",
      icon: "",
      parentId: 78459841259,
      status: 1,
    },
    {
      id: 423657912,
      menuName: "Quản lý Tỉnh/Thành phố",
      orderBy: 2,
      url: "/province",
      icon: "",
      parentId: 78459841259,
      status: 1,
    },
    {
      id: 479625893,
      menuName: "Quản lý Quận/Huyện",
      orderBy: 3,
      url: "/district",
      icon: "",
      parentId: 78459841259,
      status: 1,
    },
    {
      id: 1485236970,
      menuName: "Quản lý Xã/Phường",
      orderBy: 4,
      url: "/ward",
      icon: "",
      parentId: 78459841259,
      status: 1,
    },
    {
      id: 4785921450,
      menuName: "Quản lý CSYT",
      orderBy: 10,
      url: "/",
      icon: "fa fa-book-medical",
      parentId: null,
      status: 1,
    },
    {
      id: 1903649530,
      menuName: "Quản lý nhóm cơ sở y tế",
      orderBy: 1,
      url: "/medical-facility-group",
      icon: "",
      parentId: 4785921450,
      status: 1,
    },
    {
      id: 7821496253,
      menuName: "Quản lý cơ sở y tế",
      orderBy: 2,
      url: "/health-facility",
      icon: "",
      parentId: 4785921450,
      status: 1,
    },
    {
      id: 9863172019,
      menuName: "Quản lý cơ sở khám bệnh",
      orderBy: 3,
      url: "/medical-facility",
      icon: "",
      parentId: 4785921450,
      status: 1,
    },
    {
      id: 8963247820,
      menuName: "Quản lý chuyên khoa",
      orderBy: 4,
      url: "/specialist",
      icon: "",
      parentId: 4785921450,
      status: 1,
    },
    {
      id: 9874523641,
      menuName: "Quản lý địa điểm",
      orderBy: 5,
      url: "/place",
      icon: "",
      parentId: 4785921450,
      status: 1,
    },
    {
      id: 1722921550,
      menuName: "Nhà CC - Sản xuất - Khách hàng",
      orderBy: 4,
      url: "/",
      icon: "fa fa-shipping-fast",
      parentId: null,
      status: 1,
    },
    {
      id: 3122324551,
      menuName: "Quản lý nhóm nhà cung cấp",
      orderBy: 1,
      url: "/supplier-group",
      icon: "",
      parentId: 1722921550,
      status: 1,
    },
    {
      id: 1672322519,
      menuName: "Quản lý nhà cung cấp",
      orderBy: 2,
      url: "/supplier",
      icon: "",
      parentId: 1722921550,
      status: 1,
    },
    {
      id: 82141571521,
      menuName: "Quản lý nhóm nhà sản xuất",
      orderBy: 3,
      url: "/producer-group",
      icon: "",
      parentId: 1722921550,
      status: 1,
    },
    {
      id: 9574123059,
      menuName: "Quản lý nhà sản xuất",
      orderBy: 4,
      url: "/producer",
      icon: "",
      parentId: 1722921550,
      status: 1,
    },
    {
      id: 1578620368,
      menuName: "Quản lý nhóm khách hàng",
      orderBy: 5,
      url: "/customer-group",
      icon: "",
      parentId: 1722921550,
      status: 1,
    },
    {
      id: 7485963210,
      menuName: "Quản lý khách hàng",
      orderBy: 6,
      url: "/customer",
      icon: "",
      parentId: 1722921550,
      status: 1,
    },
    {
      id: 8974512578,
      menuName: "QL Danh mục",
      orderBy: 5,
      url: "/",
      icon: "fa fa-book",
      parentId: null,
      status: 1,
    },
    {
      id: 4125963420,
      menuName: "NT - Quản lý thuốc",
      orderBy: 1,
      url: "/nt-medicine",
      icon: "",
      parentId: 8974512578,
      status: 1,
    },
    {
      id: 1245893205,
      menuName: "NT - Quản lý vị trí thuốc",
      orderBy: 2,
      url: "/nt-medicine-position",
      icon: "",
      parentId: 8974512578,
      status: 1,
    },
    {
      id: 6179563250,
      menuName: "NT - Quản lý loại thuốc",
      orderBy: 3,
      url: "/nt-medicine-type",
      icon: "",
      parentId: 8974512578,
      status: 1,
    },
    {
      id: 1452369752,
      menuName: "NT - Quản lý quy cách bào chế",
      orderBy: 4,
      url: "/nt-apothecary",
      icon: "",
      parentId: 8974512578,
      status: 1,
    },
    {
      id: 5896324862,
      menuName: "NT - Quản lý quy cách đóng gói",
      orderBy: 5,
      url: "/nt-package",
      icon: "",
      parentId: 8974512578,
      status: 1,
    },
    {
      id: 5896321456,
      menuName: "NT - Quản lý đơn vị tính",
      orderBy: 6,
      url: "/nt-unit",
      icon: "",
      parentId: 8974512578,
      status: 1,
    },
    {
      id: 7485621203,
      menuName: "PK - Quản lý gói dịch vụ",
      orderBy: 7,
      url: "/clinic-service-package",
      icon: "",
      parentId: 8974512578,
      status: 1,
    },
    {
      id: 9654120201,
      menuName: "PK - Quản lý dịch vụ",
      orderBy: 8,
      url: "/clinic-service",
      icon: "",
      parentId: 8974512578,
      status: 1,
    },
    {
      id: 9845120123,
      menuName: "Quản lý kho",
      orderBy: 15,
      url: "/warehouse",
      icon: "",
      parentId: 8974512578,
      status: 1,
    },
    {
      id: 4786120325,
      menuName: "Quản lý mẫu in",
      orderBy: 16,
      url: "/print-form",
      icon: "",
      parentId: 8974512578,
      status: 1,
    },
  ]);
  db.userGroupRole.bulkCreate([
    {
      id: 12345678916,
      menuName: "Hệ thống",
      menuParentId: null,
      userGroupId: 12345678910,
      menuId: 12345678910,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 12345678925,
      menuName: "Cấu hình hệ thống",
      menuParentId: 12345678910,
      userGroupId: 12345678910,
      menuId: 12345678945,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 12345678917,
      menuName: "Thanh công cụ",
      menuParentId: 12345678910,
      userGroupId: 12345678910,
      menuId: 12345678911,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 12345678918,
      menuName: "Tài khoản - Phân quyền",
      menuParentId: null,
      userGroupId: 12345678910,
      menuId: 12345678912,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 12345678919,
      menuName: "Nhóm tài khoản",
      menuParentId: 12345678912,
      userGroupId: 12345678910,
      menuId: 12345678913,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 12345678930,
      menuName: "Tài khoản",
      menuParentId: 12345678912,
      userGroupId: 12345678910,
      menuId: 12345678920,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 7895126478,
      menuName: "Danh mục chung",
      menuParentId: null,
      userGroupId: 12345678910,
      menuId: 78459841259,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 1478965239,
      menuName: "Phương thức thanh toán",
      menuParentId: 78459841259,
      userGroupId: 12345678910,
      menuId: 8495245694,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 7589632489,
      menuName: "Quản lý Tỉnh/Thành phố",
      menuParentId: 78459841259,
      userGroupId: 12345678910,
      menuId: 423657912,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 6325478963,
      menuName: "Quản lý Quận/Huyện",
      menuParentId: 78459841259,
      userGroupId: 12345678910,
      menuId: 479625893,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 2496478536,
      menuName: "Quản lý Xã/Phường",
      menuParentId: 78459841259,
      userGroupId: 12345678910,
      menuId: 1485236970,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 8745963218,
      menuName: "Quản lý CSYT",
      menuParentId: null,
      userGroupId: 12345678910,
      menuId: 4785921450,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 6547820153,
      menuName: "Quản lý nhóm cơ sở y tế",
      menuParentId: 4785921450,
      userGroupId: 12345678910,
      menuId: 1903649530,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 2015896541,
      menuName: "Quản lý cơ sở y tế",
      menuParentId: 4785921450,
      userGroupId: 12345678910,
      menuId: 7821496253,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 9841203650,
      menuName: "Quản lý cơ sở khám bệnh",
      menuParentId: 4785921450,
      userGroupId: 12345678910,
      menuId: 9863172019,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 4785125963,
      menuName: "Quản lý chuyên khoa",
      menuParentId: 4785921450,
      userGroupId: 12345678910,
      menuId: 8963247820,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 98421502685,
      menuName: "Quản lý địa điểm",
      menuParentId: 4785921450,
      userGroupId: 12345678910,
      menuId: 9874523641,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 2721956218,
      menuName: "Nhà CC - Sản xuất - Khách hàng",
      menuParentId: null,
      userGroupId: 12345678910,
      menuId: 1722921550,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 4785120329,
      menuName: "Quản lý nhóm nhà cung cấp",
      menuParentId: 1722921550,
      userGroupId: 12345678910,
      menuId: 3122324551,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 4581235960,
      menuName: "Quản lý nhà cung cấp",
      menuParentId: 1722921550,
      userGroupId: 12345678910,
      menuId: 1672322519,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 6541785210,
      menuName: "Quản lý nhóm nhà sản xuất",
      menuParentId: 1722921550,
      userGroupId: 12345678910,
      menuId: 82141571521,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 3654710025,
      menuName: "Quản lý nhà sản xuất",
      menuParentId: 1722921550,
      userGroupId: 12345678910,
      menuId: 9574123059,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 3201452789,
      menuName: "Quản lý nhóm khách hàng",
      menuParentId: 1722921550,
      userGroupId: 12345678910,
      menuId: 1578620368,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 2021452036,
      menuName: "Quản lý khách hàng",
      menuParentId: 1722921550,
      userGroupId: 12345678910,
      menuId: 7485963210,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 4123698523,
      menuName: "QL Danh mục",
      menuParentId: null,
      userGroupId: 12345678910,
      menuId: 8974512578,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 3052146983,
      menuName: "NT - Quản lý thuốc",
      menuParentId: 8974512578,
      userGroupId: 12345678910,
      menuId: 4125963420,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 2310595028,
      menuName: "NT - Quản lý vị trí thuốc",
      menuParentId: 8974512578,
      userGroupId: 12345678910,
      menuId: 1245893205,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 6412023695,
      menuName: "NT - Quản lý loại thuốc",
      menuParentId: 8974512578,
      userGroupId: 12345678910,
      menuId: 6179563250,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 4203596410,
      menuName: "NT - Quản lý quy cách bào chế",
      menuParentId: 8974512578,
      userGroupId: 12345678910,
      menuId: 1452369752,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 9036974512,
      menuName: "NT - Quản lý quy cách đóng gói",
      menuParentId: 8974512578,
      userGroupId: 12345678910,
      menuId: 5896324862,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 5063247960,
      menuName: "NT - Quản lý đơn vị tính",
      menuParentId: 8974512578,
      userGroupId: 12345678910,
      menuId: 5896321456,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 1114520212,
      menuName: "PK - Quản lý gói dịch vụ",
      menuParentId: 8974512578,
      userGroupId: 12345678910,
      menuId: 7485621203,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 2302012059,
      menuName: "PK - Quản lý dịch vụ",
      menuParentId: 8974512578,
      userGroupId: 12345678910,
      menuId: 9654120201,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 84102365896,
      menuName: "Quản lý kho",
      menuParentId: 8974512578,
      userGroupId: 12345678910,
      menuId: 9845120123,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
    {
      id: 3541051230,
      menuName: "Quản lý mẫu in",
      menuParentId: 8974512578,
      userGroupId: 12345678910,
      menuId: 4786120325,
      isView: true,
      isAdd: true,
      isUpdate: true,
      isDelete: true,
      isBlock: true,
      isApprove: true,
      isReceipts: true,
      isPrescription: true,
      isResult: true,
    },
  ]);
};
const initialDataServer = {
  initialData: initialData,
};
module.exports = initialDataServer;
