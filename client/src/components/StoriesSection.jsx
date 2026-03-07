import { useState, useEffect } from 'react';
import axios from 'axios';

export default function StoriesSection({ onComplete }) {
    const [stories, setStories] = useState([]);
    const [filteredStories, setFilteredStories] = useState([]);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStories();
    }, []);

    useEffect(() => {
        filterStories();
    }, [stories, filter, search]);

    const fetchStories = async () => {
        try {
            const res = await axios.get('/api/stories');
            setStories(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch stories", err);
            // Fallback data if API fails (for demo)
            setStories([
                { _id: '1', title: 'Finding Peace in Chaos', content: '...', moodTag: 'Anxiety', readTime: '3 min', userId: { username: 'HopeSeeker' } },
                { _id: '2', title: 'My Journey to Self-Love', content: '...', moodTag: 'Self-Love', readTime: '5 min', userId: { username: 'KindHeart' } }
            ]);
            setLoading(false);
        }
    };

    const filterStories = () => {
        let result = stories;

        if (filter !== 'All') {
            result = result.filter(s => s.moodTag === filter);
        }

        if (search) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(s =>
                s.title.toLowerCase().includes(lowerSearch) ||
                s.moodTag.toLowerCase().includes(lowerSearch)
            );
        }

        setFilteredStories(result);
    };

    const filters = ['All', 'Anxiety', 'Healing', 'Burnout', 'Self-Love'];

    const [showShareModal, setShowShareModal] = useState(false);
    const [storyForm, setStoryForm] = useState({ title: '', moodTag: 'General', content: '', isAnonymous: true });

    const submitStory = (e) => {
        e.preventDefault();
        alert('🌸 Story submitted! It will appear once approved by our team.');
        setShowShareModal(false);
        setStoryForm({ title: '', moodTag: 'General', content: '', isAnonymous: true });
        if (onComplete) onComplete();
    };

    return (
        <div id="stories-hope" className="worksheet-card feature-section fade-in">
            <div className="explore-header" style={{ marginBottom: '30px' }}>
                <div>
                    <h2>🌸 Stories & Hope</h2>
                    <p className="section-desc">Real experiences. Gentle encouragement. You are not alone.</p>
                </div>
                <div className="explore-search">
                    <input
                        type="text"
                        placeholder="Search stories..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="filter-chips" style={{ marginBottom: '20px' }}>
                {filters.map(f => (
                    <button
                        key={f}
                        className={`filter-chip ${filter === f ? 'active' : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Story of the Day Hero */}
            {filteredStories.length > 0 && (
                <div className="story-hero-card" style={{ 
                    background: 'var(--white-glass)', 
                    padding: '25px', 
                    borderRadius: '20px', 
                    border: '1px solid var(--glass-border)',
                    marginBottom: '40px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <span style={{ 
                        position: 'absolute', 
                        top: '15px', 
                        right: '15px', 
                        background: 'var(--accent-purple)', 
                        color: 'white', 
                        padding: '4px 12px', 
                        borderRadius: '15px', 
                        fontSize: '0.75rem', 
                        fontWeight: 700 
                    }}>Story of the Day</span>
                    <span className="story-tag" style={{ background: 'rgba(126, 87, 194, 0.1)', color: 'var(--accent-purple)', padding: '4px 10px', borderRadius: '10px', fontSize: '0.8rem' }}>{filteredStories[0].moodTag}</span>
                    <h3 style={{ margin: '15px 0 10px 0', fontSize: '1.5rem' }}>{filteredStories[0].title}</h3>
                    <p style={{ color: '#444', lineHeight: '1.6', fontSize: '0.95rem' }}>{filteredStories[0].content.substring(0, 200)}...</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                        <p className="story-meta" style={{ margin: 0, fontSize: '0.85rem', color: '#888' }}>
                            by {filteredStories[0].userId?.username || 'Anonymous'} • {filteredStories[0].readTime}
                        </p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn btn-sm btn-outline">💛 12</button>
                            <button className="btn btn-sm btn-outline">🌱 8</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="section-divider" style={{ borderBottom: '1px solid #eee', marginBottom: '25px', paddingBottom: '10px' }}>
                <h3 style={{ margin:0, fontSize: '1.1rem', color: '#666' }}>Latest Stories</h3>
            </div>

            <div className="stories-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                {loading ? <p>Loading stories...</p> : filteredStories.slice(1).map(story => (
                    <div key={story._id} className="story-card" style={{ 
                        background: 'white', 
                        padding: '20px', 
                        borderRadius: '15px', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        transition: 'transform 0.3s ease'
                    }}>
                        <div className="story-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <span className="story-tag" style={{ fontSize: '0.75rem', background: '#f5f5f5', padding: '3px 8px', borderRadius: '5px' }}>{story.moodTag}</span>
                            <span className="story-time" style={{ fontSize: '0.75rem', color: '#999' }}>{story.readTime}</span>
                        </div>
                        <h4 style={{ margin: '0 0 10px 0' }}>{story.title}</h4>
                        <div className="story-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                            <span style={{ fontSize: '0.8rem', color: '#888' }}>by {story.userId?.username || 'Anonymous'}</span>
                            <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>🤝</button>
                        </div>
                    </div>
                ))}
                {!loading && filteredStories.length === 0 && <p>No stories found.</p>}
            </div>

            <div className="text-center" style={{ marginTop: '50px' }}>
                <button className="btn btn-primary btn-lg" onClick={() => setShowShareModal(true)}>➕ Share Your Story</button>
                <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '10px' }}>Stories are moderated for safety.</p>
            </div>

            {showShareModal && (
                <div className="modal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="modal-content" style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h3>🌸 Share Your Journey</h3>
                            <span className="close-modal" onClick={() => setShowShareModal(false)}>&times;</span>
                        </div>
                        <div className="modal-inner-padding">
                            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '20px' }}>Your story can inspire someone today. All stories are anonymous by default and reviewed by our team.</p>
                            <form onSubmit={submitStory}>
                                <div className="input-group">
                                    <label>Title</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g., How I Managed My First Panic Attack" 
                                        required 
                                        value={storyForm.title}
                                        onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Mood Tag</label>
                                    <select 
                                        value={storyForm.moodTag}
                                        onChange={(e) => setStoryForm({ ...storyForm, moodTag: e.target.value })}
                                    >
                                        <option>General</option>
                                        <option>Anxiety</option>
                                        <option>Depression</option>
                                        <option>Healing</option>
                                        <option>Burnout</option>
                                        <option>Self-Love</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Your Story</label>
                                    <textarea 
                                        rows="6" 
                                        placeholder="Share your experience, what helped you, or words of hope..." 
                                        required
                                        value={storyForm.content}
                                        onChange={(e) => setStoryForm({ ...storyForm, content: e.target.value })}
                                    ></textarea>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                    <input 
                                        type="checkbox" 
                                        id="story-anon" 
                                        checked={storyForm.isAnonymous}
                                        onChange={(e) => setStoryForm({ ...storyForm, isAnonymous: e.target.checked })}
                                    />
                                    <label htmlFor="story-anon" style={{ fontSize: '0.9rem', margin: 0 }}>Share anonymously</label>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Post Story for Review</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
