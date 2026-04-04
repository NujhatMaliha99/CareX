import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send } from 'lucide-react';

export default function AIChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your CareX wellness guide. I can help you find resources, practice coping skills, or just listen. How are you feeling today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // Prepare history for API
            const history = messages.map(m => ({ role: m.role, content: m.content }));

            const res = await axios.post('http://localhost:3000/api/ai/chat', {
                message: userMsg.content,
                chatHistory: history
            });

            const aiMsg = { role: 'assistant', content: res.data.response };
            setMessages(prev => [...prev, aiMsg]);

            // Check for crisis trigger
            if (res.data.crisis) {
                alert("If you are in crisis, please call emergency services or 988 immediately.");
            }

        } catch (err) {
            console.error("Chat Error", err);
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting right now. Please try again later." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                className="ai-chat-fab"
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-color, #4facfe)',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    display: isOpen ? 'none' : 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}
            >
                <MessageCircle size={30} />
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="ai-chat-window" style={{
                    position: 'fixed',
                    bottom: '100px',
                    right: '30px',
                    width: '350px',
                    height: '500px',
                    backgroundColor: 'white',
                    borderRadius: '15px',
                    boxShadow: '0 5px 25px rgba(0,0,0,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 1000,
                    overflow: 'hidden',
                    border: '1px solid #eee'
                }}>
                    <div className="chat-header" style={{
                        padding: '15px',
                        background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <span style={{ fontWeight: 'bold' }}>✨ CareX Guide</span>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="chat-messages" style={{
                        flex: 1,
                        padding: '15px',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                    }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{
                                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '80%',
                                padding: '10px 15px',
                                borderRadius: '15px',
                                borderBottomLeftRadius: m.role === 'assistant' ? '2px' : '15px',
                                borderBottomRightRadius: m.role === 'user' ? '2px' : '15px',
                                backgroundColor: m.role === 'user' ? '#4facfe' : '#f0f2f5',
                                color: m.role === 'user' ? 'white' : '#333',
                                fontSize: '0.9rem'
                            }}>
                                {m.content}
                            </div>
                        ))}
                        {loading && (
                            <div style={{ alignSelf: 'flex-start', color: '#888', fontStyle: 'italic', fontSize: '0.8rem' }}>
                                Typing...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input-area" style={{
                        padding: '15px',
                        borderTop: '1px solid #eee',
                        display: 'flex',
                        gap: '10px'
                    }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type a message..."
                            style={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '20px',
                                border: '1px solid #ddd',
                                outline: 'none'
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading}
                            style={{
                                background: 'var(--primary-color, #4facfe)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
