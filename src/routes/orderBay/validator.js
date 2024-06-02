// const validator = require('./validator');
const { body } = require("express-validator");

class AuthValidator {
  create() {
    return [body("price", "قیمت نمیتواند خالی باشد").notEmpty()];
  }
  createOrderBay() {
    return [body("total", "قیمت نمیتواند خالی باشد").notEmpty()];
  }
}

module.exports = new AuthValidator();
