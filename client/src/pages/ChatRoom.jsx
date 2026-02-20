import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ChatRoom() {
    return (
        <div className="chat-page">
            <Navbar />
            <div className="container" style={{ paddingTop: '80px', minHeight: '80vh' }}>
                <h2>Chat Room</h2>
                <p>Community support chat is under construction.</p>
                <div style={{ padding: '40px', background: '#e3f2fd', borderRadius: '10px', marginTop: '20px' }}>
                    <p>Connect with peers and professionals soon.</p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
