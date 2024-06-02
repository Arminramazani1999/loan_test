const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamp = require("mongoose-timestamp");
const moment = require("moment-timezone");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);
// create model
const userSchema = new Schema({
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  img: { type: String },
  phone1: { type: String, unique: true },
  phone2: { type: String, unique: true, default: null },
  phoneToBy: { type: String, unique: true, default: null },
  email: { type: String, unique: true, default: null },
  password: { type: String },
  birthday: { type: String, default: null },
  job: { type: String },
  verificationCode: { type: String },
  verificationDate: { type: Date },
  nationalCode: { type: String, default: null }, // کد ملی
  nationalCodeToBy: { type: String, default: null }, // کد ملی مسول خرید
  orderUser: { type: Boolean, default: false },
  orderBayUser: { type: Boolean, default: true },
  contractDate: { type: Date }, //تاریخ قرارداد
  firstRegister: { type: Boolean, default: false }, //ثبت نام اولیه
  loanCeiling: { type: Number, default: null }, // سقف وام
  credit: { type: Number, default: 0 }, //اعتبار
  //=======================
  Colleague: { type: Boolean, default: false }, // همکار
  genuine: { type: Boolean, default: false }, // حقیقی
  roleCode: { type: String, default: null }, // کدنقش
  tradeId: { type: String, default: null }, // شناسه صنفی
  sellingType: { type: String, default: null }, // نوع فروش
  landlinephone: { type: String, unique: true, default: null }, //تلفن ثابت

  legal: { type: Boolean, default: false }, // حقوقی
  companyName: { type: String, default: null },
  nationalId: { type: String, default: null },
  landlinePhone: { type: String, default: null },
  companyType: { type: String, default: null },
  ownershipTyoe: { type: String, default: null },

  creditAuth: { type: Boolean, default: false }, // برای اینکه اعتبار سنجی چک شود

  auth: { type: Boolean, default: false }, // برای اینکه یک بار اعتبار سنجی بشود
  //======================== Status start
  firstRegisterStatus: { type: Boolean, default: false },
  creditStatus: { type: Boolean, default: false },
  debtStatus: { type: Boolean, default: true }, // وضعیت بدهی
  authStatus: { type: Boolean, default: false }, //وضعیت احراز هویت
  //وضعیت اعتبار=======*****
  isCreditActive: { type: Boolean, default: true },
  permanentCreditStatus: { type: Boolean, default: true }, //وضعیت اعتبار=======  داءم           *****
  temporaryCreditStatus: { type: Boolean, default: true }, //وضعیت اعتبار=======  موقت           *****
  farnaaPayUserStatus: { type: Boolean, default: false },
  //======================== Status end
  checkDueDatesUser: { type: Boolean, default: true }, // چک کردن شرایط خربد
  temporaryDepositSum: { type: Number, default: 0 },

  debt: { type: Number, default: 0 }, // بدهی
  isAdmin: { type: Boolean, default: false },
  //========================address
  state: { type: String, default: null },
  city: { type: String, default: null },
  address: { type: String, default: null },
  addressBuilding: { type: String, default: null }, // //ادرس ساختمان : پلاک-طبقه
  postalCode: { type: Number, default: null }, //کدپستی

  Description: { type: String, default: null },

  // createdAt: { type: Date, default: () => dayjs().tz("Asia/Tehran").toDate() },
  // updatedAt: { type: Date, default: () => dayjs().tz("Asia/Tehran").toDate() },
});

userSchema.plugin(timestamp);

module.exports = mongoose.model("User", userSchema, "User");


