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
    return [body("code", "کد نمیتواند خالی یاشد").notEmpty()];
  }
}

module.exports = new AuthValidator();
