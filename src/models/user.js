const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamp = require("mongoose-timestamp");
// create model
const userSchema = new Schema({
  name: { type: String },
  // img: { type: String, },
  id_code:{type: Number, require:true, unique: true},
  phone: {type: Number, required: true, unique: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  //پرداخت اولیه
  firstIsPayd: {type: Boolean, default: false},
  isadmin: { type: Boolean, default: false },
});

userSchema.plugin(timestamp);

module.exports = mongoose.model("User", userSchema, "User");