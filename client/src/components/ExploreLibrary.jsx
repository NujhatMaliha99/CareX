import { useState } from 'react';

const libraryData = [
    {
        id: 'anxiety',
        title: 'Anxiety',
        icon: '☁️',
        summary: 'Signs, treatment, and common myths.',
        readTime: '4 min read',
        color: '#e0f2f1',
        details: {
            what: 'Anxiety is more than just feeling stressed. It is a persistent, often overwhelming feeling of worry or fear about everyday situations.',
            signs: ['Persistent worrying', 'Restlessness', 'Faster heartbeat', 'Difficulty concentrating', 'Sleep troubles'],
            help: 'Cognitive Behavioral Therapy (CBT), mindfulness, regular exercise, and occasionally medication prescribed by a professional.',
            seekHelp: 'When worry interferes with daily life, relationships, or work for more than a few weeks.',
            myths: 'Myth: Anxiety is just overthinking. Fact: It has physical and chemical components in the brain.',
            resources: [
                { name: 'Anxiety & Depression Association', url: 'https://adaa.org/' },
                { name: 'National Institute of Mental Health', url: 'https://www.nimh.nih.gov/health/topics/anxiety-disorders' }
            ]
        }
    },
    {
        id: 'depression',
        title: 'Depression',
        icon: '🌧️',
        summary: 'Symptoms, causes, and available help.',
        readTime: '5 min read',
        color: '#e8eaf6',
        details: {
            what: 'Depression is a mood disorder that causes a persistent feeling of sadness and loss of interest.',
            signs: ['Prolonged sadness', 'Loss of interest in hobbies', 'Changes in appetite', 'Fatigue', 'Feelings of worthlessness'],
            help: 'Therapy (Talk therapy), medication, support groups, and healthy lifestyle changes.',
            seekHelp: 'If you feel low most of the day, nearly every day, for at least two weeks.',
            myths: 'Myth: Depression is just being sad. Fact: It is a serious condition that affects physical health and thinking.',
            resources: [
                { name: 'NAMI - Depression Support', url: 'https://www.nami.org/About-Mental-Illness/Mental-Health-Conditions/Depression' },
                { name: 'SAMHSA Helpline', url: 'https://www.samhsa.gov/find-help/national-helpline' }
            ]
        }
    },
    {
        id: 'ptsd',
        title: 'PTSD',
        icon: '⚡',
        summary: 'Common signs and recovery resources.',
        readTime: '4 min read',
        color: '#f3e5f5',
        details: {
            what: 'Post-Traumatic Stress Disorder (PTSD) is a disorder that develops in some people who have experienced a shocking, scary, or dangerous event.',
            signs: ['Flashbacks', 'Nightmares', 'Severe anxiety', 'Uncontrollable thoughts about the event'],
            help: 'Specialized therapy like EMDR or Trauma-focused CBT.',
            seekHelp: 'If symptoms persist beyond one month after the traumatic event.',
            myths: 'Myth: Only soldiers get PTSD. Fact: Anyone can develop PTSD after a traumatic experience.',
            resources: [
                { name: 'PTSD Alliance', url: 'https://ptsdalliance.org/' },
                { name: 'National Center for PTSD', url: 'https://www.ptsd.va.gov/' }
            ]
        }
    },
    {
        id: 'bipolar',
        title: 'Bipolar Disorder',
        icon: '🌓',
        summary: 'Mood changes and management tips.',
        readTime: '5 min read',
        color: '#fff3e0',
        details: {
            what: 'Bipolar disorder is a mental health condition that causes extreme mood swings that include emotional highs (mania) and lows (depression).',
            signs: ['Periods of extreme energy (mania)', 'Extreme lows (depression)', 'Sleep changes', 'Impulsive behavior', 'Racing thoughts'],
            help: 'Consistent medication (mood stabilizers) and ongoing psychotherapy.',
            seekHelp: 'If you experience significant shifts in mood that affect your ability to function.',
            myths: 'Myth: People with bipolar are just "moody". Fact: These are intense shifts that can require hospitalization or medical intervention.',
            resources: [
                { name: 'DBSA Alliance', url: 'https://www.dbsalliance.org/' },
                { name: 'Bipolar Hope Magazine', url: 'https://www.bphope.com/' }
            ]
        }
    },
    {
        id: 'ocd',
        title: 'OCD',
        icon: '📋',
        summary: 'Obsessive thoughts and rituals.',
        readTime: '4 min read',
        color: '#e1f5fe',
        details: {
            what: 'Obsessive-Compulsive Disorder (OCD) features a pattern of unwanted thoughts and fears (obsessions) that lead you to do repetitive behaviors (compulsions).',
            signs: ['Fear of contamination', 'Need for symmetry', 'Repetitive checking', 'Counting rituals'],
            help: 'Exposure and Response Prevention (ERP) therapy and medication (SSRIs).',
            seekHelp: 'When rituals take up more than an hour a day or cause significant distress.',
            myths: 'Myth: OCD is just being neat. Fact: It is a debilitating anxiety-based loop of distress.',
            resources: [
                { name: 'International OCD Foundation', url: 'https://iocdf.org/' },
                { name: 'Beyond OCD', url: 'https://beyondocd.org/' }
            ]
        }
    },
    {
        id: 'adhd',
        title: 'ADHD',
        icon: '🧠',
        summary: 'Attention and focus difficulties.',
        readTime: '4 min read',
        color: '#f1f8e9',
        details: {
            what: 'Attention-Deficit/Hyperactivity Disorder (ADHD) is a persistent pattern of inattention and/or hyperactivity-impulsivity that interferes with functioning.',
            signs: ['Difficulty focusing', 'Forgetfulness', 'Impulsivity', 'Excessive activity or restlessness'],
            help: 'Behavioral interventions, skill-building, coaching, and medication.',
            seekHelp: 'When focus or impulsivity issues consistently disrupt school, work, or relationships.',
            myths: 'Myth: ADHD is only a childhood disorder. Fact: Many adults live with and are diagnosed with ADHD.',
            resources: [
                { name: 'ADHD (CHADD)', url: 'https://chadd.org/' },
                { name: 'ADDitude Magazine', url: 'https://www.additudemag.com/' }
            ]
        }
    }
];

