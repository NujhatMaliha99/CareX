const mongoose = require("mongoose");
const WaterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  water:  { type: Number, required: true, min: 0 },
  date:   { type: Date, default: Date.now },
}, { timestamps: true });
 
module.exports = mongoose.model("Water", WaterSchema);
 