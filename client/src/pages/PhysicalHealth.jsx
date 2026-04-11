import "./PhysicalHealth.css";
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../api";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000";

const HABITS_META = [
  { key:"water",      emoji:"💧", label:"Water" },
  { key:"sleep",      emoji:"😴", label:"Sleep" },
  { key:"exercise",   emoji:"🏃", label:"Exercise" },
  { key:"meditation", emoji:"🧘", label:"Meditate" },
  { key:"diet",       emoji:"🥦", label:"Eat well" },
  { key:"noscreens",  emoji:"📵", label:"No screens" },
  { key:"steps",      emoji:"🚶", label:"10k steps" },
  { key:"vitamins",   emoji:"💊", label:"Vitamins" },
];

const WORKOUTS = [
  { id:"Chest",     emoji:"💪", name:"Chest Day",  detail:"6 exercises · 45 min" },
  { id:"Legs",      emoji:"🦵", name:"Leg Day",    detail:"8 exercises · 60 min" },
  { id:"Abs",       emoji:"🔥", name:"Core & Abs", detail:"5 exercises · 30 min" },
  { id:"Full Body", emoji:"❤️", name:"Full Body",  detail:"10 exercises · 75 min" },
];

const QUICK_SYMPTOMS = ["Fever","Cough","Headache","Fatigue","Nausea","Chest pain"];
const DOC_FILTERS    = ["All","Cardiologist","General","Dermatologist","Neurologist","Pediatrician"];

const getBMICategory = (bmi) => {
  const v = parseFloat(bmi);
  if (v < 18.5) return { label:"Underweight", bg:"#eff4ff", border:"#bfdbfe", color:"#2563eb", suggestedGoal: 2500 };
  if (v < 25)   return { label:"Normal weight", bg:"#f0fdf4", border:"#bbf7d0", color:"#16a34a", suggestedGoal: 2200 };
  if (v < 30)   return { label:"Overweight",  bg:"#fff7ed", border:"#fed7aa", color:"#ea580c", suggestedGoal: 1800 };
  return               { label:"Obese",        bg:"#fef2f2", border:"#fecaca", color:"#dc2626", suggestedGoal: 1600 };
};

const getInitials = (name) => (name||"U").split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2);

const MiniBarChart = ({ data, valueKey, labelKey, color, maxVal }) => {
  if (!data || data.length === 0) return <div className="chart-empty">No data yet</div>;
  const max = maxVal || Math.max(...data.map(d => d[valueKey] || 0), 1);
  return (
    <div className="mini-bar-chart">
      {data.slice(0, 7).reverse().map((d, i) => {
        const val = d[valueKey] || 0;
        const pct = Math.min((val / max) * 100, 100);
        return (
          <div key={i} className="mbc-col">
            <div className="mbc-bar-wrap"><div className="mbc-bar-fill" style={{ height:`${pct}%`, background: color }} /></div>
            <div className="mbc-val">{val}</div>
            <div className="mbc-lbl">{d[labelKey] || `#${i+1}`}</div>
          </div>
        );
      })}
    </div>
  );
};

const NutritionLineGraph = ({ meals, goal }) => {
  if (!meals || meals.length === 0) return <div className="chart-empty">Add food to see progress trend</div>;
  const sorted = [...meals].sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
  let cumulative = 0;
  const points = sorted.map(m => { cumulative += m.calories; return cumulative; });
  const max = Math.max(goal, cumulative, 1);
  return (
    <div className="line-graph-wrap">
      <div className="line-graph-grid">
        <div className="goal-line" style={{ bottom: `${(goal/max)*100}%` }}><span>Goal</span></div>
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="graph-svg">
          <polyline fill="none" stroke="var(--orange)" strokeWidth="1.5" strokeLinejoin="round" points={points.map((v, i) => {
            const x = points.length > 1 ? (i / (points.length - 1)) * 100 : 50;
            const y = 40 - (v / max) * 40;
            return `${x},${y}`;
          }).join(" ")} />
          {points.map((v, i) => {
            const x = points.length > 1 ? (i / (points.length - 1)) * 100 : 50;
            const y = 40 - (v / max) * 40;
            return <circle key={i} cx={x} cy={y} r="1.2" fill="var(--orange)" />;
          })}
        </svg>
      </div>
      <div className="graph-footer">Progress towards {goal} kcal goal</div>
    </div>
  );
};

