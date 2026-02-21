import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MentalHealth from './pages/MentalHealth';
import PhysicalHealth from './pages/PhysicalHealth';
import HygieneAwareness from './pages/HygieneAwareness';
import AdminDashboard from './pages/AdminDashboard';
import ChatRoom from './pages/ChatRoom';
import { useState } from "react";
import SplashScreen from "./physic/SplashScreen";
import Resources from './pages/Resources';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mental" element={<MentalHealth />} />
        <Route path="/physical" element={<PhysicalHealth />} />
        <Route path="/hygiene" element={<HygieneAwareness />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/chat" element={<ChatRoom />} />
        <Route path ="/resources" element = {<Resources />} />
      </Routes>
    </BrowserRouter>
  );
}
