
const OrderBay = require("../models/order-by");


async function totalDebt(req, res,next) {
  let user = req.user;
  let totaldebt = 0;
  let orderBay = await OrderBay.find({ user: user.id, statusOrderBy: false });
  //  خریدهایی که بدهی دارند
  orderBay.map((orderBayTemp) => {
    totaldebt = orderBayTemp.debtAmount + totaldebt;
    // console.log("BY2", orderBayTemp.statusOrderBy, orderBayTemp.debtAmount);
  });
  if (totaldebt == 0) {
    if (!user.debtStatus || !user.checkDueDatesUser) {
      user.debtStatus = true;
      user.checkDueDatesUser = true;
      user.isCreditActive = true;
    }
  }
  user.debt = totaldebt;
  await user.save();
  next();
}

module.exports = {
    totalDebt,
}