const BMIGauge = ({ bmi }) => {
  const val = parseFloat(bmi) || 0;
  const pct = Math.min(Math.max(((val - 10) / 30) * 100, 0), 100);
  const cat = getBMICategory(bmi);
  return (
    <div className="bmi-gauge-wrap">
      <div className="bmi-gauge-track"><div className="bmi-gauge-gradient" /><div className="bmi-gauge-needle" style={{ left:`${pct}%` }} /></div>
      <div className="bmi-gauge-labels"><span>Thin</span><span>Normal</span><span>Over</span><span>Obese</span></div>
      <div className="bmi-gauge-cat" style={{ color: cat.color }}>{cat.label}</div>
    </div>
  );
};

const Health = ({ user, handleLogout }) => {
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);

  const refs = {
    bmi:useRef(null), habit:useRef(null), workout:useRef(null), diet:useRef(null),
    symptom:useRef(null), water:useRef(null), emergency:useRef(null), doctor:useRef(null),
  };
  const scrollTo = (k) => refs[k]?.current?.scrollIntoView({ behavior:"smooth", block:"start" });

  const [weight,setWeight]       = useState("");
  const [height,setHeight]       = useState("");
  const [bmi,setBmi]             = useState(null);
  const [bmiSaving,setBmiSaving] = useState(false);
  const [bmiHistory,setBmiHistory] = useState([]);

  const calculateBMI = () => {
    const w=parseFloat(weight), h=parseFloat(height)/100;
    if(!w||!h||h<=0) return;
    setBmi((w/(h*h)).toFixed(1));
  };

  const saveBMI = async () => {
    if(!bmi) return;
    setBmiSaving(true);
    try { await API.post("/bmi",{weight,height,bmi}); alert("BMI saved!"); fetchBMIHistory(); }
    catch(e){ alert("Error saving BMI."); } finally { setBmiSaving(false); }
  };

  const fetchBMIHistory = useCallback(async () => {
    try { const { data } = await API.get("/bmi/history"); setBmiHistory(data || []); } catch(e) {}
  }, []);

  useEffect(() => { fetchBMIHistory(); }, [fetchBMIHistory]);

  const latestBMI = bmiHistory[0]?.bmi || bmi || null;
  const bmiCat = latestBMI ? getBMICategory(latestBMI) : null;

  const [habits,setHabits] = useState(HABITS_META.reduce((a,h)=>({...a,[h.key]:false}),{}));
  const doneCount = Object.values(habits).filter(Boolean).length;
  const habitPct  = Math.round((doneCount/HABITS_META.length)*100);
  const toggleHabit = (k) => setHabits(p=>({...p,[k]:!p[k]}));
  const saveHabits = async () => {
    try { await API.post("/habits",habits); alert("Habits saved!"); } catch(e){ alert("Error saving habits."); }
  };

  const [selectedWorkout,setSelectedWorkout] = useState("Chest");

  const [foodQuery,setFoodQuery]     = useState("");
  const [foodResults,setFoodResults] = useState([]);
  const [foodLoading,setFoodLoading] = useState(false);
  const [meals,setMeals]             = useState([]);
  const [barcodeLoading,setBarcodeLoading] = useState(false);
  
  const calorieGoal = useMemo(() => {
    if (!latestBMI) return 2200;
    return getBMICategory(latestBMI).suggestedGoal || 2200;
  }, [latestBMI]);

  const carbsTarget    = Math.round((calorieGoal * 0.50) / 4);
  const proteinTarget  = Math.round((calorieGoal * 0.20) / 4);
  const fatTarget      = Math.round((calorieGoal * 0.30) / 9);

  const totalCal    = meals.reduce((s,m)=>s+m.calories,0);
  const totalProtein= meals.reduce((s,m)=>s+(m.protein||0),0);
  const totalCarbs  = meals.reduce((s,m)=>s+(m.carbs||0),0);

  const fetchMeals = useCallback(async () => {
    try { const { data } = await API.get("/nutrition/today"); setMeals(data || []); } catch(e) {}
  }, []);

  useEffect(() => { fetchMeals(); }, [fetchMeals]);

  const searchTimerRef = useRef(null);
  const searchFood = (q) => {
    setFoodQuery(q);
    clearTimeout(searchTimerRef.current);
    if(q.length<2){ setFoodResults([]); return; }
    searchTimerRef.current = setTimeout(async()=>{
      setFoodLoading(true);
      try{ const {data}=await API.get(`/nutrition/search?q=${encodeURIComponent(q)}`); setFoodResults(data||[]); }
      catch{ setFoodResults([]); } finally{ setFoodLoading(false); }
    },500);
  };

  const addFood = async (f) => {
    try {
      const { data } = await API.post("/nutrition", { name: f.name, calories: f.calories, protein: f.protein, carbs: f.carbs, fat: f.fat });
      setMeals(p => [data, ...p]); setFoodResults([]); setFoodQuery("");
    } catch(e) { alert("Failed to save meal."); }
  };

  const removeMeal = async (id) => {
    try { await API.delete(`/nutrition/${id}`); setMeals(p => p.filter(m => m._id !== id)); } catch(e) {}
  };

  const scanBarcode = async () => {
    const code = prompt("Enter barcode number:"); if(!code) return;
    setBarcodeLoading(true); try{ const {data}=await API.get(`/nutrition/barcode/${code}`); addFood(data); } catch{ alert("Not found."); } finally{ setBarcodeLoading(false); }
  };

  const [selectedQuick,setSelectedQuick] = useState([]);
  const [symptomInput,setSymptomInput]   = useState("");
  const [aiResult,setAiResult]           = useState("");
  const [aiLoading,setAiLoading]         = useState(false);

  const analyzeSymptom = async (text) => {
    if(!text) return; setAiLoading(true); setAiResult("");
    try{ const {data} = await API.post("/symptoms",{symptom:text}); setAiResult(data.aiResult); } catch(e){ setAiResult("⚠️ Error."); } finally{ setAiLoading(false); }
  };

  const [water,setWater]           = useState(0);
  const [waterGoal,setWaterGoal]   = useState(8);
  const [reminderOn,setReminderOn] = useState(false);
  const [reminderHrs,setReminderHrs] = useState("2");

  const fetchWaterHistory = useCallback(async () => {
    try {
      const { data } = await API.get("/water/history");
      const today = data.find(w => new Date(w.date).toDateString() === new Date().toDateString());
      if(today) setWater(today.water);
    } catch(e) {}
  }, []);
  useEffect(() => { fetchWaterHistory(); }, [fetchWaterHistory]);

  const saveWater = async (v) => { try{ await API.post("/water",{water:v}); } catch(e){} };
  const addWater  = () => { if(water>=waterGoal) return; setWater(water+1); saveWater(water+1); };
  const setGlass  = (i) => { setWater(i+1); saveWater(i+1); };

  useEffect(()=>{
    if(!reminderOn) return;
    const ms=parseInt(reminderHrs)*60*60*1000;
    const id=setInterval(()=>alert("💧 Time to drink water!"),ms);
    return ()=>clearInterval(id);
  },[reminderOn,reminderHrs]);

  const [docFilter,setDocFilter]     = useState("All");
  const [doctors,setDoctors]         = useState([]);
  const [chatDoctor,setChatDoctor]   = useState(null);
  const [chatMsg,setChatMsg]         = useState("");
  const [chatHistory,setChatHistory] = useState([]);

  const fetchDoctors = useCallback(async (specialty="All") => {
    try{ const q = specialty!=="All"?`?specialty=${specialty}`:""; const {data} = await API.get(`/doctors${q}`); setDoctors(data); } catch{ setDoctors([]); }
  }, []);
  useEffect(()=>{ fetchDoctors(docFilter); },[docFilter, fetchDoctors]);

  const bookDoctor = (doc) => alert(`Requesting booking with ${doc.name}... An agent will contact you shortly.`);

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports:["websocket","polling"] });
    socketRef.current = socket;
    socket.on("new-message", (data) => { if (data.from !== "user") setChatHistory(p => [...p, { from:"doc", text: data.message }]); });
    return () => socket.disconnect();
  }, []);

  const openChat = async (doc) => {
    setChatDoctor(doc); setChatHistory([{ from:"doc", text:`Hello! I'm ${doc.name}.` }]);
    if(socketRef.current) socketRef.current.emit("join-doctor-chat", doc._id);
  };
  const sendChat = async () => {
    if(!chatMsg.trim()) return; const msg = chatMsg.trim(); setChatHistory(p=>[...p,{from:"user",text:msg}]); setChatMsg("");
    try{ await API.post("/doctors/chat",{doctorId:chatDoctor._id,message:msg}); } catch(e){}
  };

  return (
    <div className="health-page">
      <Navbar user={user} handleLogout={handleLogout} />
      <div className="container">

        <div className="profile-card">
          <div className="pc-top">
            <div className="pc-avatar">{getInitials(user?.name)}</div>
            <div className="pc-info"><div className="pc-name">{user?.name||"User"}</div><div className="pc-email">{user?.email}</div></div>
            <div className="pc-arrow" onClick={()=>navigate("/physical/profile")}>→</div>
          </div>
          <div className="pc-stats">
            <div className="pc-stat"><div className="pc-stat-val">{latestBMI||"—"}</div><div className="pc-stat-lbl">BMI</div></div>
            <div className="pc-stat"><div className="pc-stat-val">{doneCount}/{HABITS_META.length}</div><div className="pc-stat-lbl">Habits</div></div>
            <div className="pc-stat"><div className="pc-stat-val">{water}/{waterGoal}</div><div className="pc-stat-lbl">Water</div></div>
          </div>
        </div>

        <div className="nav-grid">
          {[
            {key:"bmi",emoji:"⚖️",label:"BMI",bg:"#eff4ff"},{key:"habit",emoji:"✅",label:"Habits",bg:"#f0fdf4"},
            {key:"workout",emoji:"🏋️",label:"Workouts",bg:"#fff7ed"},{key:"diet",emoji:"🥗",label:"Nutrition",bg:"#fdf4ff"},
            {key:"symptom",emoji:"🩺",label:"Symptoms",bg:"#fef2f2"},{key:"water",emoji:"💧",label:"Water",bg:"#f0fdfa"},
            {key:"emergency",emoji:"🚑",label:"Emergency",bg:"#fef2f2"},{key:"doctor",emoji:"👨‍⚕️",label:"Doctors",bg:"#f5f3ff"},
          ].map(c=>(<div key={c.key} className="nav-card" onClick={()=>scrollTo(c.key)}><div className="nav-ico" style={{background:c.bg}}>{c.emoji}</div><span className="nav-lbl">{c.label}</span></div>))}
        </div>

        {/* ── BMI ─────────────────────────────────────────────────────── */}
        <div ref={refs.bmi} className="section">
          <div className="section-header"><div className="section-badge" style={{background:"#eff4ff"}}>⚖️</div><div><div className="section-title">BMI Calculator</div><div className="section-subtitle">Manage your weight</div></div></div>
          <div className="input-row">
            <div className="input-group"><label className="field-label">Weight (kg)</label><input className="input" type="number" value={weight} onChange={e=>setWeight(e.target.value)}/></div>
            <div className="input-group"><label className="field-label">Height (cm)</label><input className="input" type="number" value={height} onChange={e=>setHeight(e.target.value)}/></div>
          </div>
          {(bmi || latestBMI) && (
            <div className="bmi-result-box">
              <div className="bmi-value">{bmi || latestBMI}</div>
              <div><div className="bmi-label">Your BMI</div>{bmiCat && <span className="bmi-tag" style={{background:bmiCat.bg,color:bmiCat.color}}>{bmiCat.label}</span>}</div>
              <div className="bmi-range"><BMIGauge bmi={bmi || latestBMI} /></div>
            </div>
          )}
          {bmiCat && (
            <div className="bmi-recommendation" style={{background:bmiCat.bg, border:`1px solid ${bmiCat.border}`, padding:"15px", borderRadius:"12px", marginTop:"15px"}}>
              <div style={{fontWeight:800, fontSize:12, color:bmiCat.color, marginBottom:4}}>DAILY TARGET: {calorieGoal} KCAL</div>
              <div style={{fontSize:13}}>Based on your status, aim for {carbsTarget}g Carbs, {proteinTarget}g Protein, and {fatTarget}g Fats.</div>
            </div>
          )}
          <div className="btn-row" style={{marginTop:15}}><button className="btn-blue" onClick={calculateBMI}>Calculate</button><button className="btn btn-outline btn-sm" onClick={saveBMI} disabled={!bmi}>Save</button></div>
        </div>

        {/* ── HABITS ──────────────────────────────────────────────────── */}
        <div ref={refs.habit} className="section">
          <div className="section-header"><div className="section-badge" style={{background:"#f0fdf4"}}>✅</div><div><div className="section-title">Daily Habits</div><div className="section-subtitle">Build your routine</div></div></div>
          <div className="habits-grid">{HABITS_META.map(h=>(<div key={h.key} className={`habit-card ${habits[h.key]?"active":""}`} onClick={()=>toggleHabit(h.key)}><div className="habit-emoji">{h.emoji}</div><span className="habit-name">{h.label}</span></div>))}</div>
          <div className="progress-row"><div className="progress-bar-wrap"><div className="progress-bar-fill" style={{width:`${habitPct}%`}}/></div><span className="progress-text">{doneCount}/{HABITS_META.length}</span></div>
          <button className="btn-blue btn-full" onClick={saveHabits}>Save Habits</button>
        </div>

        {/* ── WORKOUT ─────────────────────────────────────────────────── */}
        <div ref={refs.workout} className="section">
          <div className="section-header"><div className="section-badge" style={{background:"#fff7ed"}}>🏋️</div><div><div className="section-title">Workout Plans</div><div className="section-subtitle">Stay active</div></div></div>
          <div className="workout-grid">{WORKOUTS.map(w => (<div key={w.id} className={`workout-card ${selectedWorkout===w.id?"active":""}`} onClick={()=>setSelectedWorkout(w.id)}><div className="workout-icon">{w.emoji}</div><h4>{w.name}</h4><p>{w.detail}</p></div>))}</div>
          <div className="chart-section" style={{background:"#fff7ed", borderColor:"#fed7aa"}}><div className="chart-title" style={{color:"#ea580c"}}>📈 Weekly Activity</div><MiniBarChart data={[{v:80,l:"M"},{v:60,l:"T"},{v:90,l:"W"},{v:40,l:"T"},{v:70,l:"F"},{v:100,l:"S"},{v:30,l:"S"}]} valueKey="v" labelKey="l" color="#ea580c" /></div>
          <button className="btn-blue btn-full" style={{background:"#ea580c"}} onClick={()=>navigate("/physical/workout", {state:{plan:selectedWorkout}})}>Start Session</button>
        </div>

        {/* ── NUTRITION ───────────────────────────────────────────────── */}
        <div ref={refs.diet} className="section">
          <div className="section-header"><div className="section-badge" style={{background:"#fdf4ff"}}>🥗</div><div><div className="section-title">Nutrition Log</div><div className="section-subtitle">Goal: {calorieGoal} kcal · BMI: {latestBMI||"—"}</div></div></div>
          <div className="chart-section" style={{background:"var(--orange-l)",borderColor:"var(--orange-b)"}}><div className="chart-title" style={{color:"var(--orange)"}}>🔥 Calorie Progress Trend</div><NutritionLineGraph meals={meals} goal={calorieGoal} /></div>
          <div className="macro-grid">
            <div className="macro-card"><div className="macro-value" style={{color:"var(--orange)"}}>{totalCal}</div><div className="macro-label">Kcal</div><div className="macro-bar"><div className="macro-bar-fill" style={{width:`${Math.min((totalCal/calorieGoal)*100,100)}%`,background:"var(--orange)"}}/></div><div className="macro-target">Target: {calorieGoal}</div></div>
            <div className="macro-card"><div className="macro-value" style={{color:"var(--blue)"}}>{totalProtein}g</div><div className="macro-label">Protein</div><div className="macro-bar"><div className="macro-bar-fill" style={{width:`${Math.min((totalProtein/proteinTarget)*100,100)}%`,background:"var(--blue)"}}/></div><div className="macro-target">Target: {proteinTarget}g</div></div>
            <div className="macro-card"><div className="macro-value" style={{color:"var(--green)"}}>{totalCarbs}g</div><div className="macro-label">Carbs</div><div className="macro-bar"><div className="macro-bar-fill" style={{width:`${Math.min((totalCarbs/carbsTarget)*100,100)}%`,background:"var(--green)"}}/></div><div className="macro-target">Target: {carbsTarget}g</div></div>
          </div>
          <div className="food-row" style={{marginTop:15}}>
            <input className="input" placeholder="Search food (English only)..." value={foodQuery} onChange={e=>searchFood(e.target.value)}/>
            <button className="btn btn-outline btn-sm" onClick={scanBarcode} disabled={barcodeLoading}>📷 Scan</button>
            <button className="btn btn-outline btn-sm" onClick={()=>{const n=prompt("Name:"); const c=prompt("Kcal:"); if(n&&c)addFood({name:n,calories:parseInt(c),protein:0,carbs:0,fat:0});}}>+ Custom</button>
          </div>
          {foodResults.length>0 && <div className="food-dropdown" style={{display:"block"}}>{foodResults.map((f,i)=>(<div key={i} onClick={()=>addFood(f)} className="food-item"><div><div style={{fontSize:13,fontWeight:600}}>{f.name}</div><div style={{fontSize:11,color:"var(--muted)"}}>{f.calories} kcal · P:{f.protein}g C:{f.carbs}g</div></div><span>＋ Add</span></div>))}</div>}
          <div style={{marginTop:15}}>{meals.map(m=>(<div key={m._id} className="meal-item"><div><div className="meal-name">{m.name}</div><span className="meal-time">{new Date(m.createdAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span></div><div className="meal-right"><div className="kcal-pill">{m.calories} kcal</div><button className="meal-del" onClick={()=>removeMeal(m._id)}>✕</button></div></div>))}</div>
        </div>

        {/* ── SYMPTOMS ────────────────────────────────────────────────── */}
        <div ref={refs.symptom} className="section">
          <div className="section-header"><div className="section-badge" style={{background:"#fef2f2"}}>🩺</div><div><div className="section-title">Symptom Checker</div><div className="section-subtitle">Gemini AI Analysis</div></div></div>
          <div className="quick-chips">{QUICK_SYMPTOMS.map(s=>(<button key={s} className={`quick-chip ${selectedQuick.includes(s)?"selected":""}`} onClick={()=>setSelectedQuick(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s])}>{s}</button>))}</div>
          <button className="btn-analyze" onClick={()=>analyzeSymptom(selectedQuick.join(", "))} disabled={aiLoading||selectedQuick.length===0} style={{margin:"10px 0 15px", opacity:selectedQuick.length>0?1:0.5}}>{aiLoading?"Analyzing...":`✦ Analyze Selected (${selectedQuick.length})`}</button>
          <div className="sym-input-row"><input className="input" value={symptomInput} onChange={e=>setSymptomInput(e.target.value)} placeholder="Describe symptoms..."/><button className="btn btn-sm" onClick={()=>analyzeSymptom(symptomInput)} disabled={aiLoading}>Add</button></div>
          {aiResult && <div className="ai-result-box"><div className="ai-header">✦ AI Analysis</div><div className="ai-body">{aiResult}</div></div>}
        </div>

        {/* ── WATER ───────────────────────────────────────────────────── */}
        <div ref={refs.water} className="section">
          <div className="section-header"><div className="section-badge" style={{background:"#f0fdfa"}}>💧</div><div><div className="section-title">Water Intake</div><div className="section-subtitle">Drink 8-10 glasses</div></div></div>
          <div className="reminder-strip">
            <div className="reminder-text">Hourly Reminder</div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <select className="input" style={{width:80,marginBottom:0,padding:4,fontSize:12}} value={reminderHrs} onChange={e=>setReminderHrs(e.target.value)}><option value="1">1 hr</option><option value="2">2 hrs</option></select>
              <div className="toggle-switch" style={{background:reminderOn?"#0ea5e9":"#cbd5e1"}} onClick={()=>setReminderOn(!reminderOn)}><div className="toggle-knob" style={{left:reminderOn?"21px":"3px"}} /></div>
            </div>
          </div>
          <div className="glasses-grid" style={{marginTop:15}}>{Array.from({length:waterGoal}).map((_,i)=>(<div key={i} className={`glass-item ${i<water?"filled":""}`} onClick={()=>setGlass(i)}><div className="glass-fill"/></div>))}</div>
          <div className="btn-row"><button className="btn-blue" onClick={addWater}>+ Add glass</button><button className="btn btn-outline btn-sm" onClick={()=>{const g=prompt("Goal:"); if(g)setWaterGoal(parseInt(g))}}>Set Goal</button></div>
        </div>

        {/* ── EMERGENCY ───────────────────────────────────────────────── */}
        <div ref={refs.emergency} className="section" style={{borderColor:"var(--red-b)"}}>
          <div className="section-header"><div className="section-badge" style={{background:"var(--red-l)"}}>🚑</div><div><div className="section-title" style={{color:"var(--red)"}}>Emergency</div><div className="section-subtitle">24/7 Assistance</div></div></div>
          <div className="emergency-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(140px,1fr))",gap:8,marginBottom:15}}>
            <button className="btn-em-pill" onClick={()=>window.open("tel:999")}>🚨 999 Call</button>
            <button className="btn-em-pill" onClick={()=>window.open("tel:10655")}>🚑 Ambulance</button>
            <button className="btn-em-pill" onClick={()=>window.open("tel:333")}>📞 333 Hotline</button>
            <button className="btn-em-pill" onClick={()=>window.open("tel:16263")}>🏥 Shastho Batayon</button>
          </div>
          <div className="emergency-tips">
            <div className="section-tag" style={{color:"var(--red)"}}>First Aid Tips</div>
            <div className="emergency-item"><div className="emergency-dot"/><div style={{fontSize:12}}><strong>Bleeding:</strong> Apply firm pressure with clean cloth.</div></div>
            <div className="emergency-item"><div className="emergency-dot"/><div style={{fontSize:12}}><strong>Heat:</strong> Move to cool area, hydrate.</div></div>
          </div>
        </div>

        {/* ── DOCTORS ─────────────────────────────────────────────────── */}
        <div ref={refs.doctor} className="section">
          <div className="section-header"><div className="section-badge" style={{background:"#f5f3ff"}}>👨‍⚕️</div><div><div className="section-title">Doctors</div><div className="section-subtitle">Experience & Professionalism</div></div></div>
          <div className="doc-filters" style={{marginBottom:15}}>{DOC_FILTERS.map(f=>(<button key={f} className={`filter-btn ${docFilter===f?"active":""}`} onClick={()=>setDocFilter(f)}>{f}</button>))}</div>
          {doctors.map(doc=>(
            <div key={doc._id} className="doctor-card">
              <div className="doc-top">
                <div className="doc-avatar" style={{background:doc.avatarBg,color:doc.avatarColor}}>{doc.initials}</div>
                <div>
                  <div className="doc-name">{doc.name}</div>
                  <div className="doc-spec">{doc.spec}</div>
                  <div style={{fontSize:11,color:"var(--muted)",marginTop:4}}>📍 {doc.chamber || doc.location} · {doc.experience || doc.exp} XP</div>
                  <div style={{fontSize:11,color:"var(--muted)",fontWeight:600}}>📞 {doc.phone || "No phone provided"}</div>
                </div>
              </div>
              <div className="doc-actions">
                <button className="doc-btn doc-btn-book" onClick={()=>bookDoctor(doc)}>📅 Book</button>
                <button className="doc-btn doc-btn-chat" onClick={()=>chatDoctor?._id===doc._id?setChatDoctor(null):openChat(doc)}>{chatDoctor?._id===doc._id?"✕ Close":"💬 Chat"}</button>
              </div>
              {chatDoctor?._id===doc._id && (
                <div className="chat-container"><div className="chat-messages">{chatHistory.map((m,i)=>(<div key={i} className={`chat-msg ${m.from==="doc"?"doctor":"user"}`}>{m.text}</div>))}</div><div className="chat-input-row"><input className="chat-text-input" value={chatMsg} onChange={e=>setChatMsg(e.target.value)} /><button className="chat-send-btn" onClick={sendChat}>Send</button></div></div>
              )}
            </div>
          ))}
        </div>

      </div>
      <Footer/>
    </div>
  );
};

export default Health;
