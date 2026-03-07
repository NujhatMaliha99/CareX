import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MentalHealth from './pages/MentalHealth';
import PhysicalHealth from './pages/PhysicalHealth';
import HygieneAwareness from './pages/HygieneAwareness';
import AdminDashboard from './pages/AdminDashboard';
import ChatRoom from './pages/ChatRoom';
import { useState, useEffect } from "react";
import axios from 'axios';
import SplashScreen from "./physic/SplashScreen";
import Resources from './pages/Resources';
import './responsive.css';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('userToken');
      if (token) {
        try {
          const res = await axios.get('http://localhost:5050/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data.user);
        } catch (err) {
          localStorage.removeItem('userToken');
        }
      }
    };
    checkUser();
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home user={user} setUser={setUser} handleLogout={handleLogout} />} />
        <Route path="/mental" element={<MentalHealth user={user} handleLogout={handleLogout} />} />
        <Route path="/physical" element={<PhysicalHealth user={user} handleLogout={handleLogout} />} />
        <Route path="/hygiene" element={<HygieneAwareness user={user} handleLogout={handleLogout} />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/chat" element={<ChatRoom user={user} handleLogout={handleLogout} />} />
        <Route path="/resources" element={<Resources user={user} handleLogout={handleLogout} />} />
      </Routes>
    </BrowserRouter>
  );
}
