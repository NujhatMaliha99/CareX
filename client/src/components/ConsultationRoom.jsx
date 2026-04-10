import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

export default function ConsultationRoom({ appointment, user, onClose }) {
    const [tab, setTab] = useState('chat');
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [uploading, setUploading] = useState(false);
    const [callActive, setCallActive] = useState(false);
    const [callType, setCallType] = useState('video'); // 'video' | 'voice'
    const [localStream, setLocalStream] = useState(null);

    const socketRef = useRef(null);
    const peerRef = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const chatEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const token = localStorage.getItem('userToken');

    const doctorName = appointment.professionalId?.name || appointment.requestedProfessional || 'Your Doctor';
    const receiverId = appointment.professionalId?._id || appointment.userId?._id;

    // ─── Socket + Message Load ───────────────────────────────────────
    useEffect(() => {
        fetchMessages();
        socketRef.current = io(SOCKET_URL);
        socketRef.current.emit('join-appointment', appointment._id);

        socketRef.current.on(`chat-${appointment._id}`, ({ message }) => {
            setMessages(prev => [...prev, message]);
        });

        // WebRTC signaling listeners
        socketRef.current.on('call-offer', async ({ offer, callType: ct }) => {
            setCallType(ct);
            setTab('call');
            await startLocalStream(ct);
            setCallActive(true);
            const pc = createPeer();
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socketRef.current.emit('call-answer', { appointmentId: appointment._id, answer });
        });

        socketRef.current.on('call-answer', async ({ answer }) => {
            await peerRef.current?.setRemoteDescription(new RTCSessionDescription(answer));
        });

        socketRef.current.on('ice-candidate', async ({ candidate }) => {
            try { await peerRef.current?.addIceCandidate(new RTCIceCandidate(candidate)); } catch {}
        });

        socketRef.current.on('call-ended', () => {
            endCall();
        });

        return () => {
            socketRef.current.disconnect();
            endCall();
        };
    }, [appointment._id]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // ─── Chat Functions ─────────────────────────────────────────────
    const fetchMessages = async () => {
        try {
            const res = await axios.get(`${SOCKET_URL}/api/messages/${appointment._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(res.data.messages);
        } catch {}
    };

    const sendText = async () => {
        if (!text.trim()) return;
        const payload = { appointmentId: appointment._id, receiverId, text };
        try {
            await axios.post(`${SOCKET_URL}/api/messages`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setText('');
        } catch {}
    };

    const sendImage = async (file) => {
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);
        formData.append('appointmentId', appointment._id);
        formData.append('receiverId', receiverId);
        try {
            await axios.post(`${SOCKET_URL}/api/messages/image`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch {}
        setUploading(false);
    };

    // ─── WebRTC Call Functions ───────────────────────────────────────
    const createPeer = () => {
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });
        pc.onicecandidate = (e) => {
            if (e.candidate) {
                socketRef.current.emit('ice-candidate', {
                    appointmentId: appointment._id,
                    candidate: e.candidate
                });
            }
        };
        pc.ontrack = (e) => {
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0];
        };
        if (localStream) {
            localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
        }
        peerRef.current = pc;
        return pc;
    };

    const startLocalStream = async (type) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: type === 'video',
                audio: true
            });
            setLocalStream(stream);
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;
            return stream;
        } catch (e) {
            alert('Could not access camera/microphone. Please allow permissions.');
        }
    };

    const startCall = async (type) => {
        setCallType(type);
        setTab('call');
        const stream = await startLocalStream(type);
        if (!stream) return;
        setCallActive(true);
        const pc = createPeer();
        stream.getTracks().forEach(track => pc.addTrack(track, stream));
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socketRef.current.emit('call-offer', {
            appointmentId: appointment._id,
            offer,
            callType: type
        });
    };

    const endCall = () => {
        peerRef.current?.close();
        peerRef.current = null;
        localStream?.getTracks().forEach(t => t.stop());
        setLocalStream(null);
        setCallActive(false);
        if (localVideoRef.current) localVideoRef.current.srcObject = null;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
        socketRef.current?.emit('call-end', { appointmentId: appointment._id });
    };

    // ─── Render ──────────────────────────────────────────────────────
    return (
        <div style={styles.overlay} className="consultation-overlay">
            <div style={styles.room} className="consultation-room">
                {/* Header */}
                <div style={styles.header} className="consultation-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={styles.avatar}>{doctorName[0]}</div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '1rem' }}>{doctorName}</div>
                            <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{appointment.type} Session</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <button style={styles.callBtn('#4caf50')} title="Video Call" onClick={() => startCall('video')}>📹</button>
                        <button style={styles.callBtn('#2196f3')} title="Voice Call" onClick={() => startCall('voice')}>📞</button>
                        <button style={styles.closeBtn} onClick={onClose}>✕</button>
                    </div>
                </div>

                {/* Tabs */}
                <div style={styles.tabs}>
                    <button style={tab === 'chat' ? styles.tabActive : styles.tab} onClick={() => setTab('chat')}>💬 Chat</button>
                    <button style={tab === 'call' ? styles.tabActive : styles.tab} onClick={() => setTab('call')}>📹 Call</button>
                </div>

                {/* Chat Tab */}
                {tab === 'chat' && (
                    <div style={styles.chatBody}>
                        <div style={styles.messageList}>
                            {messages.length === 0 && (
                                <div style={styles.emptyState}>No messages yet. Say hello! 👋</div>
                            )}
                            {messages.map((m, i) => {
                                const isMe = m.senderId?._id === user?._id || m.senderId === user?._id;
                                return (
                                    <div key={i} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
                                        <div style={isMe ? styles.myBubble : styles.theirBubble} className="chat-bubble">
                                            {!isMe && <div style={styles.senderName}>{m.senderId?.name || 'Doctor'}</div>}
                                            {m.messageType === 'image' ? (
                                                <img src={m.imageUrl} alt="shared" style={{ maxWidth: '100%', borderRadius: 10, display: 'block' }} />
                                            ) : (
                                                <span>{m.text}</span>
                                            )}
                                            <div style={styles.timestamp}>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Area */}
                        <div style={styles.inputArea} className="chat-input-area">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={e => sendImage(e.target.files[0])}
                            />
                            <button style={styles.iconBtn} onClick={() => fileInputRef.current.click()} disabled={uploading} title="Send Photo">
                                {uploading ? '⏳' : '🖼️'}
                            </button>
                            <input
                                style={styles.textInput}
                                className="chat-text-input"
                                placeholder="Type a message..."
                                value={text}
                                onChange={e => setText(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && sendText()}
                            />
                            <button style={styles.sendBtn} onClick={sendText}>Send ➤</button>
                        </div>
                    </div>
                )}

                {/* Call Tab */}
                {tab === 'call' && (
                    <div style={styles.callBody}>
                        <div style={styles.videoGrid} className="video-grid">
                            <div style={styles.videoBox} className="video-box">
                                <video ref={remoteVideoRef} autoPlay playsInline style={styles.video} />
                                <span style={styles.videoLabel}>{doctorName}</span>
                            </div>
                            <div style={{ ...styles.videoBox, ...styles.localVideoBox }} className="video-box local-video-box">
                                <video ref={localVideoRef} autoPlay playsInline muted style={styles.video} />
                                <span style={styles.videoLabel}>You</span>
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: 20 }}>
                            {!callActive ? (
                                <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                                    <button style={{ ...styles.bigCallBtn, background: '#4caf50' }} onClick={() => startCall('video')}>
                                        📹 Start Video Call
                                    </button>
                                    <button style={{ ...styles.bigCallBtn, background: '#2196f3' }} onClick={() => startCall('voice')}>
                                        📞 Start Voice Call
                                    </button>
                                </div>
                            ) : (
                                <button style={{ ...styles.bigCallBtn, background: '#f44336' }} onClick={endCall}>
                                    📴 End Call
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Styles ──────────────────────────────────────────────────────────
const styles = {
    overlay: {
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 3000, padding: 16,
    },
    room: {
        background: '#fff',
        borderRadius: 28,
        width: '100%', maxWidth: 600,
        maxHeight: '90vh',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
    },
    header: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 20px',
        background: 'linear-gradient(135deg, #c3b1e1 0%, #b39ddb 100%)',
        color: 'white',
    },
    avatar: {
        width: 42, height: 42, borderRadius: '50%',
        background: 'rgba(255,255,255,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: '1.2rem', color: 'white',
    },
    callBtn: (bg) => ({
        background: bg, color: 'white', border: 'none',
        borderRadius: '50%', width: 36, height: 36,
        cursor: 'pointer', fontSize: '1rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    }),
    closeBtn: {
        background: 'rgba(255,255,255,0.2)', color: 'white',
        border: 'none', borderRadius: '50%', width: 32, height: 32,
        cursor: 'pointer', fontWeight: 700, fontSize: '1rem',
    },
    tabs: {
        display: 'flex', borderBottom: '1px solid #f0f0f0',
        background: '#fafafa',
    },
    tab: {
        flex: 1, padding: '12px', background: 'none', border: 'none',
        cursor: 'pointer', color: '#888', fontWeight: 600, fontSize: '0.9rem',
    },
    tabActive: {
        flex: 1, padding: '12px',
        background: 'none', border: 'none',
        borderBottom: '3px solid #c3b1e1',
        cursor: 'pointer', color: '#7c4dff', fontWeight: 700, fontSize: '0.9rem',
    },
    // Chat
    chatBody: { display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' },
    messageList: { flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column' },
    emptyState: { textAlign: 'center', color: '#ccc', marginTop: 40, fontSize: '1rem' },
    myBubble: {
        background: 'linear-gradient(135deg, #c3b1e1, #b39ddb)',
        color: 'white', padding: '10px 14px', borderRadius: '18px 18px 4px 18px',
        maxWidth: '70%', wordBreak: 'break-word',
    },
    theirBubble: {
        background: '#f0f0f5', color: '#333',
        padding: '10px 14px', borderRadius: '18px 18px 18px 4px',
        maxWidth: '70%', wordBreak: 'break-word',
    },
    senderName: { fontSize: '0.72rem', fontWeight: 700, color: '#7c4dff', marginBottom: 4 },
    timestamp: { fontSize: '0.68rem', opacity: 0.6, marginTop: 4, textAlign: 'right' },
    inputArea: {
        display: 'flex', gap: 8, padding: '12px 16px',
        borderTop: '1px solid #f0f0f0', background: 'white',
    },
    textInput: {
        flex: 1, padding: '10px 16px', borderRadius: 25,
        border: '1px solid #e0e0e0', fontSize: '0.9rem', outline: 'none',
    },
    iconBtn: {
        background: 'none', border: '1px solid #e0e0e0',
        borderRadius: '50%', width: 42, height: 42,
        cursor: 'pointer', fontSize: '1.1rem', flexShrink: 0,
    },
    sendBtn: {
        background: 'linear-gradient(135deg, #c3b1e1, #b39ddb)',
        color: 'white', border: 'none', borderRadius: 25,
        padding: '10px 18px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem',
    },
    // Call
    callBody: { padding: 20, flex: 1, overflow: 'auto' },
    videoGrid: { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' },
    videoBox: {
        position: 'relative', flex: '1 1 240px', background: '#111',
        borderRadius: 16, overflow: 'hidden', minHeight: 180,
    },
    localVideoBox: { flex: '0 0 140px', minHeight: 100 },
    video: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
    videoLabel: {
        position: 'absolute', bottom: 8, left: 8,
        background: 'rgba(0,0,0,0.5)', color: 'white',
        padding: '2px 8px', borderRadius: 6, fontSize: '0.75rem',
    },
    bigCallBtn: {
        color: 'white', border: 'none', borderRadius: 25,
        padding: '14px 28px', cursor: 'pointer', fontWeight: 700, fontSize: '1rem',
    },
};
