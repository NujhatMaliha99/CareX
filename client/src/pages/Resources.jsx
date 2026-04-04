import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';

export default function Resources({ user, setUser, handleLogout }) {
  const navigate = useNavigate();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const resources = [
    {
      title: "Book an appointment",
      description: "Find doctors, clinics, hospitals and more",
      icon: "📅"
    },
    {
      title: "Chat with a doctor now",
      description: "Get a response within 5 minutes! 3 day free followup included",
      icon: "💬"
    },
    {
      title: "Order medicines",
      description: "Get medicines delivered to your doorstep",
      icon: "🛒"
    },
    {
      title: "Book tests and scans",
      description: "Find trusted diagnostic labs near you",
      icon: "🧪"
    },
    {
      title: "Ask a free question",
      description: "Get answers from doctors and experts",
      icon: "❓"
    },
    {
      title: "Add a medical record",
      description: "Upload prescriptions, reports and more",
      icon: "📁"
    },
    {
      title: "Set medicine reminders",
      description: "Get alerts so you never miss a dose",
      icon: "⏰"
    }
  ];

  return (
    <div>
      <div className="home-page dreamy-page">
        <div className="dreamy-bg-container">
          <div className="cloud cloud-1"></div>
          <div className="cloud cloud-2"></div>
          <div className="cloud cloud-3"></div>
          <div className="stars-layer"></div>
        </div>
        <Navbar user={user} handleLogout={handleLogout} transparent={true} onLoginClick={() => setIsAuthOpen(true)} />

        <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            onAuthSuccess={(userData) => setUser(userData)}
        />

        <div className="resources-page dreamy-page">
          <div className="resource-page">
            <div className="resources-container">
              {resources.map((item, index) => (
                <div key={index} className="resource-card">
                  <div className="resource-left">
                    <div className="resource-icon">{item.icon}</div>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </div>
                  <div className="resource-arrow">›</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}