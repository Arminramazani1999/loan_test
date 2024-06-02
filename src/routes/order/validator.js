// const validator = require('./validator');
const { body } = require("express-validator");

class AuthValidator {
  create() {
    return [body("text", "نام نمیتواند خالی باشد").notEmpty()];
  }
  createOrderBay() {
    return [body("amount", "مبلغ نمیتواند خالی باشد").notEmpty()];
  }
}

module.exports = new AuthValidator();
 