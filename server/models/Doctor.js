const mongoose = require("mongoose");
const DoctorSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  initials:  { type: String, required: true },
  spec:      { type: String, required: true },       // "MBBS, MD · Cardiologist"
  specialty: { type: String, required: true },        // "Cardiologist"
  location:  { type: String, required: true },
  phone:     { type: String, required: true },
  exp:       { type: String },                        // "10 yrs experience"
  available: { type: Boolean, default: false },
  nextSlot:  { type: String },                        // "Today 4:00 PM"
  avatarBg:  { type: String, default: "#ede9fe" },
  avatarColor: { type: String, default: "#7c3aed" },
  badgeBg:   { type: String, default: "#ede9fe" },
  badgeColor:{ type: String, default: "#7c3aed" },
}, { timestamps: true });
 
module.exports = mongoose.model("Doctor", DoctorSchema);
 