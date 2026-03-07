import { useState } from 'react';
import axios from 'axios';

export default function Appointments({ onComplete }) {
    const [formData, setFormData] = useState({
        service: 'Counselling',
        professionalName: 'Dr. Md. Zahir Uddin',
        date: '',
        time: '09:00 AM',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [appointments, setAppointments] = useState(JSON.parse(localStorage.getItem('appointments') || '[]'));

    const professionals = [
        {
            name: 'Dr. Md. Zahir Uddin',
            type: 'Counselling / Psychotherapy',
            color: '#7e57c2',
            bg: 'linear-gradient(135deg, #f8f9fa 0%, #e8eaf6 100%)',
            credentials: 'BSc (Psychology), MSc (Clinical Psychology), MPhil, PhD. Assistant Professor, National Institute of Mental Health, Dhaka.'
        },
        {
            name: 'Prof. Dr. Helal Uddin Ahmed',
            type: 'Psychiatrist',
            color: '#4caf50',
            bg: 'linear-gradient(135deg, #f8f9fa 0%, #e8f5e9 100%)',
            credentials: 'MBBS, MD (Psychiatry). Professor - Child Adolescent & Family Psychiatry, Department of Psychiatry and Mental Health.'
        }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newAppointment = {
                id: Date.now(),
                ...formData,
                status: 'pending'
            };
            const updated = [newAppointment, ...appointments];
            setAppointments(updated);
            localStorage.setItem('appointments', JSON.stringify(updated));
            alert('Appointment request submitted! 📅');
            setFormData({ ...formData, date: '', notes: '' });
        } catch (error) {
            alert('Submission failed.');
        } finally {
            setLoading(false);
            if (onComplete) onComplete();
        }
    };

    return (
        <div id="appointments" className="worksheet-card feature-section fade-in">
            <h2>📅 Book Professional Support</h2>
            <p className="section-desc">Connect with licensed mental health professionals in Bangladesh.</p>

            <div className="appointment-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {professionals.map(pro => (
                    <div key={pro.name} style={{ 
                        padding: '20px', 
                        background: pro.bg, 
                        borderRadius: '15px', 
                        borderLeft: `5px solid ${pro.color}`,
                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                    }}>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}>{pro.type}</h3>
                        <p style={{ margin: '0 0 5px 0', fontWeight: 700, color: '#2d3436' }}>{pro.name}</p>
                        <p style={{ fontSize: '0.8rem', color: '#636e72', lineHeight: '1.6' }}>{pro.credentials}</p>
                        <button 
                            className="btn btn-primary btn-sm" 
                            style={{ marginTop: '15px', width: '100%', background: pro.color, borderColor: pro.color }}
                            onClick={() => setFormData({ ...formData, professionalName: pro.name, service: pro.type.split(' / ')[0] })}
                        >
                            Book with {pro.name.split(' ').pop()}
                        </button>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '40px', padding: '20px', background: 'var(--white-glass)', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
                <h3>Schedule Session</h3>
                <form onSubmit={handleSubmit} style={{ marginTop: '15px' }}>
                    <div className="input-group">
                        <label>Professional</label>
                        <select
                            value={formData.professionalName}
                            onChange={(e) => setFormData({ ...formData, professionalName: e.target.value })}
                        >
                            {professionals.map(p => <option key={p.name} value={p.name}>{p.name} ({p.type})</option>)}
                        </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div className="input-group">
                            <label>Date</label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Time Slot</label>
                            <select
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            >
                                <option>09:00 AM</option>
                                <option>11:00 AM</option>
                                <option>02:00 PM</option>
                                <option>04:00 PM</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
                        {loading ? 'Submitting...' : 'Confirm Booking Request'}
                    </button>
                </form>
            </div>

            {appointments.length > 0 && (
                <div style={{ marginTop: '40px' }}>
                    <h3>Your Appointments</h3>
                    <div className="appointment-list" style={{ marginTop: '15px' }}>
                        {appointments.map(a => (
                            <div key={a.id} className="appointment-item" style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                padding: '15px', 
                                background: 'white', 
                                borderRadius: '12px', 
                                marginBottom: '10px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                            }}>
                                <div>
                                    <strong style={{ display: 'block' }}>{a.professionalName}</strong>
                                    <span style={{ fontSize: '0.85rem', color: '#666' }}>{a.service} • {a.date} at {a.time}</span>
                                </div>
                                <span className="status-badge" style={{ 
                                    padding: '5px 12px', 
                                    background: '#fff3e0', 
                                    color: '#ef6c00', 
                                    borderRadius: '15px', 
                                    fontSize: '0.75rem', 
                                    fontWeight: 700,
                                    textTransform: 'uppercase'
                                }}>{a.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
