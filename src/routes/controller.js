const autoBindI = require("auto-bind-inheritance");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const Order = require("../models/order");

class Controller {
  constructor() {
    autoBindI(this);
    this.User = User;
  }
  validationBody(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const errors = result.array().map((err) => err.msg);
      res.status(400).json({
        message: "validation error",
        data: errors,
      });
    }
  }
  validate(req, res, next) {
    if (this.validationBody(req, res)) {
      return;
    }
    next();
  }

  response({ res, message, code = 200, data = {} }) {
    res.status(code).json({
      message,
      data,
    });
  }
}

module.exports = Controller;