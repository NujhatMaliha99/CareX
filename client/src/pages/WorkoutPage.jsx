import "./WorkoutPage.css";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../api";

const workoutData = {
  Chest: {
    emoji:"🏋️", color:"#2563eb", bg:"#eff4ff", border:"#bfdbfe",
    exercises:[
      {name:"Bench Press",           muscle:"Chest, Triceps",  sets:4,reps:12,rest:"60s",icon:"🏋️"},
      {name:"Incline Dumbbell Press",muscle:"Upper Chest",     sets:3,reps:10,rest:"60s",icon:"💪"},
      {name:"Cable Fly",             muscle:"Chest Isolation", sets:3,reps:15,rest:"45s",icon:"🔗"},
      {name:"Push-ups",              muscle:"Chest, Core",     sets:3,reps:20,rest:"30s",icon:"👐"},
      {name:"Dips",                  muscle:"Lower Chest",     sets:3,reps:12,rest:"60s",icon:"⬇️"},
      {name:"Pullovers",             muscle:"Lats, Chest",     sets:3,reps:12,rest:"60s",icon:"🙆"},
    ],
    cal:320, mins:45,
  },
  Legs: {
    emoji:"🦵", color:"#16a34a", bg:"#f0fdf4", border:"#bbf7d0",
    exercises:[
      {name:"Squats",      muscle:"Quads, Glutes",     sets:4,reps:12,rest:"90s",icon:"🏋️"},
      {name:"Leg Press",   muscle:"Quads, Hamstrings", sets:4,reps:15,rest:"60s",icon:"🦵"},
      {name:"Lunges",      muscle:"Glutes, Quads",     sets:3,reps:12,rest:"60s",icon:"🚶"},
      {name:"Leg Curl",    muscle:"Hamstrings",        sets:3,reps:12,rest:"45s",icon:"🦿"},
      {name:"Calf Raises", muscle:"Calves",            sets:4,reps:20,rest:"30s",icon:"👟"},
    ],
    cal:400, mins:50,
  },
  Abs: {
    emoji:"🔥", color:"#ea580c", bg:"#fff7ed", border:"#fed7aa",
    exercises:[
      {name:"Crunches",      muscle:"Upper Abs",sets:4,reps:20,    rest:"30s",icon:"💥"},
      {name:"Plank",         muscle:"Core",     sets:3,reps:"60s", rest:"30s",icon:"🧱"},
      {name:"Leg Raises",    muscle:"Lower Abs",sets:3,reps:15,    rest:"45s",icon:"🦵"},
      {name:"Russian Twist", muscle:"Obliques", sets:3,reps:20,    rest:"30s",icon:"🔄"},
    ],
    cal:150, mins:20,
  },
  "Full Body": {
    emoji:"💪", color:"#7c3aed", bg:"#faf5ff", border:"#e9d5ff",
    exercises:[
      {name:"Deadlift",       muscle:"Back, Glutes",    sets:4,reps:8, rest:"90s",icon:"🏋️"},
      {name:"Pull-ups",       muscle:"Lats, Biceps",    sets:3,reps:10,rest:"60s",icon:"⬆️"},
      {name:"Rows",           muscle:"Mid Back",        sets:3,reps:12,rest:"60s",icon:"🚣"},
      {name:"Overhead Press", muscle:"Shoulders",       sets:3,reps:10,rest:"60s",icon:"☝️"},
      {name:"Squats",         muscle:"Quads, Glutes",   sets:4,reps:12,rest:"60s",icon:"🏋️"},
      {name:"Push-ups",       muscle:"Chest, Triceps",  sets:3,reps:20,rest:"30s",icon:"👐"},
      {name:"Burpees",        muscle:"Full Body, Cardio",sets:3,reps:15,rest:"60s",icon:"💥"},
    ],
    cal:500, mins:60,
  },
};

