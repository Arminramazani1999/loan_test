const express = require("express");
const router = express.Router();
const validator = require("./validator");
const { farnaaPayUserStatus, isLoggined } = require("../../midelweres/auth");
const controller = require("./controller");

// otp 1 =============== get phone
router.post(
  "/getPhoneFarnaaPay",
  validator.getPhone(),
  controller.validate,
  controller.getPhone
);

// otp 2 ================== auth sms verificationCodeInput
router.post(
  "/verificationCodeInputFarnaaPay",
  validator.getCode(),
  controller.validate,
  controller.verificationCodeInput
);

//farnaaPay
router.post(
  "/farnaaPay",
  isLoggined,
  farnaaPayUserStatus,
  controller.checkDueDates,
  controller.pay
);

module.exports = router;
