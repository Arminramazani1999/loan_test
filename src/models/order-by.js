const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamp = require("mongoose-timestamp");

const orderBySchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  debtAmount: { type: Number },
  priceBy: { type: Number, default: 0 },
  uniqueCode: { type: Number },
  statusOrderBy: { type: Boolean, default: false },
  sumPrice: { type: Number },
  //                      ==================Date All=============
  //تاریخ دریافت
  receivingDate: { type: Date },
  //تاریخ پرداخت اقساط
  // installmentPayDate: { type: Date },
  //تاریخ پرداخت کل
  paymentDate: { type: Date },
  //اسم فروشگاه و کدسفارش===============******************* 
});

orderBySchema.plugin(timestamp);

module.exports = mongoose.model("OrderBuy", orderBySchema, "OrderBuy");
