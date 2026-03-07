export default function HelplineModal({ onClose }) {
    return (
        <div className="modal" style={{ display: 'flex' }}>
            <div className="modal-content emergency-modal-content">
                <span className="close-modal" onClick={onClose}>&times;</span>
                <h3 style={{ color: '#ff5252', fontSize: '1.8rem', marginBottom: '10px' }}>🚨 Emergency Support</h3>
                <p style={{ fontSize: '1.1rem', marginBottom: '25px' }}><strong>You are not alone. Help is available 24/7.</strong></p>

                <div className="emergency-section">
                    <h4 style={{ color: '#d32f2f', marginBottom: '15px' }}>🇧🇩 Bangladesh Emergency Services</h4>
                    <ul className="helpline-list">
                        <li className="helpline-primary">
                            <strong>Emergency Services:</strong>
                            <a href="tel:999" className="emergency-link">999</a>
                            <span className="helpline-badge">24/7</span>
                        </li>
                        <li className="helpline-primary" style={{ marginTop: '20px' }}>
                            <strong>Emotional Support & Suicide Prevention:</strong>
                            <a href="tel:+8801779554391" className="emergency-link">+880 1779-554391</a>
                            <span className="helpline-badge">24/7</span>
                            <br/><small style={{ color: '#666', marginTop: '5px', display: 'block' }}>Bangladesh's first emotional support and suicide prevention helpline.</small>
                        </li>
                    </ul>
                </div>

                <div className="emergency-section" style={{ marginTop: '25px' }}>
                    <h4 style={{ color: '#666', marginBottom: '15px' }}>🌍 International Emergency Services</h4>
                    <ul className="helpline-list">
                        <li><strong>US/Canada:</strong> Call or Text <a href="tel:988" className="emergency-link">988</a></li>
                        <li><strong>UK:</strong> Call <a href="tel:111" className="emergency-link">111</a> or <a href="tel:999" className="emergency-link">999</a></li>
                    </ul>
                </div>

                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <button onClick={onClose} className="btn btn-outline" style={{ padding: '12px 30px' }}>
                        ← Back to CareX
                    </button>
                </div>
            </div>
        </div>
    );
}
