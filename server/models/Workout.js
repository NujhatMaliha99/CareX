const mongoose = require("mongoose");
const WorkoutSchema = new mongoose.Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  type:           { type: String, required: true },  // "chest" | "legs" | "abs" | "fullbody"
  name:           { type: String, required: true },
  duration:       { type: Number },                  // seconds elapsed
  exercisesDone:  { type: Number, default: 0 },
  totalExercises: { type: Number, default: 0 },
  caloriesBurned: { type: Number, default: 0 },
}, { timestamps: true });
 
module.exports = mongoose.model("Workout", WorkoutSchema);