const mongoose = require("mongoose");
const HabitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  habits: {
    water:      { type: Boolean, default: false },
    sleep:      { type: Boolean, default: false },
    exercise:   { type: Boolean, default: false },
    meditation: { type: Boolean, default: false },
    diet:       { type: Boolean, default: false },
    noscreens:  { type: Boolean, default: false },
    steps:      { type: Boolean, default: false },
    vitamins:   { type: Boolean, default: false },
  },
}, { timestamps: true });
 
module.exports = mongoose.model("Habit", HabitSchema);
 