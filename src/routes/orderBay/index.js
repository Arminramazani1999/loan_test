const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { totalDebt } = require("../../utils/utils");

//  create
router.post(
  "/create",
  controller.validate,
  controller.checkDueDates,
  controller.create
);
//  by
router.post("/by", controller.amount);
//  Total const of debt
router.post("/totaldebt", controller.totalDebt);
//==============checkDueDates===========
router.get("/check/duedates", controller.checkDueDates);

// delete
router.delete("/:id", controller.delete);
// update
router.put("/:id", controller.update);
// totalsales
router.get("/get/totalsales", controller.getTotalSales);
// count
router.get("/get/count", controller.getCount);
// get user order
router.get("/get/userorders/:id", controller.getUserOrders);

//--------all_user------
// all
router.get("/", controller.getAll);
// see one
router.get("/:id", controller.seeOne);

module.exports = router;
