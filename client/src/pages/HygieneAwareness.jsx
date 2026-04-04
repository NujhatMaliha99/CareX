import "./HygieneAwareness.css";
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FaHandHoldingWater, FaSoap, FaUtensils, FaHome, FaShieldAlt,
  FaHeart, FaTint, FaMoon, FaClock, FaBroom, FaTooth, FaApple,
  FaTimes, FaChevronRight, FaChevronLeft, FaCheck, FaTrophy,
  FaRedo, FaLightbulb, FaBookOpen, FaFire, FaStar, FaPlay,
  FaPause, FaLock, FaSpinner,
} from "react-icons/fa";

const API = "http://localhost:5050/api/hygiene";

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
});

const todayStr = () => new Date().toISOString().slice(0, 10);

/* ─────────────────────────────────────────────
   LEARN MODULE DATA
───────────────────────────────────────────── */
const LEARN_MODULES = [
  {
    id: "personal", emoji: "🧼", title: "Personal Hygiene",
    color: "#6c8cff", colorLight: "#e8edff",
    chapters: [
      {
        heading: "Why Personal Hygiene Matters",
        body: "Good personal hygiene removes dirt, bacteria, and dead skin cells from your body. It prevents the spread of illness, reduces body odour, and directly impacts your confidence and mental well-being. Studies show that people who maintain regular hygiene habits report lower anxiety and higher self-esteem.",
        fact: "💡 You touch your face an average of 16 times per hour — clean hands are your #1 defence!",
      },
      {
        heading: "Handwashing — The 20-Second Rule",
        body: "Proper handwashing is the single most effective way to prevent the spread of infection. Wet your hands with clean water, apply soap, and lather for at least 20 seconds. Scrub between fingers, under nails, and on the back of your hands.",
        fact: "💡 Regular handwashing can reduce respiratory infections by up to 21%.",
        steps: [
          "Wet hands with clean running water",
          "Apply soap and lather well",
          "Scrub all surfaces for 20 seconds",
          "Rinse thoroughly under running water",
          "Dry with a clean towel or air-dry",
        ],
      },
      {
        heading: "Oral Hygiene Basics",
        body: "Brush your teeth for two minutes, twice a day using fluoride toothpaste. Use a soft-bristle toothbrush and replace it every 3 months. Floss once daily to remove plaque and food particles from between teeth.",
        fact: "💡 A single mouth can house over 700 species of bacteria — routine care keeps the harmful ones in check.",
      },
      {
        heading: "Skin and Body Care",
        body: "Bathing or showering daily removes sweat, bacteria, and allergens. Use mild, pH-balanced soap. Moisturise after bathing to maintain skin barrier health. Keep nails trimmed and clean — dirt under nails carries pathogens.",
        fact: "💡 Your skin sheds approximately 30,000–40,000 dead cells per hour — regular bathing helps clear this buildup.",
      },
    ],
    quiz: [
      { q: "How long should you wash your hands with soap?", options: ["5 seconds", "10 seconds", "20 seconds", "1 minute"], answer: 2 },
      { q: "How often should you replace your toothbrush?", options: ["Every month", "Every 3 months", "Every year", "Only when bristles break"], answer: 1 },
      { q: "Which is NOT a good handwashing moment?", options: ["Before eating", "After using the bathroom", "After a handshake then immediately eating", "Before cooking"], answer: 2 },
    ],
  },
  {
    id: "food", emoji: "🍎", title: "Food Hygiene",
    color: "#63d3a3", colorLight: "#e0f7ef",
    chapters: [
      {
        heading: "Food Safety — Why It's Critical",
        body: "Foodborne illnesses affect an estimated 600 million people globally every year. Bacteria like Salmonella, E. coli, and Listeria can multiply rapidly in food left at unsafe temperatures.",
        fact: "💡 Food left between 4°C and 60°C (the 'danger zone') allows bacteria to double every 20 minutes.",
      },
      {
        heading: "Safe Food Handling",
        body: "Always wash your hands before and after handling raw meat, poultry, or seafood. Use separate cutting boards for raw proteins and produce. Rinse fruits and vegetables under running water even if you plan to peel them.",
        fact: "💡 Cross-contamination causes a large share of foodborne illness outbreaks in home kitchens.",
        steps: [
          "Wash hands before and after handling raw food",
          "Use separate boards for meat and vegetables",
          "Rinse all produce under running water",
          "Never thaw meat on the counter — use the fridge",
          "Wash the sink after handling raw poultry",
        ],
      },
      {
        heading: "Cooking Temperatures",
        body: "Heat kills most foodborne pathogens. Poultry must reach 75°C (165°F). Ground meats need 71°C (160°F). Fish should flake easily and reach 63°C (145°F). Use a food thermometer — colour alone is not reliable.",
        fact: "💡 Microwaves can leave cold spots — let microwaved food stand 2 minutes and stir before eating.",
      },
      {
        heading: "Storage and Leftovers",
        body: "Refrigerate perishable foods within 2 hours of cooking. Store leftovers in shallow, airtight containers. Consume refrigerated leftovers within 3–4 days. When in doubt, throw it out.",
        fact: "💡 The 2-hour rule: if perishable food has been out for over 2 hours, discard it.",
      },
    ],
    quiz: [
      { q: "What is the 'danger zone' temperature range for food?", options: ["0°C – 10°C", "4°C – 60°C", "20°C – 80°C", "10°C – 40°C"], answer: 1 },
      { q: "What internal temperature must poultry reach to be safe?", options: ["60°C", "70°C", "75°C", "80°C"], answer: 2 },
      { q: "How long can cooked leftovers safely stay in the fridge?", options: ["1 day", "1–2 days", "3–4 days", "1 week"], answer: 2 },
    ],
  },
  {
    id: "home", emoji: "🏡", title: "Home Hygiene",
    color: "#ff8e6e", colorLight: "#fff0eb",
    chapters: [
      {
        heading: "Your Home as a Health Environment",
        body: "We spend approximately 90% of our time indoors. Dust mites, mould, pet dander, and chemical residues all affect indoor air quality and can trigger allergies, asthma, and respiratory infections.",
        fact: "💡 Indoor air can be 2–5 times more polluted than outdoor air, according to the EPA.",
      },
      {
        heading: "High-Touch Surfaces",
        body: "Doorknobs, light switches, remote controls, phone screens, and kitchen countertops are touched repeatedly throughout the day. Disinfect these surfaces at least once daily.",
        fact: "💡 A phone screen can harbour 10 times more bacteria than a toilet seat.",
        steps: [
          "Disinfect doorknobs and switches daily",
          "Wipe phone screens with microfibre + disinfectant",
          "Clean remote controls weekly",
          "Sanitise kitchen countertops before and after food prep",
          "Disinfect bathroom fixtures after any illness",
        ],
      },
      {
        heading: "Bathroom Hygiene",
        body: "Clean the toilet bowl, seat, and handle weekly. Replace bath towels every 3–4 uses. Ventilate after showers to prevent mould. Store toothbrushes upright with covers, away from the toilet.",
        fact: "💡 Flushing with the lid open sends bacteria-laden droplets up to 2 metres into the air.",
      },
      {
        heading: "Laundry and Bedding",
        body: "Wash bed sheets weekly in hot water (60°C or above) to kill dust mites. Pillowcases accumulate dead skin, oil, and bacteria. Never leave wet laundry in the machine — mould can grow within 8–12 hours.",
        fact: "💡 An unwashed pillowcase after one week can contain over 3 million bacterial CFU per cm².",
      },
    ],
    quiz: [
      { q: "What temperature kills dust mites in bed sheets?", options: ["30°C", "40°C", "50°C", "60°C or above"], answer: 3 },
      { q: "How often should bath towels be washed?", options: ["Once a month", "Once a week", "Every 3–4 uses", "Only when visibly dirty"], answer: 2 },
      { q: "Which surface typically carries the most germs at home?", options: ["Toilet seat", "Kitchen sponge", "Doorknob", "Bath mat"], answer: 1 },
    ],
  },
  {
    id: "public", emoji: "🌍", title: "Public Hygiene",
    color: "#a78bfa", colorLight: "#f0ebff",
    chapters: [
      {
        heading: "Protecting Yourself in Public Spaces",
        body: "Public spaces concentrate people and surfaces. Understanding how infections spread via droplets, aerosols, fomites, and direct contact empowers you to make smart protective decisions.",
        fact: "💡 A single cough can release up to 3,000 droplets; a sneeze up to 40,000 at 160 km/h.",
      },
      {
        heading: "Respiratory Etiquette",
        body: "Always cover your mouth and nose with a tissue or your inner elbow when coughing or sneezing. Dispose of tissues immediately and wash your hands. Avoid touching your eyes, nose, or mouth in public.",
        fact: "💡 The 'elbow sneeze' reduces surface contamination by 70% compared to sneezing into your hands.",
        steps: [
          "Use a tissue or elbow — never bare hands — when sneezing",
          "Dispose of used tissues immediately",
          "Wash hands or use sanitiser straight after",
          "Avoid touching your face in public spaces",
          "Keep distance from visibly unwell individuals",
        ],
      },
      {
        heading: "Hand Sanitiser Use",
        body: "When soap and water aren't available, use an alcohol-based hand sanitiser with at least 60% ethanol or 70% isopropanol. Apply enough to cover all surfaces and rub until dry (~20 seconds). Sanitiser does NOT remove visible dirt.",
        fact: "💡 Sanitisers are less effective against norovirus and C. difficile — seek soap and water when possible.",
      },
      {
        heading: "Public Restroom Safety",
        body: "Use paper towels to open door handles when exiting. Wash hands thoroughly and use the paper towel to turn off taps. This single habit prevents a large proportion of faecal-oral disease transmission.",
        fact: "💡 Flushing a public toilet with the lid open can spray particles up to 1.8 metres — step back before flushing.",
      },
    ],
    quiz: [
      { q: "Minimum alcohol % for effective hand sanitiser?", options: ["30%", "50%", "60%", "80%"], answer: 2 },
      { q: "When should you use soap instead of sanitiser?", options: ["After a handshake", "When hands are visibly dirty or greasy", "After touching a doorknob", "Before eating a snack"], answer: 1 },
      { q: "The correct way to sneeze in public is into your:", options: ["Bare hands", "Someone else's direction", "Inner elbow or a tissue", "The air"], answer: 2 },
    ],
  },
];

