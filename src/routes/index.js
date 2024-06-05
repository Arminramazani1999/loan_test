const express = require("express");
const router = express.Router();
const authRouter = require("./auth");
const adminRouter = require("./admin");
const userRouter = require("./user");
const orderRouter = require("./order");
const orderBayRouter = require("./orderBay");
const loanRouter = require("./loan");
const farnaaPayRouter = require("./farnaaPay");
const {
  isLoggined,
  isAdmin,
  firstRegisterStatus,
} = require("./../midelweres/auth");
const error = require("./../midelweres/error");

router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/profile", isLoggined, userRouter);
// router.use("/admin", isLoggined, isAdmin, adminRouter);
// router.use("/category", categoryRouter);
router.use("/loan", loanRouter);
router.use("/order", isLoggined, firstRegisterStatus, orderRouter);
router.use("/orderBay", isLoggined, firstRegisterStatus, orderBayRouter);
router.use("/farnnaPay", farnaaPayRouter);

router.use(error);

module.exports = router;
