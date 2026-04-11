/**
 * seedDoctors.js — Seeds 10 Bangladeshi doctors into MongoDB
 * Run: node seedDoctors.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const Doctor = require("./models/Doctor");

const DOCTORS = [
  {
    name:       "Dr. Arif Rahman",
    initials:   "AR",
    spec:       "MBBS, MD · Cardiologist · Dhaka Medical",
    specialty:  "Cardiologist",
    location:   "Dhaka Medical College Hospital",
    phone:      "+880-1711-234567",
    exp:        "15 yrs experience",
    available:  true,
    nextSlot:   null,
    avatarBg:   "#fee2e2",
    avatarColor:"#dc2626",
    badgeBg:    "#fee2e2",
    badgeColor: "#dc2626",
  },
  {
    name:       "Dr. Nasrin Sultana",
    initials:   "NS",
    spec:       "MBBS, FCPS · General Physician · BSMMU",
    specialty:  "General",
    location:   "BSMMU, Shahbag",
    phone:      "+880-1812-345678",
    exp:        "10 yrs experience",
    available:  true,
    nextSlot:   null,
    avatarBg:   "#dcfce7",
    avatarColor:"#16a34a",
    badgeBg:    "#dcfce7",
    badgeColor: "#16a34a",
  },
  {
    name:       "Dr. Kamal Hossain",
    initials:   "KH",
    spec:       "MBBS, DDV · Dermatologist · Square Hospital",
    specialty:  "Dermatologist",
    location:   "Square Hospital, Panthapath",
    phone:      "+880-1913-456789",
    exp:        "12 yrs experience",
    available:  false,
    nextSlot:   "Today 4:00 PM",
    avatarBg:   "#fef9c3",
    avatarColor:"#ca8a04",
    badgeBg:    "#fef9c3",
    badgeColor: "#ca8a04",
  },
  {
    name:       "Dr. Farhana Akter",
    initials:   "FA",
    spec:       "MBBS, MD · Neurologist · Apollo Hospital",
    specialty:  "Neurologist",
    location:   "Apollo Hospital, Bashundhara",
    phone:      "+880-1614-567890",
    exp:        "8 yrs experience",
    available:  false,
    nextSlot:   "Tomorrow 10:00 AM",
    avatarBg:   "#ede9fe",
    avatarColor:"#7c3aed",
    badgeBg:    "#ede9fe",
    badgeColor: "#7c3aed",
  },
  {
    name:       "Dr. Rezaul Karim",
    initials:   "RK",
    spec:       "MBBS, DCH · Pediatrician · Shishu Hospital",
    specialty:  "Pediatrician",
    location:   "Bangladesh Shishu Hospital, Mirpur",
    phone:      "+880-1715-678901",
    exp:        "18 yrs experience",
    available:  true,
    nextSlot:   null,
    avatarBg:   "#dbeafe",
    avatarColor:"#2563eb",
    badgeBg:    "#dbeafe",
    badgeColor: "#2563eb",
  },
  {
    name:       "Dr. Mitu Begum",
    initials:   "MB",
    spec:       "MBBS, FCPS · Cardiologist · United Hospital",
    specialty:  "Cardiologist",
    location:   "United Hospital, Gulshan",
    phone:      "+880-1816-789012",
    exp:        "14 yrs experience",
    available:  false,
    nextSlot:   "Today 6:00 PM",
    avatarBg:   "#fee2e2",
    avatarColor:"#dc2626",
    badgeBg:    "#fee2e2",
    badgeColor: "#dc2626",
  },
  {
    name:       "Dr. Shafiqul Islam",
    initials:   "SI",
    spec:       "MBBS, MD · General Physician · Popular Hospital",
    specialty:  "General",
    location:   "Popular Diagnostic Centre, Dhanmondi",
    phone:      "+880-1917-890123",
    exp:        "7 yrs experience",
    available:  true,
    nextSlot:   null,
    avatarBg:   "#dcfce7",
    avatarColor:"#16a34a",
    badgeBg:    "#dcfce7",
    badgeColor: "#16a34a",
  },
  {
    name:       "Dr. Tahmina Khatun",
    initials:   "TK",
    spec:       "MBBS, FCPS · Dermatologist · Ibn Sina",
    specialty:  "Dermatologist",
    location:   "Ibn Sina Hospital, Indira Road",
    phone:      "+880-1618-901234",
    exp:        "9 yrs experience",
    available:  true,
    nextSlot:   null,
    avatarBg:   "#fef9c3",
    avatarColor:"#ca8a04",
    badgeBg:    "#fef9c3",
    badgeColor: "#ca8a04",
  },
  {
    name:       "Dr. Mahbubur Rahman",
    initials:   "MR",
    spec:       "MBBS, MD · Neurologist · Evermore Hospital",
    specialty:  "Neurologist",
    location:   "Evermore Medical Center, Uttara",
    phone:      "+880-1719-012345",
    exp:        "11 yrs experience",
    available:  false,
    nextSlot:   "Tomorrow 2:00 PM",
    avatarBg:   "#ede9fe",
    avatarColor:"#7c3aed",
    badgeBg:    "#ede9fe",
    badgeColor: "#7c3aed",
  },
  {
    name:       "Dr. Ayesha Siddiqua",
    initials:   "AS",
    spec:       "MBBS, DCH · Pediatrician · Child & Mother Care",
    specialty:  "Pediatrician",
    location:   "Child & Mother Care, Mohakhali",
    phone:      "+880-1820-123456",
    exp:        "6 yrs experience",
    available:  true,
    nextSlot:   null,
    avatarBg:   "#dbeafe",
    avatarColor:"#2563eb",
    badgeBg:    "#dbeafe",
    badgeColor: "#2563eb",
  },
];

async function seedDoctors() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const existing = await Doctor.countDocuments();
    if (existing > 0) {
      console.log(`⚠️  ${existing} doctors already exist. Clearing and re-seeding...`);
      await Doctor.deleteMany({});
    }

    await Doctor.insertMany(DOCTORS);
    console.log(`✅ Seeded ${DOCTORS.length} doctors successfully!`);
    console.log("\nDoctors list:");
    DOCTORS.forEach((d, i) => console.log(`  ${i + 1}. ${d.name} — ${d.specialty} — ${d.location}`));

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

seedDoctors();
