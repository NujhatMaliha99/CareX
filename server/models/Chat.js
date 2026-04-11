const mongoose = require("mongoose");
const ChatSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  message:  { type: String, required: true },
  sender:   { type: String, enum: ["user", "doctor"], required: true },
}, { timestamps: true });
 
module.exports = mongoose.model("Chat", ChatSchema);