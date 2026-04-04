const mongoose = require("mongoose");

const waterSchema = new mongoose.Schema({
  amount: { type: Number, required: true }, // glasses
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Water", waterSchema);