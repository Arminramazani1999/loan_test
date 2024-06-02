const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamp = require("mongoose-timestamp");

const orderSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  loan: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loan",
      required: true,
    },
  ],
  remainingCredit: { type: Number },
  // کد یکتا
  uniqueCode: { type: String, unique: true },
  text: { type: String },
  confirmationAdmin: { type: Boolean, default: true },
  //کیف پول
  wallet: { type: String },
  //وضعیت
  condition: { type: Boolean, default: false },
  //امضای قرارداد
  signetContract: { type: String },

  //                      ==================Date All=============
  //تاریخ دریافت
  receivingDate: { type: Date },
  //تاریخ پرداخت اقساط
  installmentPayDate: { type: Date },
  //تاریخ پرداخت کل
  paymentDate: { type: Date },
  dateOrdered: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.plugin(timestamp);

module.exports = mongoose.model("Order", orderSchema, "Order");
