const express = require("express");
const router = express.Router();
const controller = require("./controller");
const validator = require("./validator");
const {
  isLoggined,
  isAdmin,
  firstRegister,
  orderUser,
} = require("../../midelweres/auth");

// create
router.post(
  "/create",
  orderUser,
  validator.createOrderBay(),
  controller.validate,
  controller.create
);

// update
// router.put("/:id", controller.update);
// totalsales
// router.get("/get/totalsales", controller.getTotalSales);
// count
router.get("/get/count", controller.getCount);
// get user order
router.get("/get/userorders/:id", controller.getUserOrders);

//--------all_user------
// all
router.get("/", controller.getAll);
// see one
router.get("/:id", controller.seeOne);
//--------my------
// delete
router.delete("/:id", controller.delete);

module.exports = router;
