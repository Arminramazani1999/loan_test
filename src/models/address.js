const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamp = require("mongoose-timestamp");
// create model
const addressSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  //استان
  State: { type: String, require: true },
  city: { type: String, require: true },
  address: { type: String, require: true },
  //ادرس ساختمان : پلاک-طبقه
  addressBuilding: { type: String, require: true },
  //کدپستی
  PostalCode: { type: Number, required: true },
});

addressSchema.plugin(timestamp);

module.exports = mongoose.model("Adrress", addressSchema, "Adrress");
