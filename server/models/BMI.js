const mongoose = require("mongoose");
 
const BMISchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  bmi:    { type: Number, required: true },
}, { timestamps: true });
 
module.exports = mongoose.model("BMI", BMISchema);