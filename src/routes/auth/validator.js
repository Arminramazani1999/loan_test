// const validator = require('./validator');
const { body } = require("express-validator");

class AuthValidator {
  getPhone() {
    return [
      // body('phone', 'شماره موبایل پر نیست').notEmpty(),
      body("phone1", "شماره موبایل صحیح نیست").isLength({ min: 11 }),
    ];
  }
  getCode() {
    return [body("otp", "کد نمیتواند خالی یاشد").notEmpty()];
  }

  ColleagueRegisterLegal() {
    return [
      body("name", "نام نمیتواند خالی باشد").notEmpty(),
      body("phone2", "شماره موبایل صحیح نیست").isLength({ min: 11 }),
      body("nationalId", "کدملی نمی تواند خالی باشد").notEmpty(),
      body("companyName", "کدملی نمی تواند خالی باشد").notEmpty(),
      body("roleCode", "کدملی نمی تواند خالی باشد").notEmpty(),
      body("email", "کدملی نمی تواند خالی باشد").notEmpty(),
      body("landlinephone", "کدملی نمی تواند خالی باشد").notEmpty(),
      body("sellingType", "کدملی نمی تواند خالی باشد").notEmpty(),
      body("state", "کدملی نمی تواند خالی باشد").notEmpty(),
      body("city", "کدملی نمی تواند خالی باشد").notEmpty(),
      body("companyType", "کدملی نمی تواند خالی باشد").notEmpty(),
      body("ownershipTyoe", "کدملی نمی تواند خالی باشد").notEmpty(),
      body("address", "کدملی نمی تواند خالی باشد").notEmpty(),
      body("postalCode", "کدملی نمی تواند خالی باشد").notEmpty(),
      body("addressBuilding", "کدملی نمی تواند خالی باشد").notEmpty(),
    ];
  }
  register() {
    return [
      body("name", "نام نمیتواند خالی باشد").notEmpty(), //not().Empty()
      // body("phone1", "شماره موبایل صحیح نیست").isLength({ min: 11 }),
      body("phone2", "شماره موبایل صحیح نیست").isLength({ min: 11 }),
      body("nationalCode", "کدملی نمی تواند خالی باشد").notEmpty(),
      // body("birthday", "تاریخ تولد تمی تواند خالی باشد").notEmpty(),
    ];
  }
  registerAuth() {
    return [
      body("fullName", "نام نمیتواند خالی باشد").notEmpty(), //not().Empty()
      body("birthDay", "تاریخ تولد نمیتواند خالی باشد").notEmpty(), //not().Empty()
      body("phone1", "شماره موبایل صحیح نیست").isLength({ min: 11 }),
      // body("phone2", "شماره موبایل صحیح نیست").isLength({ min: 11 }),
      body("state", "استان نمی تواند خالی باشد").notEmpty(),
      body("city", "شهر نمی تواند خالی باشد").notEmpty(),
      body("address", "آدرس نمی تواند خالی باشد").notEmpty(),
      body("addressBuilding", "طبقه-پلاک-واحد نمی تواند خالی باشد").notEmpty(),
      body("PostalCode", "کدپستی نمی تواند خالی باشد").notEmpty(),
      // body("email", "ایمیل اشتباه است").isEmail(),
      body("password", "پسورد صحیح نیست").isLength({ min: 4 }), // body('phone', 'شماره موبایل صحیح نیست').isLength({ min: 11 })
    ];
  }

  login() {
    return [
      // body("email", "ایمیل اشتباه است").isEmail(),
      body("password", "پسورد صحیح نیست").isLength({ min: 4 }), // body('phone', 'شماره موبایل صحیح نیست').isLength({ min: 11 })
    ];
  }
}

module.exports = new AuthValidator();
