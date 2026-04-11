const mongoose = require("mongoose");
const BookingSchema = new mongoose.Schema({
  userId:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  doctorId:      { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  doctorName:    { type: String },
  preferredDate: { type: Date },
  note:          { type: String, default: "" },
  status:        { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
}, { timestamps: true });
 
module.exports = mongoose.model("Booking", BookingSchema);