/* ─────────────────────────────────────────────
   HANDWASH TIMER
───────────────────────────────────────────── */
function HandwashTimer() {
  const [seconds, setSeconds] = useState(20);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef(null);

  const start = () => { if (done) { setSeconds(20); setDone(false); } setRunning(true); };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) { clearInterval(intervalRef.current); setRunning(false); setDone(true); return 0; }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const pct = ((20 - seconds) / 20) * 100;

  return (
    <div className="hw-timer">
      <p className="hw-timer-label">🖐️ 20-Second Handwash Timer</p>
      <div className="hw-timer-ring">
        <svg viewBox="0 0 80 80" className="hw-ring-svg">
          <circle cx="40" cy="40" r="34" className="hw-ring-bg" />
          <circle cx="40" cy="40" r="34" className="hw-ring-progress"
            strokeDasharray={`${2 * Math.PI * 34}`}
            strokeDashoffset={`${2 * Math.PI * 34 * (1 - pct / 100)}`} />
        </svg>
        <span className="hw-ring-num">{done ? "✅" : seconds}</span>
      </div>
      <button className={`hw-timer-btn ${running ? "hw-timer-running" : ""}`}
        onClick={running ? () => { clearInterval(intervalRef.current); setRunning(false); } : start}>
        {running ? <><FaPause /> Pause</> : done ? <><FaRedo /> Restart</> : <><FaPlay /> Start</>}
      </button>
      {done && <p className="hw-done-msg">Great job! Hands clean 🎉</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   CHAPTER READER
───────────────────────────────────────────── */
function ChapterReader({ chapter, index, total }) {
  return (
    <div className="sl-chapter">
      <p className="sl-chapter-count">Chapter {index + 1} of {total}</p>
      <h3 className="sl-chapter-heading">{chapter.heading}</h3>
      <p className="sl-chapter-body">{chapter.body}</p>
      {chapter.steps && (
        <ol className="sl-steps">
          {chapter.steps.map((s, i) => (
            <li key={i} className="sl-step-item">
              <span className="sl-step-num">{i + 1}</span>{s}
            </li>
          ))}
        </ol>
      )}
      <div className="sl-fact-box">
        <FaLightbulb className="sl-fact-icon" />
        <span>{chapter.fact}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   QUIZ
───────────────────────────────────────────── */
function QuizSection({ questions, onComplete, moduleColor }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  const q = questions[current];
  const choose = (idx) => { if (selected !== null) return; setSelected(idx); };

  const next = () => {
    const newAnswers = [...answers, selected];
    if (current + 1 >= questions.length) {
      setAnswers(newAnswers);
      setFinished(true);
      const score = newAnswers.filter((a, i) => a === questions[i].answer).length;
      onComplete(score, questions.length);
    } else {
      setAnswers(newAnswers); setCurrent(current + 1); setSelected(null);
    }
  };

  if (finished) {
    const score = answers.filter((a, i) => a === questions[i].answer).length;
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="quiz-result">
        <div className="quiz-trophy"><FaTrophy /></div>
        <h3>Quiz Complete!</h3>
        <p className="quiz-score-text">{score} / {questions.length} correct</p>
        <div className="quiz-score-bar-wrap">
          <div className="quiz-score-bar" style={{ width: `${pct}%`, background: moduleColor }} />
        </div>
        <p className="quiz-score-pct">{pct}%</p>
        <p className="quiz-result-msg">
          {pct === 100 ? "🏆 Perfect score! You're a hygiene expert!" :
            pct >= 66 ? "🌟 Great work! You know your hygiene facts." :
              "📚 Keep reading — you'll ace it next time!"}
        </p>
      </div>
    );
  }

  return (
    <div className="quiz-wrap">
      <p className="quiz-count">Question {current + 1} of {questions.length}</p>
      <p className="quiz-question">{q.q}</p>
      <div className="quiz-options">
        {q.options.map((opt, i) => {
          let cls = "quiz-option";
          if (selected !== null) {
            if (i === q.answer) cls += " quiz-correct";
            else if (i === selected) cls += " quiz-wrong";
          }
          return (
            <button key={i} className={cls} onClick={() => choose(i)}
              style={selected !== null && i === q.answer ? { borderColor: moduleColor } : {}}>
              <span className="quiz-opt-letter">{String.fromCharCode(65 + i)}</span>
              {opt}
              {selected !== null && i === q.answer && <FaCheck className="quiz-check-icon" />}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <button className="quiz-next-btn" style={{ background: moduleColor }} onClick={next}>
          {current + 1 < questions.length ? "Next Question →" : "See Results"}
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   LEARN MODAL  (saves progress to backend)
───────────────────────────────────────────── */
function LearnModal({ module: mod, savedProgress, onClose, onProgressSaved, user }) {
  const [stage, setStage] = useState("intro");
  const [chapterIdx, setChapterIdx] = useState(savedProgress?.lastChapter ?? 0);
  const [finalScore, setFinalScore] = useState(savedProgress?.quizScore ?? null);
  const [quizTotal, setQuizTotal] = useState(savedProgress?.quizTotal ?? null);
  const [saving, setSaving] = useState(false);

  const totalChapters = mod.chapters.length;

  useEffect(() => {
    if (savedProgress?.moduleFinished) setStage("done");
  }, [savedProgress]);

  const saveProgress = useCallback(async (update) => {
    if (!user) return;
    setSaving(true);
    try {
      await axios.post(`${API}/modules`, { moduleId: mod.id, ...update }, authHeader());
      onProgressSaved(mod.id, update);
    } catch (e) {
      console.error("Failed to save module progress", e);
    } finally {
      setSaving(false);
    }
  }, [mod.id, user, onProgressSaved]);

  const prevChapter = () => setChapterIdx((i) => Math.max(0, i - 1));

  const nextChapter = () => {
    if (chapterIdx < totalChapters - 1) {
      const next = chapterIdx + 1;
      setChapterIdx(next);
      saveProgress({ lastChapter: next, moduleFinished: false });
    } else {
      setStage("quiz");
    }
  };

  const handleQuizDone = async (score, total) => {
    setFinalScore(score); setQuizTotal(total); setStage("done");
    await saveProgress({ lastChapter: totalChapters - 1, moduleFinished: true, quizScore: score, quizTotal: total });
  };

  const restart = () => {
    setStage("intro"); setChapterIdx(0); setFinalScore(null); setQuizTotal(null);
    saveProgress({ lastChapter: 0, moduleFinished: false, quizScore: null, quizTotal: null });
  };

  const progressPct =
    stage === "intro" ? 0 :
    stage === "chapters" ? Math.round(((chapterIdx + 1) / totalChapters) * 70) :
    stage === "quiz" ? 80 : 100;

  return (
    <div className="learn-modal-overlay" onClick={onClose}>
      <div className="learn-modal" onClick={(e) => e.stopPropagation()}>
        <div className="learn-modal-header" style={{ background: mod.colorLight, borderBottom: `3px solid ${mod.color}` }}>
          <div className="learn-modal-title">
            <span className="learn-modal-emoji">{mod.emoji}</span>
            <div>
              <h2 style={{ color: mod.color }}>{mod.title}</h2>
              <p className="learn-modal-subtitle">
                {totalChapters} chapters · {mod.quiz.length} quiz questions
                {saving && <span className="lm-saving"><FaSpinner className="spin-icon" /> saving…</span>}
              </p>
            </div>
          </div>
          <button className="learn-modal-close" onClick={onClose}><FaTimes /></button>
        </div>

        <div className="learn-progress-wrap">
          <div className="learn-progress-bar" style={{ width: `${progressPct}%`, background: mod.color }} />
        </div>

        <div className="learn-modal-body">
          {/* INTRO */}
          {stage === "intro" && (
            <div className="learn-intro">
              <div className="learn-intro-icon" style={{ color: mod.color, background: mod.colorLight }}>{mod.emoji}</div>
              <h3>Welcome to <span style={{ color: mod.color }}>{mod.title}</span></h3>
              <p>This module has <strong>{totalChapters} chapters</strong> and a <strong>{mod.quiz.length}-question quiz</strong>.</p>
              {savedProgress && !savedProgress.moduleFinished && savedProgress.lastChapter > 0 && (
                <div className="lm-resume-banner" style={{ borderColor: mod.color }}>
                  <span>📌 You left off at Chapter {savedProgress.lastChapter + 1}</span>
                  <button style={{ color: mod.color }}
                    onClick={() => { setChapterIdx(savedProgress.lastChapter); setStage("chapters"); }}>
                    Resume →
                  </button>
                </div>
              )}
              <ul className="learn-intro-list">
                {mod.chapters.map((c, i) => (
                  <li key={i}><span style={{ color: mod.color, marginRight: 8 }}>📖</span>{c.heading}</li>
                ))}
              </ul>
              <button className="learn-start-btn" style={{ background: mod.color }}
                onClick={() => { setChapterIdx(0); setStage("chapters"); saveProgress({ lastChapter: 0, moduleFinished: false }); }}>
                <FaBookOpen /> {savedProgress?.lastChapter > 0 ? "Start Over" : "Start Reading"}
              </button>
            </div>
          )}

          {/* CHAPTERS */}
          {stage === "chapters" && (
            <div className="learn-chapters">
              <ChapterReader chapter={mod.chapters[chapterIdx]} index={chapterIdx} total={totalChapters} />
              {mod.id === "personal" && chapterIdx === 1 && <HandwashTimer />}
              <div className="learn-chapter-nav">
                <button className="sl-nav-btn sl-nav-prev" onClick={prevChapter} disabled={chapterIdx === 0}>
                  <FaChevronLeft /> Back
                </button>
                <div className="sl-chapter-dots">
                  {mod.chapters.map((_, i) => (
                    <span key={i} className={`sl-dot ${i === chapterIdx ? "sl-dot-active" : i < chapterIdx ? "sl-dot-done" : ""}`}
                      style={i === chapterIdx ? { background: mod.color } : i < chapterIdx ? { background: mod.color, opacity: 0.4 } : {}} />
                  ))}
                </div>
                <button className="sl-nav-btn sl-nav-next" style={{ background: mod.color }} onClick={nextChapter}>
                  {chapterIdx < totalChapters - 1 ? <><span>Next</span><FaChevronRight /></> : <><span>Take Quiz</span><FaChevronRight /></>}
                </button>
              </div>
            </div>
          )}

          {/* QUIZ */}
          {stage === "quiz" && (
            <div className="learn-quiz">
              <div className="quiz-header">
                <FaStar style={{ color: mod.color }} /> <span style={{ color: mod.color }}>Knowledge Check</span>
              </div>
              <QuizSection questions={mod.quiz} onComplete={handleQuizDone} moduleColor={mod.color} />
            </div>
          )}

          {/* DONE */}
          {stage === "done" && (
            <div className="learn-done">
              <div className="learn-done-badge" style={{ background: mod.colorLight, border: `3px solid ${mod.color}` }}>
                <FaTrophy style={{ color: mod.color }} />
              </div>
              <h3>Module Complete! 🎉</h3>
              <p>You scored <strong style={{ color: mod.color }}>{finalScore}/{quizTotal}</strong> on the <em>{mod.title}</em> quiz.</p>
              <div className="learn-done-stars">
                {[...Array(3)].map((_, i) => (
                  <FaStar key={i} style={{ color: finalScore / quizTotal >= (i + 1) / 3 ? "#f59e0b" : "#e5e7eb", fontSize: 28 }} />
                ))}
              </div>
              <p className="learn-done-tip">
                <FaFire style={{ color: "#ff6b6b" }} />{" "}
                {finalScore === quizTotal ? "Perfect score! You've mastered this topic." : "Review the chapters and try again to master this module!"}
              </p>
              <div className="learn-done-actions">
                <button className="learn-done-retry" onClick={restart}><FaRedo /> Retake Module</button>
                <button className="learn-done-close" style={{ background: mod.color }} onClick={onClose}>Back to Hygiene</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SUMMARY BAR
───────────────────────────────────────────── */
function SummaryBar({ summary }) {
  if (!summary) return null;
  const details = summary.moduleDetails || [];
  const quizzed = details.filter((m) => m.quizScore != null);
  const avgScore = quizzed.length
    ? Math.round(quizzed.reduce((a, m) => a + (m.quizScore / m.quizTotal) * 100, 0) / quizzed.length)
    : null;

  return (
    <div className="hygiene-summary-bar">
      <div className="hsb-item">
        <span className="hsb-icon">🔥</span>
        <div>
          <p className="hsb-val">{summary.streak}</p>
          <p className="hsb-label">Day Streak</p>
        </div>
      </div>
      <div className="hsb-divider" />
      <div className="hsb-item">
        <span className="hsb-icon">📚</span>
        <div>
          <p className="hsb-val">{summary.modulesCompleted}/{summary.modulesTotal}</p>
          <p className="hsb-label">Modules Done</p>
        </div>
      </div>
      <div className="hsb-divider" />
      <div className="hsb-item">
        <span className="hsb-icon">⭐</span>
        <div>
          <p className="hsb-val">{avgScore !== null ? `${avgScore}%` : "—"}</p>
          <p className="hsb-label">Avg Quiz Score</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const HygieneAwareness = ({ user, handleLogout }) => {
  const today = todayStr();

  const [tracker, setTracker] = useState([
    { task: "🧼 Washed my hands properly", done: false },
    { task: "🪥 Brushed my teeth twice", done: false },
    { task: "🚿 Took a shower", done: false },
    { task: "👕 Wore clean clothes", done: false },
    { task: "🧹 Kept my space clean", done: false },
  ]);
  const [trackerMessage, setTrackerMessage] = useState("");
  const [trackerSaving, setTrackerSaving] = useState(false);
  const [trackerLoading, setTrackerLoading] = useState(false);

  const [moduleProgress, setModuleProgress] = useState({});
  const [modulesLoading, setModulesLoading] = useState(false);

  const [summary, setSummary] = useState(null);

  const [activeLearnModule, setActiveLearnModule] = useState(null);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);

  /* Load backend data on mount */
  useEffect(() => {
    if (!user) return;
    loadTrackerState();
    loadModuleProgress();
    loadSummary();
  }, [user]);

  const loadTrackerState = async () => {
    setTrackerLoading(true);
    try {
      const res = await axios.get(`${API}/tracker?date=${today}`, authHeader());
      const { trackerItems } = res.data;
      if (trackerItems && trackerItems.length === tracker.length) {
        setTracker((prev) => prev.map((t, i) => ({ ...t, done: trackerItems[i] })));
      }
    } catch (e) { console.error("Tracker load failed", e); }
    finally { setTrackerLoading(false); }
  };

  const loadModuleProgress = async () => {
    setModulesLoading(true);
    try {
      const res = await axios.get(`${API}/modules`, authHeader());
      const map = {};
      res.data.modules.forEach((m) => { map[m.moduleId] = m; });
      setModuleProgress(map);
    } catch (e) { console.error("Modules load failed", e); }
    finally { setModulesLoading(false); }
  };

  const loadSummary = async () => {
    try {
      const res = await axios.get(`${API}/summary`, authHeader());
      setSummary(res.data);
    } catch (e) { console.error("Summary load failed", e); }
  };

  /* Tracker toggle — auto-saves on every checkbox change */
  const toggleTracker = async (index) => {
    const updated = tracker.map((t, i) => i === index ? { ...t, done: !t.done } : t);
    setTracker(updated);
    if (!user) return;
    try {
      await axios.post(`${API}/tracker`, {
        date: today,
        trackerItems: updated.map((t) => t.done),
        trackerCompleted: false,
      }, authHeader());
    } catch (e) { console.error("Tracker toggle save failed", e); }
  };

  /* Done button — marks completion and updates streak */
  const finishTracker = async () => {
    const completed = tracker.filter((t) => t.done).length;
    const allDone = completed === tracker.length;
    if (!user) {
      setTrackerMessage(allDone ? "🎉 Amazing! You completed all habits today!" : `👍 Good effort! ${completed}/${tracker.length} done.`);
      return;
    }
    setTrackerSaving(true);
    try {
      await axios.post(`${API}/tracker`, {
        date: today,
        trackerItems: tracker.map((t) => t.done),
        trackerCompleted: allDone,
      }, authHeader());
      setTrackerMessage(allDone
        ? "🎉 Amazing! Saved — streak updated!"
        : `👍 Good effort! ${completed}/${tracker.length} habits saved.`);
      await loadSummary();
    } catch (e) {
      setTrackerMessage("⚠️ Couldn't save — please try again.");
    } finally {
      setTrackerSaving(false);
    }
  };

  /* Module progress callback from LearnModal */
  const handleProgressSaved = useCallback((moduleId, update) => {
    setModuleProgress((prev) => ({ ...prev, [moduleId]: { ...prev[moduleId], ...update } }));
    loadSummary();
  }, []);

  /* Module card badge */
  const getModuleBadge = (modId) => {
    const p = moduleProgress[modId];
    if (!p) return null;
    if (p.moduleFinished) return { label: "✅ Completed", color: "#22c55e" };
    if (p.lastChapter > 0) return { label: `📖 Ch. ${p.lastChapter + 1}`, color: "#f59e0b" };
    return null;
  };

  /* Original data */
  const slides = [
    { title: "Wash Your Hands", text: "Wash your hands with soap and water for at least 20 seconds to remove germs.", icon: <FaSoap size={80} color="#6c8cff" /> },
    { title: "Brush Your Teeth", text: "Brush your teeth twice a day to keep your mouth clean and prevent cavities.", icon: <FaTooth size={80} color="#6c8cff" /> },
    { title: "Drink Clean Water", text: "Drink enough clean water daily to stay hydrated and healthy.", icon: <FaTint size={80} color="#6c8cff" /> },
    { title: "Clean Your Surroundings", text: "Regularly clean surfaces and your living space to reduce germs.", icon: <FaBroom size={80} color="#6c8cff" /> },
  ];

  const categories = [
    { icon: <FaSoap className="category-icon" />, title: "Personal Hygiene", description: "Learn daily habits such as bathing, oral care, handwashing, and grooming.", details: `🛁 Personal Hygiene — Your Daily Superpower!\n\n✨ Simple habits:\n• 🧼 Wash hands with soap for 20 seconds\n• 🪥 Brush teeth morning and night\n• 🚿 Take regular showers\n• ✂️ Keep nails clean` },
    { icon: <FaUtensils className="category-icon" />, title: "Food Hygiene", description: "Understand how to handle and store food safely.", details: `🍎 Food Hygiene\n\n• 🧽 Wash fruits and vegetables\n• 🔥 Cook food properly\n• 🥩 Separate raw and cooked food\n• 🧊 Store leftovers in fridge` },
    { icon: <FaHome className="category-icon" />, title: "Home Hygiene", description: "Keep your living environment clean.", details: `🏡 Home Hygiene\n\n• 🧽 Clean surfaces\n• 🗑️ Dispose trash\n• 🛏️ Wash bedsheets\n• 🍽️ Keep kitchen clean` },
    { icon: <FaShieldAlt className="category-icon" />, title: "Public Hygiene", description: "Safe practices in public places.", details: `🌍 Public Hygiene\n\n• 🧴 Use sanitizer\n• 🤧 Cover coughs\n• 🙅 Avoid touching face\n• 🚮 Dispose waste properly` },
  ];

  const dailyTips = [
    { icon: <FaClock />, text: "Wash hands for 20 seconds" },
    { icon: <FaTooth />, text: "Brush teeth twice daily" },
    { icon: <FaTint />, text: "Drink enough water" },
    { icon: <FaBroom />, text: "Clean surfaces" },
    { icon: <FaApple />, text: "Wash fruits" },
    { icon: <FaMoon />, text: "Maintain good sleep" },
    { icon: <FaHandHoldingWater />, text: "Use hand sanitizer when outside" },
    { icon: <FaShieldAlt />, text: "Cover your mouth when coughing" },
    { icon: <FaHeart />, text: "Change towels regularly" },
  ];

  return (
    <>
      <div className="hygiene-page">
        <Navbar user={user} handleLogout={handleLogout} />

        <div className="container" style={{ paddingTop: "100px" }}>

          {/* HERO */}
          <section className="hygiene-hero">
            <div className="hero-content">
              <h1>Hygiene &amp; Awareness</h1>
              <p className="hero-subtitle">Healthy habits that protect you and your community.</p>
              <button className="hero-button" onClick={() => setShowSlideshow(true)}>Start Learning</button>
            </div>
            <div className="hero-icon"><FaHandHoldingWater size={120} color="#6c8cff" /></div>
          </section>

          {/* SUMMARY BAR */}
          {user && <SummaryBar summary={summary} />}

          {/* NOT LOGGED IN BANNER */}
          {!user && (
            <div className="hygiene-login-banner">
              <FaLock />
              <span>Log in to save your progress, streaks, and quiz scores across sessions.</span>
            </div>
          )}

          {/* LEARN MODULES */}
          <section className="learn-modules-section">
            <h2 className="section-title">📚 Start Learning — Choose a Topic</h2>
            <p className="learn-modules-subtitle">
              Each module includes in-depth chapters and a quiz.{" "}
              {user ? "Your progress is saved automatically." : "Log in to save progress."}
            </p>
            <div className="learn-modules-grid">
              {LEARN_MODULES.map((mod) => {
                const badge = getModuleBadge(mod.id);
                const prog = moduleProgress[mod.id];
                return (
                  <div key={mod.id} className="learn-module-card" style={{ borderTop: `4px solid ${mod.color}` }}>
                    <div className="lmc-top-row">
                      <div className="lmc-emoji">{mod.emoji}</div>
                      {badge && <span className="lmc-badge" style={{ color: badge.color }}>{badge.label}</span>}
                    </div>
                    <h3 style={{ color: mod.color }}>{mod.title}</h3>
                    <p className="lmc-meta">{mod.chapters.length} chapters · {mod.quiz.length} questions</p>
                    <ul className="lmc-preview">
                      {mod.chapters.slice(0, 2).map((c, i) => (
                        <li key={i}><FaChevronRight style={{ color: mod.color, fontSize: 10 }} /> {c.heading}</li>
                      ))}
                      {mod.chapters.length > 2 && <li style={{ color: "#999", fontSize: 13 }}>+ {mod.chapters.length - 2} more chapters…</li>}
                    </ul>
                    {prog?.moduleFinished && prog?.quizScore != null && (
                      <p className="lmc-quiz-score" style={{ color: mod.color }}>
                        Last quiz: {prog.quizScore}/{prog.quizTotal}
                      </p>
                    )}
                    <button className="lmc-btn" style={{ background: mod.color }} onClick={() => setActiveLearnModule(mod)}>
                      <FaBookOpen />
                      {prog?.moduleFinished ? "Review Module" : prog?.lastChapter > 0 ? "Continue Module" : "Start Module"}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* CATEGORIES */}
          <section className="categories-section">
            <h2 className="section-title">Hygiene Categories</h2>
            <div className="categories-grid">
              {categories.map((cat, idx) => (
                <div className="category-card" key={idx}>
                  <div className="category-icon-wrapper">{cat.icon}</div>
                  <h3>{cat.title}</h3>
                  <p>{cat.description}</p>
                  <button className="category-button" onClick={() => setSelectedCategory(cat)}>Learn More</button>
                </div>
              ))}
            </div>
          </section>

          {/* TIPS */}
          <section className="tips-section">
            <h2 className="section-title">Daily Hygiene Tips</h2>
            <div className="tips-grid">
              {dailyTips.map((tip, idx) => (
                <div className="tip-card" key={idx}>
                  <span className="tip-icon">{tip.icon}</span>
                  <p>{tip.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* TRACKER */}
          <section className="tracker-section">
            <h2 className="section-title">Daily Hygiene Tracker</h2>
            {trackerLoading ? (
              <div className="tracker-loading"><FaSpinner className="spin-icon" /> Loading your tracker…</div>
            ) : (
              <div className="tracker-card">
                {tracker.map((item, index) => (
                  <label key={index} className="tracker-item">
                    <input type="checkbox" checked={item.done} onChange={() => toggleTracker(index)} />
                    {item.task}
                  </label>
                ))}
                <button className="tracker-button" onClick={finishTracker} disabled={trackerSaving}>
                  {trackerSaving ? <><FaSpinner className="spin-icon" /> Saving…</> : "Done"}
                </button>
                {trackerMessage && <p className="tracker-message">{trackerMessage}</p>}
                {!user && <p className="tracker-note">💡 Log in to save your daily streak</p>}
              </div>
            )}
          </section>

        </div>
        <Footer />
      </div>

      {/* SLIDESHOW MODAL */}
      {showSlideshow && (
        <div className="modal-overlay" onClick={() => setShowSlideshow(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowSlideshow(false)}><FaTimes /></button>
            <div style={{ textAlign: "center", padding: "20px" }}>
              {slides[currentSlide].icon}
              <h2>{slides[currentSlide].title}</h2>
              <p>{slides[currentSlide].text}</p>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
                <button className="category-button" onClick={() => setCurrentSlide((s) => Math.max(0, s - 1))} disabled={currentSlide === 0}>← Prev</button>
                <span>{currentSlide + 1} / {slides.length}</span>
                <button className="category-button" onClick={() => setCurrentSlide((s) => Math.min(slides.length - 1, s + 1))} disabled={currentSlide === slides.length - 1}>Next →</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {selectedCategory && (
        <div className="modal-overlay" onClick={() => setSelectedCategory(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedCategory(null)}><FaTimes /></button>
            <h2>{selectedCategory.title}</h2>
            <div className="modal-details">
              {selectedCategory.details.split("\n").map((line, i) =>
                line.trim() && <p key={i} className="modal-line">{line}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LEARN MODAL */}
      {activeLearnModule && (
        <LearnModal
          module={activeLearnModule}
          savedProgress={moduleProgress[activeLearnModule.id] || null}
          onClose={() => setActiveLearnModule(null)}
          onProgressSaved={handleProgressSaved}
          user={user}
        />
      )}
    </>
  );
};

export default HygieneAwareness;