export default function ExploreLibrary({ onComplete }) {
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
                    <div className="modal-content" style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="modal-header">
                            <h2 style={{ margin: 0 }}>{selectedTopic.icon} {selectedTopic.title} Guide</h2>
                            <span className="close-modal" onClick={() => setSelectedTopic(null)}>&times;</span>
                        </div>
                        <div className="modal-inner-padding" style={{ textAlign: 'left' }}>
                            <div className="detail-section">
                                <h4 style={{ color: 'var(--accent-purple)' }}>📖 What it is</h4>
                                <p>{selectedTopic.details.what}</p>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                                <div className="detail-section">
                                    <h4 style={{ color: 'var(--accent-purple)' }}>🔍 Common Signs</h4>
                                    <ul style={{ paddingLeft: '20px', fontSize: '0.9rem' }}>
                                        {selectedTopic.details.signs.map((s, i) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                                <div className="detail-section">
                                    <h4 style={{ color: 'var(--accent-purple)' }}>🩹 What can help</h4>
                                    <p style={{ fontSize: '0.9rem' }}>{selectedTopic.details.help}</p>
                                </div>
                            </div>
                            
                            <div className="detail-section" style={{ marginTop: '20px' }}>
                                <h4 style={{ color: 'var(--accent-purple)' }}>🚨 When to seek help</h4>
                                <p style={{ fontSize: '0.9rem' }}>{selectedTopic.details.seekHelp}</p>
                            </div>
                            
                            <div className="detail-section" style={{ marginTop: '20px', padding: '15px', background: '#fff9c4', borderRadius: '10px' }}>
                                <h4 style={{ color: '#f57f17' }}>💡 Myths vs Facts</h4>
                                <p style={{ fontSize: '0.9rem', margin: 0 }}>{selectedTopic.details.myths}</p>
                            </div>

                            <div className="detail-section" style={{ marginTop: '20px' }}>
                                <h4 style={{ color: 'var(--accent-purple)' }}>🔗 Reliable Resources</h4>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    {selectedTopic.details.resources.map((r, i) => (
                                        <a key={i} href={r.url} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline" style={{ textDecoration: 'none' }}>
                                            🔗 {r.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                            
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '30px' }} onClick={() => {
                                setSelectedTopic(null);
                                if (onComplete) onComplete();
                            }}>Close Guide</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
