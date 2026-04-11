const mongoose = require("mongoose");

const MealSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name:     { type: String, required: true },
  calories: { type: Number, required: true },
  protein:  { type: Number, default: 0 },
  carbs:    { type: Number, default: 0 },
  fat:      { type: Number, default: 0 },
  date:     { type: Date, default: Date.now }, // used for partitioning by day
}, { timestamps: true });

module.exports = mongoose.model("Meal", MealSchema);
