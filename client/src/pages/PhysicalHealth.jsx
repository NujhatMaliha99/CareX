import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PhysicalHealth() {
    return (
        <div className="physical-page dreamy-page">
            <Navbar />
            <div className="dreamy-bg-container">
                <div className="cloud cloud-1"></div>
                <div className="cloud cloud-2"></div>
                <div className="stars-layer"></div>
            </div>
            <div className="container" style={{ paddingTop: '100px', minHeight: '80vh' }}>
                <h1 className="fade-in">Physical Health 🏃</h1>
                <p className="fade-in delay-1">Fuel your body, stay active, and build strength.</p>
                <div className="suggestion-card" style={{ marginTop: '40px', padding: '40px', textAlign: 'center' }}>
                    <p>Physical health features are coming soon in the React migration.</p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
