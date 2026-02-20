import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MentalHealth from './pages/MentalHealth';
import PhysicalHealth from './pages/PhysicalHealth';
import HygieneAwareness from './pages/HygieneAwareness';
import AdminDashboard from './pages/AdminDashboard';
import ChatRoom from './pages/ChatRoom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mental" element={<MentalHealth />} />
        <Route path="/physical" element={<PhysicalHealth />} />
        <Route path="/hygiene" element={<HygieneAwareness />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/chat" element={<ChatRoom />} />
      </Routes>
    </BrowserRouter>
  );
}
