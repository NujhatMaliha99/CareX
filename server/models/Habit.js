const mongoose = require("mongoose");

const HabitSchema  = new mongoose.Schema({
  water: { type: Boolean, default: false },
  sleep: { type: Boolean, default: false },
  exercise: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Habit", HabitSchema);