import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AdminDashboard() {
    return (
        <div className="admin-page">
            <Navbar />
            <div className="container" style={{ paddingTop: '80px', minHeight: '80vh' }}>
                <h2>Admin Dashboard</h2>
                <p>Login to manage content and users.</p>
                <div style={{ padding: '40px', background: '#f5f5f5', borderRadius: '10px', marginTop: '20px' }}>
                    <p>Admin features are coming soon in the React migration.</p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
