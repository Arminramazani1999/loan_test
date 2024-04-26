const express = require("express");
const router = express.Router();
const authRouter = require("./auth");
// const orderRouter = require("./order");
const { isLoggined, isAdmin } = require("./../midelweres/auth");
// const error = require("./../midelweres/error");
router.use("/auth", authRouter);
// router.use("/user", isLoggined, userRouter);
// router.use("/admin", isLoggined, isAdmin, adminRouter);
// router.use("/category", categoryRouter);
// router.use("/product", productRouter);
// router.use("/order", orderRouter);


// router.use(error);

module.exports = router;