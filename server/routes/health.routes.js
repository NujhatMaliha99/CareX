const express = require("express");
const router = express.Router();

const BMI = require("../models/BMI");
const Symptom = require("../models/symptoms");
const Water = require("../models/water");
const Habit = require("../models/Habit");

// BMI save
router.post("/bmi", async (req, res) => {
  try {
    const { weight, height, bmi } = req.body;
    const newBMI = await BMI.create({ weight, height, bmi });
    //await newBMI.save();
    res.json({ success: true, bmi: newBMI });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Symptoms save
router.post("/symptoms", async (req, res) => {
  try {
    const { symptom } = req.body;
    const newSymptom = await Symptom.create({ symptom });
    //await newSymptom.save();
    res.json({ success: true, symptom: newSymptom });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Water save
router.post("/water", async (req, res) => {
  try {
    const { water } = req.body;
    const newWater = await Water.create({ amount: water });
    //await newWater.save();
    res.json({ success: true, water: newWater });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Habits save
router.post("/habits", async (req, res) => {
  try {
    const habitData = req.body;
    const newHabit = await Habit.create(habitData);
    //await newHabit.save();
    res.json({ success: true, habit: newHabit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;