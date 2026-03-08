import "./HygieneAwareness.css";
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FaHandHoldingWater,
  FaSoap,
  FaUtensils,
  FaHome,
  FaShieldAlt,
  FaHeart,
  FaTint,
  FaMoon,
  FaClock,
  FaBroom,
  FaTooth,
  FaApple,
  FaTimes,
} from "react-icons/fa";

const HygieneAwareness = ({ user, handleLogout }) => {
  const [checklist, setChecklist] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  const [feedback, setFeedback] = useState("");
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null); // for modal

  const toggleCheck = (index) => {
    const updated = [...checklist];
    updated[index] = !updated[index];
    setChecklist(updated);
  };

  const handleCheckHabits = () => {
    const allChecked = checklist.every((item) => item === true);

    setFeedback(
      allChecked
        ? "Great! You’re maintaining good hygiene habits."
        : "You may need to improve some daily hygiene routines."
    );
  };

  const slides = [
    {
      title: "Wash Your Hands",
      text: "Wash your hands with soap and water for at least 20 seconds to remove germs.",
      icon: <FaSoap size={80} color="#6c8cff" />,
    },
    {
      title: "Brush Your Teeth",
      text: "Brush your teeth twice a day to keep your mouth clean and prevent cavities.",
      icon: <FaTooth size={80} color="#6c8cff" />,
    },
    {
      title: "Drink Clean Water",
      text: "Drink enough clean water daily to stay hydrated and healthy.",
      icon: <FaTint size={80} color="#6c8cff" />,
    },
    {
      title: "Clean Your Surroundings",
      text: "Regularly clean surfaces and your living space to reduce germs.",
      icon: <FaBroom size={80} color="#6c8cff" />,
    },
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const categories = [
    {
      icon: <FaSoap className="category-icon" />,
      title: "Personal Hygiene",
      description:
        "Learn daily habits such as bathing, oral care, handwashing, and grooming.",
      details: `
🛁 Personal Hygiene — Your Daily Superpower!

✨ Simple habits:
• 🧼 Wash hands with soap for 20 seconds
• 🪥 Brush teeth morning and night
• 🚿 Take regular showers
• ✂️ Keep nails clean
`,
    },
    {
      icon: <FaUtensils className="category-icon" />,
      title: "Food Hygiene",
      description: "Understand how to handle and store food safely.",
      details: `
🍎 Food Hygiene

• 🧽 Wash fruits and vegetables
• 🔥 Cook food properly
• 🥩 Separate raw and cooked food
• 🧊 Store leftovers in fridge
`,
    },
    {
      icon: <FaHome className="category-icon" />,
      title: "Home Hygiene",
      description: "Keep your living environment clean.",
      details: `
🏡 Home Hygiene

• 🧽 Clean surfaces
• 🗑️ Dispose trash
• 🛏️ Wash bedsheets
• 🍽️ Keep kitchen clean
`,
    },
    {
      icon: <FaShieldAlt className="category-icon" />,
      title: "Public Hygiene",
      description: "Safe practices in public places.",
      details: `
🌍 Public Hygiene

• 🧴 Use sanitizer
• 🤧 Cover coughs
• 🙅 Avoid touching face
• 🚮 Dispose waste properly
`,
    },
  ];

  const dailyTips = [
    { icon: <FaClock />, text: "Wash hands for 20 seconds" },
    { icon: <FaTooth />, text: "Brush teeth twice daily" },
    { icon: <FaTint />, text: "Drink enough water" },
    { icon: <FaBroom />, text: "Clean surfaces" },
    { icon: <FaApple />, text: "Wash fruits" },
    { icon: <FaMoon />, text: "Maintain good sleep" },
    // Additional tips
    { icon: <FaHandHoldingWater />, text: "Use hand sanitizer when outside" },
    { icon: <FaShieldAlt />, text: "Cover your mouth when coughing" },
    { icon: <FaHeart />, text: "Change towels regularly" },
  ];

  const [tracker, setTracker] = useState([
    { task: "🧼 Washed my hands properly", done: false },
    { task: "🪥 Brushed my teeth twice", done: false },
    { task: "🚿 Took a shower", done: false },
    { task: "👕 Wore clean clothes", done: false },
    { task: "🧹 Kept my space clean", done: false },
  ]);

  const [trackerMessage, setTrackerMessage] = useState("");

  const toggleTracker = (index) => {
    const updated = [...tracker];
    updated[index].done = !updated[index].done;
    setTracker(updated);
  };

  const finishTracker = () => {
    const completed = tracker.filter((t) => t.done).length;

    if (completed === tracker.length) {
      setTrackerMessage(
        "🎉 Amazing! You completed all your hygiene habits today!"
      );
    } else {
      setTrackerMessage(
        `👍 Good effort! You completed ${completed}/${tracker.length} habits today.`
      );
    }
  };

  // Close modal
  const closeModal = () => setSelectedCategory(null);

  return (
    <>
      <div className="hygiene-page">
        <Navbar user={user} handleLogout={handleLogout} />

        <div className="container" style={{ paddingTop: "100px" }}>
          <section className="hygiene-hero">
            <div className="hero-content">
              <h1>Hygiene & Awareness</h1>
              <p className="hero-subtitle">
                Healthy habits that protect you and your community.
              </p>

              <button
                className="hero-button"
                onClick={() => setShowSlideshow(true)}
              >
                Start Learning
              </button>
            </div>

            <div className="hero-icon">
              <FaHandHoldingWater size={120} color="#6c8cff" />
            </div>
          </section>

          <section className="categories-section">
            <h2 className="section-title">Hygiene Categories</h2>

            <div className="categories-grid">
              {categories.map((cat, idx) => (
                <div className="category-card" key={idx}>
                  <div className="category-icon-wrapper">{cat.icon}</div>
                  <h3>{cat.title}</h3>
                  <p>{cat.description}</p>

                  <button
                    className="category-button"
                    onClick={() => setSelectedCategory(cat)} // open modal with this category
                  >
                    Learn More
                  </button>
                </div>
              ))}
            </div>
          </section>

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

          <section className="tracker-section">
            <h2 className="section-title">Daily Hygiene Tracker</h2>

            <div className="tracker-card">
              {tracker.map((item, index) => (
                <label key={index} className="tracker-item">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleTracker(index)}
                  />
                  {item.task}
                </label>
              ))}

              <button className="tracker-button" onClick={finishTracker}>
                Done
              </button>

              {trackerMessage && (
                <p className="tracker-message">{trackerMessage}</p>
              )}
            </div>
          </section>
        </div>

        <Footer />
      </div>

      {/* Modal for Learn More */}
      {selectedCategory && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <FaTimes />
            </button>
            <h2>{selectedCategory.title}</h2>
            <div className="modal-details">
              {selectedCategory.details.split('\n').map((line, i) => (
                line.trim() && <p key={i} className="modal-line">{line}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HygieneAwareness;