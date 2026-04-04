const mongoose = require("mongoose");

const symptomSchema = new mongoose.Schema({
  symptom: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Symptom", symptomSchema);