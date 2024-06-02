const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { totalDebt } = require("../../utils/utils");

router.post("/user/dashboard", totalDebt, controller.dashboard);
router.post("/user", totalDebt, controller.profile);

router.get("/me", controller.me);

module.exports = router;
