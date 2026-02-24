import { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

        try {
            const res = await axios.post(`http://localhost:5050${endpoint}`, formData);
            if (res.data.token) {
                localStorage.setItem('userToken', res.data.token);
                onAuthSuccess(res.data.user);
                onClose();
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-modal-overlay">
            <div className="auth-modal-card glass-morphism">
                <button className="close-btn" onClick={onClose}><X size={24} /></button>

                <h2 className="auth-title">
                    {isLogin ? 'Welcome Back 🌿' : 'Join CareX ✨'}
                </h2>
                <p className="auth-subtitle">
                    {isLogin ? 'Login to continue your wellness journey' : 'Create an account to start tracking your health'}
                </p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <div className="input-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                placeholder="Your Name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Step Into Calm')}
                    </button>
                </form>

                <div className="auth-switch">
                    {isLogin ? (
                        <>New here? <button onClick={() => setIsLogin(false)}>Sign Up</button></>
                    ) : (
                        <>Already have an account? <button onClick={() => setIsLogin(true)}>Login</button></>
                    )}
                </div>
            </div>

            <style jsx="true">{`
                .auth-modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(144, 161, 230, 0.4);
                    backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    padding: 20px;
                }
                .auth-modal-card {
                    background: rgba(255, 255, 255, 0.85);
                    width: 100%;
                    max-width: 450px;
                    padding: 50px 40px;
                    border-radius: 40px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.1);
                    position: relative;
                    border: 1px solid rgba(255, 255, 255, 0.4);
                }
                .close-btn {
                    position: absolute;
                    top: 25px;
                    right: 25px;
                    background: none;
                    border: none;
                    color: #888;
                    cursor: pointer;
                    transition: color 0.3s;
                }
                .close-btn:hover { color: var(--accent-purple); }
                .auth-title {
                    font-family: 'Outfit', sans-serif;
                    font-size: 2rem;
                    margin-bottom: 10px;
                    color: var(--text-dark);
                    text-align: center;
                }
                .auth-subtitle {
                    text-align: center;
                    color: var(--text-light);
                    margin-bottom: 30px;
                }
                .auth-error {
                    background: #fff5f5;
                    color: #e53e3e;
                    padding: 12px;
                    border-radius: 12px;
                    margin-bottom: 20px;
                    font-size: 0.9rem;
                    text-align: center;
                    border: 1px solid #fed7d7;
                }
                .auth-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .input-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: var(--text-light);
                    font-size: 0.9rem;
                    margin-left: 5px;
                }
                .input-group input {
                    width: 100%;
                    padding: 15px 20px;
                    border-radius: 15px;
                    border: 1px solid rgba(0,0,0,0.08);
                    background: white;
                    font-size: 1rem;
                    transition: all 0.3s;
                }
                .input-group input:focus {
                    outline: none;
                    border-color: var(--accent-purple);
                    box-shadow: 0 0 0 4px rgba(155, 109, 255, 0.1);
                }
                .auth-btn {
                    margin-top: 10px;
                    padding: 15px;
                    font-size: 1.1rem;
                }
                .auth-switch {
                    margin-top: 25px;
                    text-align: center;
                    color: var(--text-light);
                    font-size: 0.95rem;
                }
                .auth-switch button {
                    background: none;
                    border: none;
                    color: var(--accent-purple);
                    font-weight: 700;
                    cursor: pointer;
                    padding-left: 5px;
                }
                .auth-switch button:hover {
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
}
