const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamp = require("mongoose-timestamp");
// create model
const loanSchema = new Schema({
  // name: { type: String },
  amount: { type: Number },
  // numberInstallment: {type: String},
  // percentM: {type: Number},
  // percentJ: {type: Number},
});

loanSchema.plugin(timestamp);

module.exports = mongoose.model("Loan", loanSchema, "Loan");