import { useState } from 'react';

const libraryData = [
    { id: 'anxiety', title: 'Anxiety', color: '#e8f5e9', summary: 'Signs, treatment, and coping myths.' },
    { id: 'depression', title: 'Depression', color: '#e3f2fd', summary: 'Symptoms, causes, and help paths.' },
    { id: 'ocd', title: 'OCD', color: '#f3e5f5', summary: 'Obsessive thoughts and rituals.' },
];

export default function ExploreLibrary() {
    const [selectedTopic, setSelectedTopic] = useState(null);

    return (
        <div id="explore-mental-health" className="worksheet-card feature-section fade-in">
            <h2>🔍 Explore Mental Health</h2>
            <p className="section-desc">Knowledge is empowerment. Learn about conditions & coping.</p>

            <div className="explore-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
                marginTop: '20px'
            }}>
                {libraryData.map(topic => (
                    <div
                        key={topic.id}
                        className="suggestion-card topic-card"
                        style={{ backgroundColor: topic.color, padding: '20px', cursor: 'pointer' }}
                        onClick={() => setSelectedTopic(topic)}
                    >
                        <h3>{topic.title}</h3>
                        <p style={{ fontSize: '0.85rem' }}>{topic.summary}</p>
                        <button className="btn btn-sm btn-outline" style={{ marginTop: '10px' }}>Read More</button>
                    </div>
                ))}
            </div>

            {selectedTopic && (
                <div className="modal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>📘 {selectedTopic.title} Guide</h3>
                            <span className="close-modal" onClick={() => setSelectedTopic(null)}>&times;</span>
                        </div>
                        <div className="modal-inner-padding">
                            <p>Detailed educational content for {selectedTopic.title} would go here.</p>
                            <p>This includes signs, symptoms, and professional resources.</p>
                            <button className="btn btn-primary" onClick={() => setSelectedTopic(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
