const mongoose = require("mongoose");
const SymptomSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  symptom:  { type: String, required: true, trim: true },
  aiResult: { type: String, default: "" },
}, { timestamps: true });
 
module.exports = mongoose.model("Symptom", SymptomSchema);