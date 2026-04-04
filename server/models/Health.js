const mongoose = require("mongoose");

const HealthSchema = new mongoose.Schema({
  type: { type: String, required: true }, // bmi / symptom / water
  value: { type: mongoose.Schema.Types.Mixed, required: true }, // any type
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Health", HealthSchema);