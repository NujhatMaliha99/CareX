import "./ProfilePage.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../api";

const ProfilePage = ({ user, handleLogout }) => {
  const navigate = useNavigate();
  const getInitials = (name) => (name || "U").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const [bmiHistory, setBmiHistory] = useState([]);
  const [habitHistory, setHabitHistory] = useState([]);
  const [waterHistory, setWaterHistory] = useState([]);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [bmi, habits, water, workout, appts] = await Promise.all([
          API.get("/bmi/history"),
          API.get("/habits/history"),
          API.get("/water/history"),
          API.get("/workout/history"),
          API.get("/doctors/bookings"),
        ]);
        setBmiHistory(bmi.data || []);
        setHabitHistory(habits.data || []);
        setWaterHistory(water.data || []);
        setWorkoutHistory(workout.data || []);
        setAppointments(appts.data || []);
      } catch (err) {
        console.log(err.response?.data || err.message);
        // Demo fallback data
        setBmiHistory([
          { date:"2025-04-11", bmi:23.5, weight:72, height:175 },
          { date:"2025-03-28", bmi:24.1, weight:74, height:175 },
          { date:"2025-03-10", bmi:24.8, weight:76, height:175 },
        ]);
        setHabitHistory([
          { date:"2025-04-11", habits:{ water:true, sleep:true, exercise:false, eatHealthy:true, vitamins:true } },
          { date:"2025-04-10", habits:{ water:true, sleep:true, exercise:true, eatHealthy:true, vitamins:true } },
          { date:"2025-04-09", habits:{ water:false, sleep:true, exercise:true, eatHealthy:false, vitamins:true } },
        ]);
        setWaterHistory([
          { date:"2025-04-11", glasses:5, goal:8 },
          { date:"2025-04-10", glasses:8, goal:8 },
          { date:"2025-04-09", glasses:6, goal:8 },
          { date:"2025-04-08", glasses:7, goal:8 },
          { date:"2025-04-07", glasses:8, goal:8 },
        ]);
        setWorkoutHistory([
          { date:"2025-04-10", plan:"Chest", duration:"45 min", sets:18 },
          { date:"2025-04-08", plan:"Legs",  duration:"52 min", sets:22 },
          { date:"2025-04-06", plan:"Full Body", duration:"61 min", sets:28 },
        ]);
        setAppointments([
          { date:"2025-04-15", time:"10:00 AM", doctor:"Dr. Arif Rahman", spec:"Cardiologist", status:"Upcoming" },
        ]);
      } finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const latestBmi = bmiHistory[0];
  const todayWater = waterHistory[0];
  const todayHabit = habitHistory[0];
  const habitDoneCount = todayHabit ? Object.values(todayHabit.habits).filter(Boolean).length : 0;

  const getBmiCat = (val) => {
    if (!val) return { label:"—", color:"var(--muted)" };
    if (val < 18.5) return { label:"Underweight", color:"#0ea5e9" };
    if (val < 25)   return { label:"Normal", color:"#16a34a" };
    if (val < 30)   return { label:"Overweight", color:"#ea580c" };
    return                  { label:"Obese", color:"#dc2626" };
  };

  const habitMeta = {
    water:"💧", sleep:"😴", exercise:"🏃", meditation:"🧘",
    diet:"🥦", noscreens:"📵", steps:"🚶", vitamins:"💊",
  };

  const tabs = ["overview","bmi","habits","water","workouts","appointments"];

  if (loading) return (
    <div className="profile-page">
      <Navbar user={user} handleLogout={handleLogout} />
      <div className="profile-container"><div className="loading-state">Loading your health data...</div></div>
    </div>
  );

  return (
    <div className="profile-page">
      <Navbar user={user} handleLogout={handleLogout} />
      <div className="profile-container">

        {/* BACK */}
        <button className="back-btn" onClick={() => navigate("/physical")}>← Back to Health</button>

        {/* PROFILE HERO */}
        <div className="profile-hero-card">
          <div className="profile-hero-av">{getInitials(user?.name)}</div>
          <div className="profile-hero-info">
            <h2>{user?.name || "User"}</h2>
            <p>{user?.email || ""}</p>
            <span className="member-badge">Member since Jan 2024 · Dhaka</span>
          </div>
          <button className="edit-btn">Edit profile</button>
        </div>

        {/* OVERVIEW STATS */}
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-val" style={{ color:"#0ea5e9" }}>{todayWater?.glasses || 0}</div>
            <div className="stat-lbl">Glasses today</div>
          </div>
          <div className="stat-card">
            <div className="stat-val" style={{ color:"var(--green)" }}>{habitDoneCount}</div>
            <div className="stat-lbl">Habits done</div>
          </div>
          <div className="stat-card">
            <div className="stat-val" style={{ color:getBmiCat(latestBmi?.bmi).color }}>{latestBmi?.bmi || "—"}</div>
            <div className="stat-lbl">Last BMI</div>
          </div>
          <div className="stat-card">
            <div className="stat-val" style={{ color:"var(--orange)" }}>{workoutHistory.length}</div>
            <div className="stat-lbl">Workouts</div>
          </div>
        </div>

        {/* TABS */}
        <div className="profile-tabs">
          {tabs.map((t) => (
            <button key={t} className={`profile-tab ${activeTab===t?"active":""}`} onClick={() => setActiveTab(t)}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>

        {/* TAB: OVERVIEW */}
        {activeTab==="overview" && (
          <div className="tab-content">
            <div className="record-section">
              <div className="record-section-title">Recent BMI</div>
              {bmiHistory.slice(0,3).map((b,i) => {
                const cat = getBmiCat(b.bmi);
                return (
                  <div key={i} className="record-row">
                    <span className="rec-date">{b.date}</span>
                    <span className="rec-val">{b.bmi}</span>
                    <span className="rec-tag" style={{ color:cat.color }}>{cat.label}</span>
                  </div>
                );
              })}
            </div>
            <div className="record-section">
              <div className="record-section-title">Water — last 5 days</div>
              {waterHistory.slice(0,5).map((w,i) => (
                <div key={i} className="record-row">
                  <span className="rec-date">{i===0?"Today":w.date}</span>
                  <div className="water-bar-wrap">
                    <div className="water-bar-fill" style={{ width:`${(w.glasses/w.goal)*100}%` }} />
                  </div>
                  <span className="rec-val">{w.glasses}/{w.goal} {w.glasses>=w.goal?"✅":""}</span>
                </div>
              ))}
            </div>
            <div className="record-section">
              <div className="record-section-title">Habit records</div>
              {habitHistory.slice(0,3).map((h,i) => {
                const done = Object.entries(h.habits).filter(([,v])=>v).map(([k])=>habitMeta[k]||k).join(" ");
                const count = Object.values(h.habits).filter(Boolean).length;
                return (
                  <div key={i} className="record-row">
                    <span className="rec-date">{i===0?"Today":h.date}</span>
                    <span className="rec-val">{done}</span>
                    <span className="rec-tag">{count}/8</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: BMI */}
        {activeTab==="bmi" && (
          <div className="tab-content">
            <div className="record-section">
              <div className="record-section-title">BMI History</div>
              {bmiHistory.length===0 && <p className="empty-state">No BMI records yet. Calculate your BMI on the Health page.</p>}
              {bmiHistory.map((b,i) => {
                const cat = getBmiCat(b.bmi);
                return (
                  <div key={i} className="record-row detail">
                    <span className="rec-date">{b.date || new Date(b.createdAt).toLocaleDateString()}</span>
                    <span className="rec-val">{b.bmi}</span>
                    <span className="rec-tag" style={{ color:cat.color, background:cat.color+"18", padding:"2px 10px", borderRadius:20 }}>{cat.label}</span>
                    <span style={{ fontSize:11,color:"var(--muted)" }}>{b.weight}kg · {b.height}cm</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: HABITS */}
        {activeTab==="habits" && (
          <div className="tab-content">
            <div className="record-section">
              <div className="record-section-title">Daily Habit Records</div>
              {habitHistory.length===0 && <p className="empty-state">No habit records yet. Start tracking on the Health page.</p>}
              {habitHistory.map((h,i) => (
                <div key={i} className="habit-record-row">
                  <div className="hab-rec-date">{i===0?"Today":h.date}</div>
                  <div className="hab-rec-icons">
                    {Object.entries(h.habits).map(([k,v]) => (
                      <span key={k} className={`hab-icon ${v?"done":""}`} title={k}>{habitMeta[k]||k}</span>
                    ))}
                  </div>
                  <div className="hab-rec-count">{Object.values(h.habits).filter(Boolean).length}/8</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: WATER */}
        {activeTab==="water" && (
          <div className="tab-content">
            <div className="record-section">
              <div className="record-section-title">Water Intake History</div>
              {waterHistory.length===0 && <p className="empty-state">No water records yet. Start logging on the Health page.</p>}
              {waterHistory.map((w,i) => (
                <div key={i} className="record-row">
                  <span className="rec-date">{i===0?"Today":w.date}</span>
                  <div className="water-bar-wrap">
                    <div className="water-bar-fill" style={{ width:`${Math.min((w.glasses/w.goal)*100,100)}%` }} />
                  </div>
                  <span className="rec-val">{w.glasses}/{w.goal} glasses</span>
                  <span>{w.glasses>=w.goal?"✅":"💧"}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: WORKOUTS */}
        {activeTab==="workouts" && (
          <div className="tab-content">
            <div className="record-section">
              <div className="record-section-title">Workout History</div>
              {workoutHistory.length===0 && <p className="empty-state">No workouts logged yet. Go to the Workout page to begin.</p>}
              {workoutHistory.map((w,i) => (
                <div key={i} className="record-row detail">
                  <span className="rec-date">{w.date || new Date(w.createdAt).toLocaleDateString()}</span>
                  <span className="rec-val">{w.plan || w.type || w.name}</span>
                  <span style={{ fontSize:12,color:"var(--muted)" }}>{w.duration}</span>
                  <span className="rec-tag">{w.sets || w.exercisesDone || 0} sets</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: APPOINTMENTS */}
        {activeTab==="appointments" && (
          <div className="tab-content">
            <div className="record-section">
              <div className="record-section-title">My Appointments</div>
              {appointments.length===0 && <p className="empty-state">No appointments booked yet. Find a doctor on the Health page.</p>}
              {appointments.map((a,i) => (
                <div key={i} className="appt-card">
                  <div className="appt-doc-av">{a.doctor.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14,fontWeight:500 }}>{a.doctor}</div>
                    <div style={{ fontSize:12,color:"var(--muted)" }}>{a.spec}</div>
                    <div style={{ fontSize:12,marginTop:4 }}>📅 {a.date} · ⏰ {a.time}</div>
                  </div>
                  <span className={`appt-status ${a.status.toLowerCase()}`}>{a.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
