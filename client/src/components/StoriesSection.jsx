import { useState, useEffect } from 'react';
import axios from 'axios';

export default function StoriesSection() {
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

    return (
        <div id="stories-hope" className="worksheet-card feature-section fade-in">
            <div className="explore-header">
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

            <div className="filter-chips">
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

            {/* Hero Story (First one) */}
            {filteredStories.length > 0 && (
                <div className="story-hero-card">
                    <span className="story-tag">{filteredStories[0].moodTag}</span>
                    <h3>{filteredStories[0].title}</h3>
                    <p className="story-meta">by {filteredStories[0].userId?.username || 'Anonymous'} • {filteredStories[0].readTime}</p>
                    <button className="btn btn-outline" style={{ marginTop: '15px' }}>Read Story</button>
                </div>
            )}

            <div className="section-divider">
                <h3>Latest Stories</h3>
            </div>

            <div className="stories-grid">
                {loading ? <p>Loading stories...</p> : filteredStories.slice(1).map(story => (
                    <div key={story._id} className="story-card">
                        <div className="story-header">
                            <span className="story-tag">{story.moodTag}</span>
                            <span className="story-time">{story.readTime}</span>
                        </div>
                        <h4>{story.title}</h4>
                        <div className="story-footer">
                            <span>by {story.userId?.username || 'Anonymous'}</span>
                        </div>
                    </div>
                ))}
                {!loading && filteredStories.length === 0 && <p>No stories found.</p>}
            </div>

            <div className="text-center" style={{ marginTop: '40px' }}>
                <button className="btn btn-primary btn-lg" onClick={() => alert('Feature coming soon!')}>➕ Share Your Story</button>
                <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '10px' }}>Stories are moderated for safety.</p>
            </div>
        </div>
    );
}