const WorkoutPage = ({ user, handleLogout }) => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const initialPlan = location.state?.plan || "Chest";

  const [selectedPlan, setSelectedPlan] = useState(
    workoutData[initialPlan] ? initialPlan : "Chest"
  );
  const [sets,      setSets]      = useState({});
  const [started,   setStarted]   = useState(false);
  const [done,      setDone]      = useState(false);
  const [timer,     setTimer]     = useState(0);
  const [timerRef,  setTimerRef]  = useState(null);

  const plan = workoutData[selectedPlan];

  const startWorkout = () => {
    setStarted(true); setDone(false); setSets({});
    // Timer removed as per request
  };

  const finishWorkout = async () => {
    clearInterval(timerRef);
    setDone(true);
    const totalSets = Object.values(sets).flat().filter(Boolean).length;
    try {
      await API.post("/workout/log", {
        plan: selectedPlan,
        setsCompleted: totalSets,
        durationSeconds: timer,
        date: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const toggleSet = (exName, setIdx) => {
    setSets(p => {
      const ex   = plan.exercises.find(e => e.name === exName);
      const curr = p[exName] || Array(ex?.sets || 4).fill(false);
      const upd  = [...curr];
      upd[setIdx] = !upd[setIdx];
      return { ...p, [exName]: upd };
    });
  };

  const resetPlan = (p) => {
    setSelectedPlan(p);
    setStarted(false); setDone(false);
    setSets({}); setTimer(0);
    clearInterval(timerRef);
  };

  const formatTime = (s) =>
    `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const completedSets = Object.values(sets).flat().filter(Boolean).length;
  const totalSets     = plan.exercises.reduce((s, e) => s + e.sets, 0);

  return (
    <div className="workout-page">
      <Navbar user={user} handleLogout={handleLogout} />
      <div className="wo-container">

        <button className="back-btn" onClick={() => navigate("/physical")}>← Back to Health</button>

        {/* HERO */}
        <div className="wo-hero" style={{ background:`linear-gradient(135deg,${plan.color}cc,${plan.color})` }}>
          <div className="wo-hero-inner">
            <div className="wo-hero-emoji">{plan.emoji}</div>
            <div>
              <div className="wo-hero-name">{selectedPlan} Workout</div>
              <div className="wo-hero-sub">{plan.exercises.length} exercises · Est. {plan.mins} min</div>
            </div>
          </div>
        </div>

        {/* PLAN TABS */}
        <div className="plan-tabs">
          {Object.keys(workoutData).map(p => (
            <button key={p}
              className={`plan-tab ${selectedPlan===p?"active":""}`}
              style={selectedPlan===p?{background:workoutData[p].bg,borderColor:workoutData[p].border,color:workoutData[p].color}:{}}
              onClick={() => resetPlan(p)}>
              {workoutData[p].emoji} {p}
            </button>
          ))}
        </div>

        {/* STATS */}
        <div className="plan-stats">
          <div className="plan-stat" style={{background:plan.bg}}>
            <span style={{fontSize:20,fontWeight:600,color:plan.color}}>{plan.exercises.length}</span>
            <span>Exercises</span>
          </div>
          <div className="plan-stat" style={{background:plan.bg}}>
            <span style={{fontSize:20,fontWeight:600,color:plan.color}}>{plan.mins}</span>
            <span>Minutes</span>
          </div>
          <div className="plan-stat" style={{background:plan.bg}}>
            <span style={{fontSize:20,fontWeight:600,color:plan.color}}>{plan.cal}</span>
            <span>Cal burn</span>
          </div>
          <div className="plan-stat" style={{background:plan.bg}}>
            <span style={{fontSize:20,fontWeight:600,color:plan.color}}>{totalSets}</span>
            <span>Total sets</span>
          </div>
        </div>

        {/* PROGRESS */}
        {started && (
          <div className="progress-section">
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#71717a",marginBottom:6}}>
              <span>Progress</span><span>{completedSets} / {totalSets} sets</span>
            </div>
            <div className="wo-progress-bar">
              <div style={{width:`${totalSets>0?(completedSets/totalSets)*100:0}%`,background:plan.color}}/>
            </div>
          </div>
        )}

        {/* EXERCISES */}
        <div className="exercise-list">
          {plan.exercises.map((ex, i) => {
            const exSets = sets[ex.name] || Array(ex.sets).fill(false);
            const allDone = exSets.every(Boolean);
            return (
              <div key={i} className={`exercise-card ${allDone&&started?"completed":""}`}>
                <div className="exercise-header">
                  <div className="exercise-num" style={{background:plan.bg,color:plan.color}}>{i+1}</div>
                  <div className="exercise-info">
                    <div className="exercise-name">{ex.name}</div>
                    <div className="exercise-muscle">{ex.muscle}</div>
                  </div>
                  <div className="exercise-meta">
                    <span className="ex-meta-tag">{typeof ex.reps==="number"?`${ex.reps} reps`:ex.reps}</span>
                    <span className="ex-meta-tag secondary">Rest {ex.rest}</span>
                  </div>
                </div>
                {started && (
                  <div className="sets-tracker">
                    <span className="sets-label">Sets</span>
                    <div className="sets-dots">
                      {Array.from({length:ex.sets}).map((_,si)=>(
                        <button key={si}
                          className={`set-dot ${exSets[si]?"done":""}`}
                          style={exSets[si]?{background:plan.color,borderColor:plan.color}:{}}
                          onClick={()=>toggleSet(ex.name,si)}>
                          {exSets[si]?"✓":si+1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ACTIONS */}
        <div className="wo-actions">
          {!started && !done && (
            <button className="wo-btn-start" style={{background:plan.color}} onClick={startWorkout}>
              {plan.emoji} Begin {selectedPlan} Workout
            </button>
          )}
          {started && !done && (
            <>
              <button className="wo-btn-start" style={{background:"#16a34a"}} onClick={finishWorkout}>✓ Finish Workout</button>
              <button className="wo-btn-outline" onClick={()=>{clearInterval(timerRef);setStarted(false);setTimer(0);setSets({});}}>Cancel</button>
            </>
          )}
          {done && (
            <div className="wo-done-card">
              <div className="wo-done-emoji">🎉</div>
              <h3>Workout Complete!</h3>
              <p>Duration: <strong>{formatTime(timer)}</strong> · Sets done: <strong>{completedSets}/{totalSets}</strong></p>
              <p style={{fontSize:12,color:"#71717a",marginTop:4}}>Logged to your profile ✓</p>
              <button className="wo-btn-start" style={{background:plan.color,marginTop:14}} onClick={()=>{setDone(false);setStarted(false);setTimer(0);setSets({});}}>
                Start another
              </button>
            </div>
          )}
        </div>

      </div>
      <Footer/>
    </div>
  );
};

export default WorkoutPage;
