const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamp = require("mongoose-timestamp");

const depositList = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  price: { type: Number },
  //واریزی
  deposit: { type: Number},
  uniqueCode: { type: Number },
  // statusOrderBy: { type: Boolean, default: false },
  sumPrice: { type: Number },
});

depositList.plugin(timestamp);

module.exports = mongoose.model("DepositList", depositList, "DepositList");
