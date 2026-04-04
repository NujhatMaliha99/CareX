import "./PhysicalHealth.css";
import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../api"; 
import {
  FaRunning, FaUtensils, FaTint,
  FaClipboardCheck, FaChartLine,
  FaAmbulance, FaStethoscope, FaWeight, FaHeart,
  FaDumbbell, FaFire, FaHeartbeat
} from "react-icons/fa";

const Health = ({ user, handleLogout }) => {

  // ===== SCROLL =====
  const sections = {
    bmi: useRef(null),
    habit: useRef(null),
    workout: useRef(null),
    diet: useRef(null),
    symptom: useRef(null),
    progress: useRef(null),
    water: useRef(null),
    emergency: useRef(null),
    doctor: useRef(null),
  };

  const scrollTo = (key) => {
    sections[key].current.scrollIntoView({ behavior: "smooth" });
  };

  // ===== BMI =====
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState("");

  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (!w || !h) return;
    setBmi((w / (h * h)).toFixed(2));
  };

  const saveBMI = async () => {
    try {
      if (!weight || !height || !bmi) return;
      await API.post("/bmi", { weight, height, bmi });
      alert("BMI saved to backend!");
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // ===== HABITS =====
  const [habits, setHabits] = useState({
    water: false,
    sleep: false,
    exercise: false,
  });

  const saveHabits = async () => {
    try {
      await API.post("/habits", habits);
      alert("Habits saved!");
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const toggleHabit = (key) => {
    setHabits({ ...habits, [key]: !habits[key] });
  };

  // ===== WORKOUT =====
  const workouts = [
    { name: "Chest", icon: <FaDumbbell /> },
    { name: "Legs", icon: <FaRunning /> },
    { name: "Abs", icon: <FaFire /> },
    { name: "Full Body", icon: <FaHeartbeat /> },
  ];
  const [selectedWorkout, setSelectedWorkout] = useState("");

  // ===== NUTRITION =====
  const [foodInput, setFoodInput] = useState("");
  const [foodCalories, setFoodCalories] = useState("");

  const calorieDB = {
    rice: 200,
    chicken: 250,
    egg: 70,
    burger: 500,
    pizza: 600,
    apple: 80,
    banana: 100
  };

  const handleFoodInput = (val) => {
    setFoodInput(val);
    const cleaned = val.trim().toLowerCase();
    setFoodCalories(calorieDB[cleaned] || "Not found");
  };

  const meals = [
    { name: "Rice & Chicken", calories: 450 },
    { name: "Salad", calories: 200 },
    { name: "Smoothie", calories: 180 },
  ];
  const [calories, setCalories] = useState(1200);
  const goal = 2000;

  // ===== SYMPTOMS =====
  const [symptoms, setSymptoms] = useState([]);
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const symptomDB = {
    fever: "Possible infection",
    cough: "Cold or flu",
    headache: "Stress or dehydration",
    chestpain: "Heart issue (consult doctor)"
  };

  const addSymptomAPI = async (symptom) => {
    try {
      await API.post("/symptoms", { symptom });

      setSymptoms(prev => [...prev, symptom]);

      const key = symptom.trim().toLowerCase().replace(/\s+/g, "");
      setResult(symptomDB[key] || "No data available");

      setInput("");
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const addSymptom = () => {
    if (input) addSymptomAPI(input);
  };

  // ===== WATER =====
  const [water, setWater] = useState(0);
  const [waterGoal, setWaterGoal] = useState(8);
  const [reminderOn, setReminderOn] = useState(false);

  const saveWater = async (newWater) => {
    try {
      await API.post("/water", { water: newWater });
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (!reminderOn) return;

    const interval = setInterval(() => {
      alert("💧 Drink Water!");
    }, 5000); // testing

    return () => clearInterval(interval);
  }, [reminderOn]);

  // ===== DOCTOR =====
  const doctors = [
    { name: "Dr. Rahman", type: "Cardiologist", location: "Dhaka" },
    { name: "Dr. Akter", type: "General", location: "Chittagong" },
  ];

  // ===== CARDS =====
  const cards = [
    { id: "bmi", title: "BMI", icon: <FaWeight color="#6c8cff" /> },
    { id: "habit", title: "Habits", icon: <FaClipboardCheck color="#00b894" /> },
    { id: "workout", title: "Workout", icon: <FaRunning color="#fd9644" /> },
    { id: "diet", title: "Nutrition", icon: <FaUtensils color="#e84393" /> },
    { id: "symptom", title: "Symptoms", icon: <FaHeart color="#ff6b6b" /> },
    { id: "progress", title: "Progress", icon: <FaChartLine color="#6c5ce7" /> },
    { id: "water", title: "Water", icon: <FaTint color="#00a8ff" /> },
    { id: "emergency", title: "Emergency", icon: <FaAmbulance color="#d63031" /> },
    { id: "doctor", title: "Doctor", icon: <FaStethoscope color="#2d3436" /> },
  ];

  return (
    <div className="health-page">
      <Navbar user={user} handleLogout={handleLogout} />

      <div className="container">

        <div className="topbar">
          <h2>Hello, {user?.name || "User"} 👋</h2>
          <input placeholder="Search..." />
        </div>

        <div className="dashboard">
          <div className="grid">
            {cards.map((c) => (
              <div key={c.id} className="dash-card" onClick={() => scrollTo(c.id)}>
                <div className="icon">{c.icon}</div>
                <h3>{c.title}</h3>
              </div>
            ))}
          </div>

          <div className="highlight">
            <h3>Stay Healthy 💙</h3>
            <p>Track everything in one place</p>
            <button className="btn" onClick={() => scrollTo("bmi")}>Explore</button>
          </div>
        </div>

        {/* ===== BMI ===== */}
        <div ref={sections.bmi} className="section">
          <h2>BMI</h2>
          <input className="input" placeholder="Weight (kg)" value={weight} onChange={(e)=>setWeight(e.target.value)} />
          <input className="input" placeholder="Height (cm)" value={height} onChange={(e)=>setHeight(e.target.value)} />
          <button className="btn" onClick={() => { calculateBMI(); saveBMI(); }}>
             Calculate
           </button>
          {bmi && <p>Result: {bmi}</p>}
        </div>

        {/* ===== HABITS ===== */}
        <div className="section">
          <h2>Habits</h2>
          {Object.keys(habits).map((h)=>(
            <div key={h} className={`habit ${habits[h] ? "active" : ""}`} onClick={()=>toggleHabit(h)}>
              {h}
            </div>
          ))}
          <button className="btn" onClick={saveHabits}>Save Habits</button>
        </div>

        {/* ===== WORKOUT ===== */}
        <div ref={sections.workout} className="section">
          <h2>Workout</h2>
          <div className="workout-scroll">
            {workouts.map((w) => (
              <div key={w.name} className={`workout-card ${selectedWorkout === w.name && "active"}`} onClick={() => setSelectedWorkout(w.name)}>
                <div className="workout-icon">{w.icon}</div>
                <p>{w.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ===== NUTRITION ===== */}
        <div ref={sections.diet} className="section">
          <h2>Nutrition</h2>

          <input
            placeholder="Enter food (e.g. rice, egg)"
            value={foodInput}
            onChange={(e)=>handleFoodInput(e.target.value)}
          />

          {foodCalories !== "" && (
            <p className="calorie-text">
    Calories: {foodCalories}
  </p>
          )}

          <div className="progress-box">
            <p>{calories} / {goal} kcal</p>
            <div className="progress-bar">
              <div style={{ width: `${(calories / goal) * 100}%` }}></div>
            </div>
          </div>

          {meals.map((m, i) => (
            <p key={i}>{m.name} - {m.calories} kcal</p>
          ))}
        </div>

        {/* ===== SYMPTOMS ===== */}
        <div ref={sections.symptom} className="section">
          <h2>Symptoms</h2>
          <div className="chips">
            {symptoms.map((s, i) => (
              <span key={i} className="chip">{s}</span>
            ))}
          </div>

          <div className="input-row">
            <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Add symptom" />
            <button className="btn" onClick={addSymptom}>Add</button>
          </div>

          {result && <p>Possible Result: {result}</p>}
        </div>

        {/* ===== WATER ===== */}
        <div ref={sections.water} className="section">
          <h2>Water</h2>

          <input
            type="number"
            placeholder="Set daily goal"
            value={waterGoal}
            onChange={(e)=>setWaterGoal(e.target.value)}
          />

          <p>{water} / {waterGoal} glasses</p>

          <button className="btn" onClick={() => { 
            const newWater = water + 1;
            setWater(newWater); 
            saveWater(newWater);
          }}>
            Add
          </button>

          {/* ✅ FIXED BUTTON */}
          <button className="btn" onClick={() => setReminderOn(!reminderOn)}>
            {reminderOn ? "Stop Reminder" : "Start Reminder"}
          </button>

        </div>

        {/* ===== EMERGENCY ===== */}
        <div ref={sections.emergency} className="section">
          <h2>Emergency</h2>
          <ul>
            <li>Fever → Paracetamol</li>
            <li>Poison → Hydrate</li>
          </ul>

          <a href="tel:999">
            <button className="btn">🚑 Call 999</button>
          </a>
        </div>

        {/* ===== DOCTOR ===== */}
        <div ref={sections.doctor} className="section">
          <h2>Doctors</h2>
          {doctors.map((d,i)=>(
            <div key={i} className="doctor">
              <b>{d.name}</b>
              <p>{d.type} - {d.location}</p>
              <button className="btn">Book</button>
            </div>
          ))}
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default Health;