const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamp = require("mongoose-timestamp");

const orderSchema = new Schema({
  //   orderItem: [{
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "OrderItem",
  //     required: true,
  //   }],
  idOrder: {type: String},
  text: { type: String },
  confirmationAdmin: { type: Boolean, default: true },
  //کیف پول
  wallet: {type: String},
  //وضعیت
  condition: {type: Boolean},
  discount: {type: Number},
  dateOrdered: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.plugin(timestamp);

module.exports = mongoose.model("Order", orderSchema);