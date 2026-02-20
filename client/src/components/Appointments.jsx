import { useState } from 'react';
import axios from 'axios';

export default function Appointments() {
    const [formData, setFormData] = useState({
        service: 'Mental Health Consultation',
        date: '',
        time: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Mocking the API call for now, assuming /api/appointments exists
            // await axios.post('/api/appointments', formData);
            alert('Appointment request submitted! 📅 Our team will review and confirm via email.');
            setFormData({ ...formData, date: '', time: '', notes: '' });
        } catch (error) {
            console.error('Booking failed:', error);
            alert('Submission failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="appointments" className="worksheet-card feature-section fade-in">
            <h2>📅 Professional Support</h2>
            <p className="section-desc">Sometimes, we need a guided path. Book a consultation with our experts.</p>

            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                <div className="input-group">
                    <label>Service</label>
                    <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    >
                        <option>Mental Health Consultation</option>
                        <option>Stress Management Session</option>
                        <option>Counselling Appointment</option>
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
                        <label>Preferred Time</label>
                        <input
                            type="time"
                            required
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label>Additional Notes (Optional)</label>
                    <textarea
                        placeholder="Tell us a bit about why you're reaching out..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                    {loading ? 'Submitting...' : 'Request Appointment'}
                </button>
            </form>
        </div>
    );
}
