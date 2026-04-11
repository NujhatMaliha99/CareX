// routes/health.routes.js
// Mount: app.use("/api", require("./routes/health.routes"))

const express = require("express");
const router  = express.Router();
const jwt     = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "carex-mental-health-secret-key-2026";

// ── Auth middleware — extracts userId from JWT ────────────────────────────
const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) { req.userId = null; return next(); }
  try {
    const decoded = jwt.verify(header.split(" ")[1], JWT_SECRET);
    req.userId = decoded.userId || decoded._id || decoded.id || null;
  } catch {
    req.userId = null;
  }
  next();
};

// ── Models ────────────────────────────────────────────────────────────────
const BMI     = require("../models/BMI");
const Habit   = require("../models/Habit");
const Water   = require("../models/Water");
const Symptom = require("../models/Symptom");
const Workout = require("../models/Workout");
const Doctor  = require("../models/Doctor");
const Booking = require("../models/Booking");
const Chat    = require("../models/Chat");
const Meal    = require("../models/Meal");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ═══════════════════════════════════════════════════════════════════════════
// BMI ROUTES
// ═══════════════════════════════════════════════════════════════════════════

router.post("/bmi", auth, async (req, res) => {
  try {
    const { weight, height, bmi } = req.body;
    if (!weight || !height || !bmi) return res.status(400).json({ message: "Missing fields" });
    const record = await BMI.create({
      userId: req.userId,
      weight: parseFloat(weight),
      height: parseFloat(height),
      bmi:    parseFloat(bmi),
    });
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/bmi/history", auth, async (req, res) => {
  try {
    const query   = req.userId ? { userId: req.userId } : {};
    const records = await BMI.find(query).sort({ createdAt: -1 }).limit(20);
    // Normalize date field for frontend
    const normalized = records.map(r => ({
      ...r.toObject(),
      date: r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-GB") : "—",
    }));
    res.json(normalized);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// HABITS ROUTES
// ═══════════════════════════════════════════════════════════════════════════

router.post("/habits", auth, async (req, res) => {
  try {
    const habits = req.body;
    const record = await Habit.create({ userId: req.userId, habits });
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/habits/history", auth, async (req, res) => {
  try {
    const query   = req.userId ? { userId: req.userId } : {};
    const records = await Habit.find(query).sort({ createdAt: -1 }).limit(30);
    const normalized = records.map(r => ({
      ...r.toObject(),
      date: r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-GB") : "—",
    }));
    res.json(normalized);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// WATER ROUTES
// ═══════════════════════════════════════════════════════════════════════════

router.post("/water", auth, async (req, res) => {
  try {
    const { water } = req.body;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const record = await Water.findOneAndUpdate(
      { userId: req.userId, date: { $gte: today } },
      { water: parseInt(water), date: new Date() },
      { upsert: true, new: true }
    );
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/water/history", auth, async (req, res) => {
  try {
    const query   = req.userId ? { userId: req.userId } : {};
    const records = await Water.find(query).sort({ createdAt: -1 }).limit(30);
    // Normalize: add glasses + goal fields for ProfilePage compatibility
    const normalized = records.map(r => ({
      ...r.toObject(),
      glasses: r.water || 0,
      goal:    8,
      date:    r.date ? new Date(r.date).toLocaleDateString("en-GB") : "—",
    }));
    res.json(normalized);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// SYMPTOMS ROUTES  (Gemini AI)
// ═══════════════════════════════════════════════════════════════════════════

async function callGeminiSymptom(symptomText) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "your_key_here") {
    return `Based on your symptoms: "${symptomText}" — Common causes include viral infections, fatigue, or stress. Stay hydrated and rest. If symptoms persist more than 48 hours or worsen, please consult a doctor immediately. ⚠️ This is not a medical diagnosis.`;
  }
  const prompt = `You are a helpful health assistant for a Bangladeshi health app. A user reports: "${symptomText}".
Provide a concise, helpful response (3-5 sentences):
1. Likely causes
2. Simple home care advice  
3. When to see a doctor
Be compassionate and non-alarming. End with a disclaimer that this is not a medical diagnosis.`;

  const response = await globalThis.fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] }),
    }
  );
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "No result from AI.";
}

router.post("/symptoms", auth, async (req, res) => {
  try {
    const { symptom } = req.body;
    if (!symptom) return res.status(400).json({ message: "Symptom required" });

    let aiResult = "";
    try {
      aiResult = await callGeminiSymptom(symptom);
    } catch (aiErr) {
      console.error("[Symptom AI]", aiErr.message);
      aiResult = `Symptoms: "${symptom}". Please consult a qualified doctor. ⚠️ Not a medical diagnosis.`;
    }

    const record = await Symptom.create({ userId: req.userId, symptom, aiResult });
    res.status(201).json({ ...record.toObject(), aiResult });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/symptoms/history", auth, async (req, res) => {
  try {
    const query   = req.userId ? { userId: req.userId } : {};
    const records = await Symptom.find(query).sort({ createdAt: -1 }).limit(50);
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// NUTRITION  (Open Food Facts + local DB fallback)
// ═══════════════════════════════════════════════════════════════════════════

const FOOD_DB = [
  { name:"Rice (cooked, 100g)",    calories:130, protein:2.7, carbs:28.2, fat:0.3 },
  { name:"Roti / Chapati (1 pc)",  calories:71,  protein:2.7, carbs:15.0, fat:0.4 },
  { name:"Paratha (1 pc)",         calories:160, protein:3.8, carbs:22.0, fat:7.0 },
  { name:"Dal (lentil, 100g)",     calories:116, protein:7.6, carbs:20.1, fat:0.4 },
  { name:"Chicken curry (100g)",   calories:165, protein:25.0,carbs:2.0,  fat:6.5 },
  { name:"Beef curry (100g)",      calories:218, protein:26.0,carbs:1.0,  fat:12.0},
  { name:"Fish curry (100g)",      calories:139, protein:20.0,carbs:1.5,  fat:6.0 },
  { name:"Hilsa fish (100g)",      calories:273, protein:21.8,carbs:0.0,  fat:19.4},
  { name:"Shrimp (100g)",          calories:99,  protein:24.0,carbs:0.2,  fat:0.3 },
  { name:"Tuna canned (100g)",     calories:116, protein:25.5,carbs:0.0,  fat:1.0 },
  { name:"Egg boiled (1 pc)",      calories:78,  protein:6.3, carbs:0.6,  fat:5.3 },
  { name:"Milk (250ml)",           calories:150, protein:8.0, carbs:12.0, fat:8.0 },
  { name:"Yogurt / Dahi (100g)",   calories:59,  protein:3.5, carbs:5.0,  fat:3.3 },
  { name:"Paneer (100g)",          calories:265, protein:18.3,carbs:1.2,  fat:20.8},
  { name:"Banana (1 medium)",      calories:89,  protein:1.1, carbs:23.0, fat:0.3 },
  { name:"Apple (1 medium)",       calories:95,  protein:0.5, carbs:25.0, fat:0.3 },
  { name:"Orange (1 medium)",      calories:62,  protein:1.2, carbs:15.4, fat:0.2 },
  { name:"Mango (100g)",           calories:60,  protein:0.8, carbs:15.0, fat:0.4 },
  { name:"Potato boiled (100g)",   calories:87,  protein:1.9, carbs:20.1, fat:0.1 },
  { name:"Sweet potato (100g)",    calories:86,  protein:1.6, carbs:20.1, fat:0.1 },
  { name:"Spinach (100g)",         calories:23,  protein:2.9, carbs:3.6,  fat:0.4 },
  { name:"Tomato (1 medium)",      calories:22,  protein:1.1, carbs:4.8,  fat:0.2 },
  { name:"Broccoli (100g)",        calories:34,  protein:2.8, carbs:7.0,  fat:0.4 },
  { name:"Carrot (100g)",          calories:41,  protein:0.9, carbs:9.6,  fat:0.2 },
  { name:"Cucumber (100g)",        calories:15,  protein:0.7, carbs:3.6,  fat:0.1 },
  { name:"Oats (100g)",            calories:389, protein:17.0,carbs:66.0, fat:7.0 },
  { name:"Bread white (1 slice)",  calories:79,  protein:2.7, carbs:15.0, fat:1.0 },
  { name:"Butter (1 tbsp)",        calories:102, protein:0.1, carbs:0.0,  fat:11.5},
  { name:"Almonds (10 pcs)",       calories:69,  protein:2.5, carbs:2.4,  fat:6.1 },
  { name:"Peanuts (100g)",         calories:567, protein:25.8,carbs:16.1, fat:49.2},
  { name:"Tea with milk (cup)",    calories:30,  protein:0.9, carbs:5.0,  fat:0.7 },
  { name:"Coffee black (cup)",     calories:2,   protein:0.3, carbs:0.0,  fat:0.0 },
  { name:"Fried rice (100g)",      calories:163, protein:3.4, carbs:28.0, fat:4.5 },
  { name:"Biriyani (100g)",        calories:200, protein:10.0,carbs:26.0, fat:6.0 },
  { name:"Khichuri (100g)",        calories:140, protein:5.5, carbs:24.0, fat:3.0 },
  { name:"Samosa (1 pc)",          calories:130, protein:4.0, carbs:16.0, fat:6.0 },
  { name:"Mishti doi (100g)",      calories:140, protein:4.5, carbs:25.0, fat:3.0 },
  { name:"Pasta cooked (100g)",    calories:158, protein:5.8, carbs:31.0, fat:0.9 },
  { name:"Pizza 1 slice",          calories:285, protein:12.0,carbs:36.0, fat:10.0},
  { name:"Burger medium",          calories:354, protein:20.0,carbs:29.0, fat:17.0},
  { name:"Dark chocolate (30g)",   calories:170, protein:2.2, carbs:13.0, fat:12.0},
  { name:"Ice cream (100ml)",      calories:207, protein:3.5, carbs:24.0, fat:11.0},
  { name:"Orange juice (200ml)",   calories:84,  protein:1.3, carbs:19.6, fat:0.2 },
  { name:"Coconut water (250ml)",  calories:48,  protein:1.9, carbs:8.9,  fat:0.5 },
  { name:"Cola drink (330ml)",     calories:139, protein:0.0, carbs:35.0, fat:0.0 },
  { name:"Corn (100g)",            calories:96,  protein:3.4, carbs:21.0, fat:1.5 },
  { name:"Lemon (1 medium)",       calories:17,  protein:0.6, carbs:5.4,  fat:0.2 },
];

router.get("/nutrition/search", async (req, res) => {
  try {
    const q = (req.query.q || "").toLowerCase().trim();
    if (!q || q.length < 2) return res.json([]);

    // Try Open Food Facts first (English results preferred)
    try {
      const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=12&fields=product_name,product_name_en,nutriments&languages=en`;
      const offRes  = await globalThis.fetch(url, { signal: AbortSignal.timeout(4000) });
      const offData = await offRes.json();
      if (offData.products?.length > 0) {
        const results = offData.products
          .filter(p => (p.product_name_en || p.product_name) && p.nutriments)
          // Filter out non-English names using a simple regex (allow basic punctuation)
          .filter(p => /^[A-Za-z0-9\s\-\(\)\,\.\']+$/.test(p.product_name_en || p.product_name))
          .slice(0, 8)
          .map(p => ({
            name:     p.product_name_en || p.product_name,
            calories: Math.round(p.nutriments["energy-kcal_100g"] || p.nutriments["energy-kcal"] || 0),
            protein:  Math.round(p.nutriments.proteins_100g || 0),
            carbs:    Math.round(p.nutriments.carbohydrates_100g || 0),
            fat:      Math.round(p.nutriments.fat_100g || 0),
          }))
          .filter(f => f.calories > 0);
        if (results.length > 0) return res.json(results);
      }
    } catch (offErr) {
      console.log("[Nutrition] OFF unavailable, using local DB");
    }

    // Fallback: local DB
    const local = FOOD_DB.filter(f => f.name.toLowerCase().includes(q)).slice(0, 8);
    res.json(local);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/nutrition/barcode/:code", async (req, res) => {
  try {
    const url  = `https://world.openfoodfacts.org/api/v0/product/${req.params.code}.json`;
    const resp = await globalThis.fetch(url, { signal: AbortSignal.timeout(5000) });
    const data = await resp.json();
    if (!data.product) return res.status(404).json({ message: "Product not found" });
    const p = data.product;
    res.json({
      name:     p.product_name || "Unknown product",
      calories: Math.round(p.nutriments?.["energy-kcal_100g"] || 0),
      protein:  Math.round(p.nutriments?.proteins_100g || 0),
      carbs:    Math.round(p.nutriments?.carbohydrates_100g || 0),
      fat:      Math.round(p.nutriments?.fat_100g || 0),
    });
  } catch (err) {
    res.status(500).json({ message: "Barcode lookup failed" });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// NUTRITION LOGGING ROUTES
// ═══════════════════════════════════════════════════════════════════════════

router.get("/nutrition/today", auth, async (req, res) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const query = req.userId ? { userId: req.userId, date: { $gte: today } } : { date: { $gte: today } };
    const meals = await Meal.find(query).sort({ createdAt: -1 });
    res.json(meals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/nutrition", auth, async (req, res) => {
  try {
    const { name, calories, protein, carbs, fat } = req.body;
    if (!name || !calories) return res.status(400).json({ message: "Missing fields" });
    const meal = await Meal.create({
      userId: req.userId,
      name,
      calories: parseFloat(calories),
      protein:  parseFloat(protein || 0),
      carbs:    parseFloat(carbs || 0),
      fat:      parseFloat(fat || 0),
      date:     new Date(),
    });
    res.status(201).json(meal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/nutrition/:id", auth, async (req, res) => {
  try {
    const query = req.userId ? { _id: req.params.id, userId: req.userId } : { _id: req.params.id };
    const deleted = await Meal.findOneAndDelete(query);
    if (!deleted) return res.status(404).json({ message: "Meal not found" });
    res.json({ message: "Meal deleted", deleted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// WORKOUT ROUTES
// ═══════════════════════════════════════════════════════════════════════════

router.post("/workout/log", auth, async (req, res) => {
  try {
    // Support both old field names (WorkoutPage) and new ones
    const {
      type, name, plan, duration, durationSeconds,
      exercisesDone, setsCompleted, totalExercises,
      caloriesBurned, date,
    } = req.body;

    const record = await Workout.create({
      userId:         req.userId,
      type:           plan || type || "General",
      name:           name || plan || "Workout",
      duration:       durationSeconds || duration || 0,
      exercisesDone:  setsCompleted || exercisesDone || 0,
      totalExercises: totalExercises || 0,
      caloriesBurned: caloriesBurned || 0,
    });
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/workout/history", auth, async (req, res) => {
  try {
    const query   = req.userId ? { userId: req.userId } : {};
    const records = await Workout.find(query).sort({ createdAt: -1 }).limit(30);
    // Normalize for ProfilePage compatibility
    const normalized = records.map(r => {
      const secs = r.duration || 0;
      const mins = Math.floor(secs / 60);
      return {
        ...r.toObject(),
        plan:     r.type || r.name || "Workout",
        date:     r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-GB") : "—",
        duration: mins > 0 ? `${mins} min` : `${secs}s`,
        sets:     r.exercisesDone || 0,
      };
    });
    res.json(normalized);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// DOCTORS ROUTES
// ═══════════════════════════════════════════════════════════════════════════

router.get("/doctors", async (req, res) => {
  try {
    const { specialty } = req.query;
    const query = specialty && specialty !== "All" ? { specialty } : {};
    const doctors = await Doctor.find(query).sort({ available: -1, name: 1 });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/doctors/search", async (req, res) => {
  try {
    const q = (req.query.q || "").toLowerCase();
    if (!q) { const all = await Doctor.find().sort({ available:-1 }); return res.json(all); }
    const map = {
      heart:["Cardiologist"], chest:["Cardiologist"], cardiac:["Cardiologist"], bp:["Cardiologist"],
      skin:["Dermatologist"],  rash:["Dermatologist"],  acne:["Dermatologist"], eczema:["Dermatologist"],
      brain:["Neurologist"],  head:["Neurologist"],   nerve:["Neurologist"],  migraine:["Neurologist"],
      child:["Pediatrician"], baby:["Pediatrician"],  kid:["Pediatrician"],   shishu:["Pediatrician"],
      fever:["General"], cold:["General"], cough:["General"], flu:["General"], diabetes:["General"],
    };
    const matched = [];
    for (const [kw, specs] of Object.entries(map)) {
      if (q.includes(kw)) matched.push(...specs);
    }
    const query = matched.length > 0 ? { specialty: { $in: [...new Set(matched)] } } : {};
    const doctors = await Doctor.find(query).sort({ available: -1 });
    res.json({ doctors });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/doctors/book", auth, async (req, res) => {
  try {
    const { doctorId, doctorName, preferredDate, note } = req.body;
    if (!doctorId) return res.status(400).json({ message: "doctorId required" });
    const booking = await Booking.create({
      userId:        req.userId,
      doctorId,
      doctorName,
      preferredDate: preferredDate ? new Date(preferredDate) : new Date(),
      note:          note || "",
      status:        "pending",
    });
    res.status(201).json({ message: "Booking request sent!", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/doctors/bookings", auth, async (req, res) => {
  try {
    const query    = req.userId ? { userId: req.userId } : {};
    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    // Normalize for ProfilePage appointments tab
    const normalized = bookings.map(b => ({
      ...b.toObject(),
      doctor: b.doctorName || "Doctor",
      spec:   "",
      date:   b.preferredDate ? new Date(b.preferredDate).toLocaleDateString("en-GB") : "—",
      time:   b.preferredDate ? new Date(b.preferredDate).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}) : "—",
      status: b.status ? b.status.charAt(0).toUpperCase()+b.status.slice(1) : "Pending",
    }));
    res.json(normalized);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function callGeminiDoctorResponse(doctor, userMessage, chatHistory = []) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "your_key_here") {
    return `Hello! I'm ${doctor.name}, your ${doctor.specialty}. I've received your message: "${userMessage}". Please note that I'm currently consulting other patients, but I recommend staying calm and monitoring your symptoms. If it's an emergency, call 999 immediately.`;
  }

  const historyText = chatHistory
    .slice(-5)
    .map(ct => `${ct.sender === "user" ? "Patient" : "Doctor"}: ${ct.message}`)
    .join("\n");

  const prompt = `You are ${doctor.name}, a professional ${doctor.specialty} at ${doctor.location}.
You are having a live chat with a patient through the CareX app.
Patient says: "${userMessage}"

Context (Last 5 messages):
${historyText || "No previous history."}

Instructions:
1. Reply as a compassionate, professional doctor.
2. Provide specific advice related to your specialty (${doctor.specialty}).
3. Keep the response concise (2-4 sentences).
4. Do not offer a formal diagnosis; suggest an appointment or specific immediate care steps.
5. Do not use markdown like bolding or lists, just plain text.
6. Friendly and encouraging tone.`;

  try {
    const response = await globalThis.fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] }),
      }
    );
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I'm having trouble connecting right now. Let me check my notes.";
  } catch (e) {
    console.error("[Doctor AI Error]", e.message);
    return `Hello, I'm ${doctor.name}. I understand your concern. Please ensure you are taking enough rest and staying hydrated. If the situation doesn't improve, please book an appointment for a closer look.`;
  }
}

router.post("/doctors/chat", auth, async (req, res) => {
  try {
    const { doctorId, message } = req.body;
    if (!doctorId || !message) return res.status(400).json({ message: "Missing fields" });

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // 1. Save User Message
    const userChat = await Chat.create({
      userId:   req.userId,
      doctorId,
      message,
      sender:   "user",
    });

    // Notify doctor room that user sent a message (optional if doctor is AI)
    if (req.io) {
      req.io.to(`doc-${doctorId}`).emit("new-message", {
        from: "user", message, doctorId, time: new Date().toISOString(),
      });
    }

    // 2. Generate and Save AI Doctor Response
    // Fetch recent history for context
    const history = await Chat.find({ userId: req.userId, doctorId }).sort({ createdAt: -1 }).limit(6);

    const docReplyText = await callGeminiDoctorResponse(doctor, message, history.reverse());

    const docChat = await Chat.create({
      userId:   req.userId,
      doctorId,
      message:  docReplyText,
      sender:   "doctor",
    });

    // 3. Emit AI response via Socket.io
    if (req.io) {
      // Small delay to make it feel "real"
      setTimeout(() => {
        req.io.emit("new-message", {
          from: "doc",
          fromName: doctor.name,
          message: docReplyText,
          doctorId,
          time: docChat.createdAt,
        });
      }, 1000);
    }

    res.status(201).json(userChat);
  } catch (err) {
    console.error("[Chat API Error]", err.message);
    res.status(500).json({ message: err.message });
  }
});

router.get("/doctors/chat/:doctorId", auth, async (req, res) => {
  try {
    const query    = req.userId
      ? { userId: req.userId, doctorId: req.params.doctorId }
      : { doctorId: req.params.doctorId };
    const messages = await Chat.find(query).sort({ createdAt: 1 }).limit(100);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;