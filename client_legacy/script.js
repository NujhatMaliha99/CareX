document.addEventListener('DOMContentLoaded', () => {
    /* --- Global State & Multi-Page Progress --- */
    const BACKEND_URL = 'http://localhost:5050/api/ai';
    const API_URL = 'http://localhost:5050/api';
    let completedTasks = JSON.parse(localStorage.getItem('carexCompletedTasks') || '{}');

    // UI Utilities
    window.openModal = (id) => document.getElementById(id).style.display = 'flex';
    window.closeModal = (id) => document.getElementById(id).style.display = 'none';
    window.scrollToSection = (id) => {
        document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
        // Fading highlight
        const el = document.getElementById(id);
        el.style.boxShadow = 'var(--shadow-glow)';
        setTimeout(() => el.style.boxShadow = 'none', 2000);
    };

    /* --- Progress Tracking --- */
    window.completeTask = (taskId) => {
        completedTasks[taskId] = true;
        localStorage.setItem('carexCompletedTasks', JSON.stringify(completedTasks));
        renderProgress();
        alert(`Great job! You've completed the ${taskId} activity. ✔`);
    };

    const renderProgress = () => {
        const progressElements = {
            weather: 'progress-weather',
            panic: 'progress-panic',
            release: 'progress-release',
            focus: 'progress-focus',
            sleep: 'progress-sleep',
            sounds: 'progress-sounds',
            pmr: 'progress-pmr',
            talk: 'progress-talk',
            reframe: 'progress-reframe',
            future: 'progress-future',
            gratitude: 'progress-gratitude',
            wins: 'progress-wins'
        };

        Object.keys(progressElements).forEach(id => {
            const el = document.getElementById(progressElements[id]);
            if (el && completedTasks[id]) {
                el.innerText = '✔';
            }
        });
    };

    /* --- AI Features Integration --- */

    /* --- MongoDB Activity Tracking --- */
    const saveMentalActivity = async (activityType, data) => {
        const userToken = localStorage.getItem('userToken');
        if (!userToken) {
            console.log('User not logged in, activity not saved');
            return;
        }

        try {
            const res = await fetch(`${API_URL}/mental-activity`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify({ activityType, data })
            });
            const result = await res.json();
            if (res.ok) {
                console.log(`✅ ${activityType} saved to MongoDB`);
            } else {
                console.error('Activity save failed:', result.error);
            }
        } catch (error) {
            console.error('Error saving activity:', error);
        }
    };




    /* --- Explore Mental Health --- */
    const conditionsData = [
        {
            id: 'anxiety',
            category: 'conditions',
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
                ],
                relatedTopics: ['depression', 'ocd', 'ptsd']
            }
        },
        {
            id: 'depression',
            category: 'conditions',
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
                ],
                relatedTopics: ['anxiety', 'bipolar']
            }
        },
        {
            id: 'ptsd',
            category: 'conditions',
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
                ],
                relatedTopics: ['anxiety', 'depression']
            }
        },
        {
            id: 'bipolar',
            category: 'conditions',
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
                ],
                relatedTopics: ['depression', 'anxiety']
            }
        },
        {
            id: 'ocd',
            category: 'conditions',
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
                ],
                relatedTopics: ['anxiety', 'adhd']
            }
        },
        {
            id: 'adhd',
            category: 'conditions',
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
                ],
                relatedTopics: ['ocd', 'anxiety']
            }
        }
    ];

    const populateExploreCards = (filter = 'all', search = '') => {
        const grid = document.getElementById('explore-grid');
        if (!grid) return;
        grid.innerHTML = '';

        const filtered = conditionsData.filter(item => {
            const matchesFilter = filter === 'all' || item.category === filter;
            const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                item.summary.toLowerCase().includes(search.toLowerCase());
            return matchesFilter && matchesSearch;
        });

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'condition-card';
            card.style.backgroundColor = item.color;
            card.onclick = () => openConditionDetail(item.id);
            card.innerHTML = `
                <div class="condition-icon-circle">${item.icon}</div>
                <h3>${item.title}</h3>
                <p>${item.summary}</p>
                <div class="card-footer">
                    <span>${item.readTime}</span>
                    <div class="arrow-link">→</div>
                </div>
            `;
            grid.appendChild(card);
        });
    };

    window.openConditionDetail = (id) => {
        const item = conditionsData.find(c => c.id === id);
        if (!item) return;

        // Find related topics data
        const relatedTopicsData = item.details.relatedTopics.map(tid => {
            return conditionsData.find(c => c.id === tid);
        }).filter(Boolean);

        const body = document.getElementById('condition-detail-body');
        body.innerHTML = `
            <div class="condition-detail-header">
                <span style="font-size: 4rem;">${item.icon}</span>
                <h2>${item.title}</h2>
                <p><strong>${item.readTime}</strong></p>
            </div>
            <div class="detail-section">
                <h4>📖 What it is</h4>
                <p>${item.details.what}</p>
            </div>
            <div class="detail-grid">
                <div class="detail-section">
                    <h4>🔍 Common Signs</h4>
                    <ul>${item.details.signs.map(s => `<li>${s}</li>`).join('')}</ul>
                </div>
                <div class="detail-section">
                    <h4>🩹 What can help</h4>
                    <p>${item.details.help}</p>
                </div>
            </div>
            <div class="detail-section">
                <h4>🚨 When to seek help</h4>
                <p>${item.details.seekHelp}</p>
            </div>
            <div class="detail-section" style="background: #fff3e0;">
                <h4>💡 Myths vs Facts</h4>
                <p>${item.details.myths}</p>
            </div>
            <div class="detail-section">
                <h4>🔗 Resources</h4>
                <div class="resource-links">
                    ${item.details.resources.map(r => `
                        <a href="${r.url}" target="_blank" class="resource-link-item">
                            <span>🔗</span> ${r.name}
                        </a>
                    `).join('')}
                </div>
            </div>
            <div class="detail-section">
                <h4>✨ Related Topics to Explore</h4>
                <div class="related-chips">
                    ${relatedTopicsData.map(topic => `
                        <button onclick="openConditionDetail('${topic.id}')" class="related-chip">
                            ${topic.icon} ${topic.title}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        openModal('condition-modal');
    };

    window.filterExplore = (category) => {
        document.querySelectorAll('.filter-chip').forEach(btn => btn.classList.remove('active'));
        if (event) {
            const btn = event.target.closest('.filter-chip');
            if (btn) btn.classList.add('active');
        }
        populateExploreCards(category, document.getElementById('topic-search').value);
    };

    window.searchTopics = () => {
        const searchVal = document.getElementById('topic-search').value;
        const activeFilterBtn = document.querySelector('.filter-chip.active');
        const activeFilterText = activeFilterBtn ? activeFilterBtn.innerText.toLowerCase() : 'all';
        const filterVal = activeFilterText === 'conditions' ? 'conditions' : (activeFilterText === 'coping skills' ? 'coping' : 'all');
        populateExploreCards(filterVal, searchVal);
    };

    // Initial render
    setTimeout(populateExploreCards, 0);

    /* --- Daily Suggestion --- */
    const suggestions = [
        { text: "Try a 2-minute breathing exercise to ground yourself.", target: "panic-rescue" },
        { text: "Write 3 things you're grateful for in your Gratitude Capsule.", target: "gratitude-capsule" },
        { text: "Take 5 minutes for a PMR body scan.", target: "pmr-scan" },
        { text: "Release one nagging thought into the sky today.", target: "release-thoughts" }
    ];
    let currentSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    document.getElementById('suggestion-text').innerText = currentSuggestion.text;

    window.acceptSuggestion = () => {
        scrollToSection(currentSuggestion.target);
    };

    /* --- Sections & Interactive Logic --- */

    // Panic Rescue (Breathing) - 5s inhale, 5s hold, 5s exhale, 5s hold × 4 cycles
    let breathingInterval;
    let isBreathing = false;
    let currentCycle = 0;
    const PHASE_DURATION = 5; // 5 seconds per phase
    const TOTAL_CYCLES = 4;
    const CYCLE_DURATION = PHASE_DURATION * 4; // 20 seconds per cycle

    window.toggleBreathing = () => {
        const stage = document.getElementById('breathing-stage');
        const timerText = document.getElementById('breathing-timer');
        const cycleText = document.getElementById('breathing-cycle');
        const btn = document.getElementById('start-breathing-btn');
        const circle = document.getElementById('breathing-display');

        if (isBreathing) {
            clearInterval(breathingInterval);
            btn.innerText = "Begin Breathing";
            stage.innerText = "Ready?";
            timerText.innerText = "5";
            if (cycleText) cycleText.innerText = "";
            circle.classList.remove('inhale', 'hold-in', 'exhale', 'hold-out');
            isBreathing = false;
            currentCycle = 0;
            return;
        }

        isBreathing = true;
        currentCycle = 1;
        btn.innerText = "Stop Session";
        let count = 0;
        let phaseCount = PHASE_DURATION;

        const updatePhase = () => {
            const cyclePosition = count % CYCLE_DURATION;
            const phaseIndex = Math.floor(cyclePosition / PHASE_DURATION);
            const phases = ["Inhale...", "Hold...", "Exhale...", "Hold..."];
            // Use specific classes for each hold phase to control animation (scale 1.3 vs 1.0)
            const phaseClasses = ["inhale", "hold-in", "exhale", "hold-out"];

            // Update phase display
            stage.innerText = phases[phaseIndex];
            circle.classList.remove('inhale', 'hold-in', 'exhale', 'hold-out');
            circle.classList.add(phaseClasses[phaseIndex]);

            // Countdown within phase
            phaseCount = PHASE_DURATION - (cyclePosition % PHASE_DURATION);
            timerText.innerText = phaseCount;

            // Update cycle counter
            currentCycle = Math.floor(count / CYCLE_DURATION) + 1;
            if (cycleText) cycleText.innerText = `Cycle ${currentCycle} of ${TOTAL_CYCLES}`;
        };

        updatePhase(); // Initial display

        breathingInterval = setInterval(() => {
            count++;
            updatePhase();

            // Complete after 4 cycles (80 seconds)
            if (count >= CYCLE_DURATION * TOTAL_CYCLES) {
                completeTask('panic');
                clearInterval(breathingInterval);
                stage.innerText = "Well done! 💜";
                timerText.innerText = "✓";
                circle.classList.remove('inhale', 'hold-in', 'exhale', 'hold-out'); // Reset animation
                if (cycleText) cycleText.innerText = "Session Complete";
                isBreathing = false;
                btn.innerText = "Begin Breathing";
            }
        }, 1000);
    };

    // Mental Weather
    window.setWeather = (type, emoji, btn) => {
        document.querySelectorAll('.weather-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Save to MongoDB
        saveMentalActivity('mental-weather', {
            mood: type,
            emoji: emoji,
            timestamp: new Date().toISOString()
        });

        // Save to local history
        const history = JSON.parse(localStorage.getItem('moodHistory') || '[]');
        history.push({ day: new Date().getDay(), emoji });
        localStorage.setItem('moodHistory', JSON.stringify(history));
        updateMoodTimeline();

        completeTask('weather');
    };

    const updateMoodTimeline = () => {
        const timeline = document.getElementById('mood-timeline');
        const history = JSON.parse(localStorage.getItem('moodHistory') || '[]');
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Simple visualization: show last 7 entries
        const last7 = history.slice(-7);
        timeline.innerHTML = last7.map(entry => `
            <div class="timeline-day">
                <span style="font-size:0.7rem;">${days[entry.day]}</span>
                <span>${entry.emoji}</span>
            </div>
        `).join('') || '<div class="text-center" style="width:100%;">No logs yet. Start today!</div>';
    };

    window.releaseThoughts = () => {
        const text = document.getElementById('dump-textarea');
        if (!text.value.trim()) return;

        // Save to MongoDB
        saveMentalActivity('release-thoughts', {
            thought: text.value,
            timestamp: new Date().toISOString()
        });

        text.style.transition = 'all 1s';
        text.style.transform = 'translateY(-100px) scale(0)';
        text.style.opacity = '0';

        setTimeout(() => {
            text.value = '';
            text.style.transform = 'none';
            text.style.opacity = '1';
            completeTask('release');
            alert('Your thoughts have been released. Deep breath.');
        }, 1000);
    };

    /* --- Calm Sounds (Local Media) --- */
    const soundFiles = {
        rain: 'assets/sounds/rain.mp3',
        forest: 'assets/sounds/forest.mp3',
        ocean: 'assets/sounds/ocean.mp3',
        lofi: 'assets/sounds/lofi.mp3',
        deep_sleep: 'assets/sounds/sleep.mp3',
        relaxation: 'assets/sounds/relax.mp3'
    };

    const soundIcons = { rain: '🌧️', forest: '🌲', ocean: '🌊', lofi: '🎧', deep_sleep: '🌙', relaxation: '🧘' };
    const soundNames = { rain: 'Rain', forest: 'Forest', ocean: 'Ocean', lofi: 'Lofi', deep_sleep: 'Deep Sleep', relaxation: 'Relaxation' };

    window.playSound = (type) => {
        const audio = document.getElementById('local-audio-player');
        const playerUI = document.getElementById('sound-player');
        const nameDisplay = document.getElementById('playing-name');
        const iconDisplay = document.getElementById('playing-icon');

        if (!audio || !playerUI) return;

        // Set source and play
        audio.src = soundFiles[type];
        audio.play().catch(err => {
            console.error('Playback failed. Ensure mp3 file exists in assets/sounds/', err);
            alert(`Please ensure ${type}.mp3 is in assets/sounds/ folder`);
        });

        // Update UI
        nameDisplay.innerText = soundNames[type];
        iconDisplay.innerText = soundIcons[type];
        playerUI.style.display = 'flex';

        completeTask('sounds');
    };

    window.closeVideoModal = () => {
        window.stopSound();
    };

    window.minimizePlayer = () => {
        // Not used for local audio but keeping signature for compatibility
    };

    window.maximizePlayer = () => {
        // Not used for local audio but keeping signature for compatibility
    };

    window.setVolume = (val) => {
        const audio = document.getElementById('local-audio-player');
        if (audio) audio.volume = val / 100;
    };

    window.stopSound = () => {
        const audio = document.getElementById('local-audio-player');
        const playerUI = document.getElementById('sound-player');
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
        if (playerUI) playerUI.style.display = 'none';
    };

    /* --- Body Scan (PMRT) --- */
    let scanInterval;
    let isScanning = false;
    const bodyParts = [
        { id: 'bp-head', name: 'Head & Face', instruction: 'Tense your forehead, scrunch your face... hold 5 seconds... now release. Feel the tension melt away.' },
        { id: 'bp-shoulders', name: 'Shoulders', instruction: 'Raise your shoulders to your ears... hold tight... now drop them. Let go completely.' },
        { id: 'bp-arms', name: 'Arms & Hands', instruction: 'Make fists and tense your arms... feel the tightness... now open and relax.' },
        { id: 'bp-chest', name: 'Chest', instruction: 'Take a deep breath, expand your chest... hold... exhale slowly. Feel your heart calm.' },
        { id: 'bp-stomach', name: 'Stomach', instruction: 'Tighten your core muscles... hold... release. Let your belly be soft.' },
        { id: 'bp-legs', name: 'Legs', instruction: 'Tense your thighs and calves... hold the tension... now release completely.' },
        { id: 'bp-feet', name: 'Feet', instruction: 'Curl your toes tightly... hold... now spread them wide and relax.' }
    ];

    /* --- Premium PMRT (Body Scan) --- */
    let pmrtAbortController = null; // To cancel async sequence
    let pmrtDurationMinutes = 2; // Default
    const pmrtParts = [
        { id: 'feet', name: 'Feet', ids: ['pmrt-foot-l', 'pmrt-foot-r'], instruction: 'Curl your toes tightly... hold...' },
        { id: 'legs', name: 'Legs', ids: ['pmrt-leg-l', 'pmrt-leg-r'], instruction: 'Tense your calves and thighs... feel the tightness...' },
        { id: 'stomach', name: 'Stomach', ids: ['pmrt-stomach'], instruction: 'Tighten your core muscles... make it hard...' },
        { id: 'chest', name: 'Chest', ids: ['pmrt-chest'], instruction: 'Take a deep breath and hold... puff out your chest...' },
        { id: 'hands', name: 'Hands', ids: ['pmrt-hand-l', 'pmrt-hand-r'], instruction: 'Clench your fists... squeeze tight...' },
        { id: 'arms', name: 'Arms', ids: ['pmrt-arm-l', 'pmrt-arm-r'], instruction: 'Flex your biceps... stiffen your arms...' },
        { id: 'shoulders', name: 'Shoulders', ids: ['pmrt-shoulder-l', 'pmrt-shoulder-r'], instruction: 'Raise shoulders to ears... hold the tension...' },
        { id: 'neck', name: 'Neck', ids: ['pmrt-neck'], instruction: 'Gently tilt head back... feel the neck stretch...' },
        { id: 'head', name: 'Face', ids: ['pmrt-head'], instruction: 'Scrunch your face... eyes tight, jaw clenched...' }
    ];

    window.setPMRTDuration = (min, btn) => {
        pmrtDurationMinutes = min;
        document.querySelectorAll('.pmrt-duration-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    };

    const sleep = (ms, signal) => new Promise((resolve, reject) => {
        const timeout = setTimeout(resolve, ms);
        if (signal) {
            signal.addEventListener('abort', () => {
                clearTimeout(timeout);
                reject(new Error('Aborted'));
            });
        }
    });

    window.togglePMRT = async () => {
        const btn = document.getElementById('pmrt-start-btn');
        const instructionPanel = document.getElementById('pmrt-instruction-panel');
        const instructionTitle = document.getElementById('pmrt-part-name');
        const instructionText = document.getElementById('pmrt-instruction-text');
        const ring = document.getElementById('pmrt-ring');
        const ringPhase = document.getElementById('pmrt-ring-phase');
        const ringTimer = document.getElementById('pmrt-ring-timer');
        const wave = document.getElementById('pmrt-wave');
        const completeSection = document.getElementById('pmrt-complete');

        if (pmrtAbortController) {
            // Stop Session
            pmrtAbortController.abort();
            pmrtAbortController = null;
            btn.innerText = '🌿 Start Relaxation';
            instructionTitle.innerText = "Session Stopped";
            instructionText.innerText = "Take a deep breath.";
            resetPMRTVisuals();
            return;
        }

        // Start Session
        pmrtAbortController = new AbortController();
        const signal = pmrtAbortController.signal;
        btn.innerText = '⏹️ Stop Session';
        completeSection.style.display = 'none';
        resetPMRTVisuals();

        // Calculate timings based on duration
        const totalSeconds = pmrtDurationMinutes * 60;
        const perPartSeconds = totalSeconds / pmrtParts.length;
        const tenseTime = Math.max(3, Math.floor(perPartSeconds * 0.4)); // 40% tense
        const releaseTime = Math.max(5, Math.floor(perPartSeconds * 0.6)); // 60% release

        try {
            for (let i = 0; i < pmrtParts.length; i++) {
                const part = pmrtParts[i];

                // 1. Highlight Step in Progress Bar
                document.querySelector(`.pmrt-step[data-step="${part.id}"]`).classList.add('active');

                // 2. Prepare / Tense Instruction
                instructionTitle.innerText = part.name;
                instructionText.innerText = part.instruction;
                part.ids.forEach(id => {
                    document.getElementById(id).classList.add('active-region', 'tense');
                });

                // Show Ring - Tense
                ring.classList.add('visible');
                ringPhase.innerText = "Tense";
                ring.style.borderColor = "#ff5722"; // Orange for tension

                for (let t = tenseTime; t > 0; t--) {
                    ringTimer.innerText = t;
                    await sleep(1000, signal);
                }

                // 3. Release Phase
                part.ids.forEach(id => {
                    document.getElementById(id).classList.remove('tense');
                    document.getElementById(id).classList.add('release');
                });
                instructionText.innerText = `Release... breathe out... feel the warmth.`;
                ringPhase.innerText = "Relax";
                ring.style.borderColor = "#4caf50"; // Green for release

                // Animation: Wave Flow
                wave.classList.add('flowing');
                setTimeout(() => wave.classList.remove('flowing'), 2000); // Reset wave

                for (let r = releaseTime; r > 0; r--) {
                    ringTimer.innerText = r;
                    await sleep(1000, signal);
                }

                // Clean up step
                part.ids.forEach(id => {
                    document.getElementById(id).classList.remove('active-region', 'release');
                });
                document.querySelector(`.pmrt-step[data-step="${part.id}"]`).classList.remove('active');
                document.querySelector(`.pmrt-step[data-step="${part.id}"]`).classList.add('done');
                ring.classList.remove('visible');
            }

            // session complete
            completePMRT();

        } catch (err) {
            if (err.message !== 'Aborted') console.error(err);
        }
    };

    const resetPMRTVisuals = () => {
        document.querySelectorAll('.body-region').forEach(el => el.classList.remove('active-region', 'tense', 'release'));
        document.querySelectorAll('.pmrt-step').forEach(el => el.classList.remove('active', 'done'));
        document.getElementById('pmrt-ring').classList.remove('visible');
    };

    const completePMRT = () => {
        const completeSection = document.getElementById('pmrt-complete');
        const btn = document.getElementById('pmrt-start-btn');
        completeSection.style.display = 'block';
        btn.innerText = '🌿 Start Relaxation';
        pmrtAbortController = null;
        completeTask('pmr');
        window.scrollTo({ top: document.getElementById('pmrt-complete').offsetTop, behavior: 'smooth' });
    };

    window.savePMRTSession = () => {
        const rating = document.getElementById('relaxation-rating').value;
        saveMentalActivity('pmrt', {
            rating: rating,
            timestamp: new Date().toISOString()
        });
        document.getElementById('pmrt-complete').style.display = 'none';
        alert('Relaxation session logged. Have a peaceful day 💜');
    };

    /* --- Wheel of Wellness --- */
    window.spinFromDashboard = () => {
        scrollToSection('wellness-wheel');
        setTimeout(spinWheel, 800);
    };

    let moodRescueOn = false;
    const wheelActions = {
        breathe: {
            icon: '🫁',
            title: 'Breathing Exercise',
            desc: 'A gentle rhythm for your heart and mind. Let\'s practice a quick grounding breath.',
            func: () => { scrollToSection('panic-rescue'); toggleBreathing(); }
        },
        release: {
            icon: '🕊️',
            title: 'Release Thoughts',
            desc: 'Write down what\'s weighing on you and let it float away in your digital journal.',
            func: () => scrollToSection('release-thoughts')
        },
        anxiety: {
            icon: '🔍',
            title: 'Learn About Anxiety',
            desc: 'Understanding the "why" helps the "how". Explore our gentle guide on anxiety.',
            func: () => { scrollToSection('explore-mental-health'); openConditionDetail('anxiety'); }
        },
        ground: {
            icon: '🌿',
            title: 'Grounding Exercise',
            desc: 'Bring yourself back to the present with a simple 5-4-3-2-1 practice.',
            func: () => startMomentActivity('count')
        },
        talk: {
            icon: '📅',
            title: 'Professional Support',
            desc: 'You don\'t have to carry this alone. Connect with licensed professionals for guidance.',
            func: () => scrollToSection('appointments')
        },
        sleep: {
            icon: '🌙',
            title: 'Sleep Reset Tip',
            desc: 'A small adjustment for a better night. Check our curated sleep sanctuary tips.',
            func: () => scrollToSection('sleep-reset')
        }
    };

    // Standard keys matching HTML segment order (0 to 7)
    const standardKeys = ['breathe', 'release', 'anxiety', 'ground', 'talk', 'talk', 'sleep', 'breathe'];
    const rescueActions = ['breathe', 'release', 'anxiety', 'ground', 'talk', 'talk', 'sleep', 'breathe'];

    window.toggleMoodRescue = () => {
        const moodToggle = document.getElementById('mood-rescue-mode');
        if (!moodToggle) return;
        moodRescueOn = moodToggle.checked;
        const wheel = document.getElementById('calm-wheel-spinner');
        if (wheel) {
            wheel.style.borderColor = moodRescueOn ? '#ffccbc' : '#fff';
        }
    };

    window.spinWheel = () => {
        const wheel = document.getElementById('calm-wheel-spinner');
        const resultBox = document.getElementById('wheel-result');
        const resultTitle = document.getElementById('result-title');
        const resultDesc = document.getElementById('result-desc');
        const resultIcon = document.getElementById('result-icon');
        const btn = document.getElementById('wheel-spin-btn');

        // Reset
        resultBox.style.display = 'none';
        btn.disabled = true;

        // Haptic Feedback (if supported)
        if (navigator.vibrate) navigator.vibrate(50);

        // Random spin calculation
        // 8 segments = 45 deg each
        // Spin at least 5 rotations (1800deg) + random
        const randomDeg = Math.floor(1800 + Math.random() * 2000);
        wheel.style.transform = `rotate(${randomDeg}deg)`;

        // Ambient Background Shift
        document.body.classList.add('spinning-bg');

        // Match CSS transition time (5s)
        setTimeout(() => {
            btn.disabled = false;
            document.body.classList.remove('spinning-bg');
            if (navigator.vibrate) navigator.vibrate([30, 50, 30]); // Success vibration

            // Calculate index
            // With -22.5deg offset in CSS, segment 0 is centered at top
            const actualDeg = randomDeg % 360;
            const segmentIndex = Math.floor((360 - actualDeg) % 360 / 45);

            // Map index to key
            const keys = moodRescueOn ? rescueActions : standardKeys;
            const key = keys[segmentIndex] || keys[0];
            const action = wheelActions[key];

            // Show result
            resultTitle.innerText = action.title;
            resultBox.style.display = 'block';

            // Store pending action
            window.pendingWheelAction = action.func;

        }, 5000); // 5s to match CSS
    };

    window.executeWheelAction = () => {
        if (window.pendingWheelAction) window.pendingWheelAction();
        closeWheelResult();
    };

    window.closeWheelResult = () => {
        document.getElementById('wheel-result').style.display = 'none';
    };

    window.scrollToSection = (id) => {
        document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
    };


    /* --- Social Battery --- */
    window.updateBattery = (val) => {
        const level = document.getElementById('battery-level');
        const percent = document.getElementById('battery-percent');
        const tipText = document.getElementById('battery-tip-text');

        level.style.width = val + '%';
        percent.innerText = val + '%';

        // Color based on level
        if (val <= 25) {
            level.style.background = 'linear-gradient(90deg, #ff6b6b, #ee5a5a)';
            tipText.innerText = '⚠️ Low energy! Time to recharge. Cancel optional plans, find a quiet space, or take a nap.';
        } else if (val <= 50) {
            level.style.background = 'linear-gradient(90deg, #ffd93d, #ff9f1c)';
            tipText.innerText = 'You could use some quiet time. Limit deep conversations and save energy for essentials.';
        } else if (val <= 75) {
            level.style.background = 'linear-gradient(90deg, #6bcb77, #3bb143)';
            tipText.innerText = 'Good energy level! You can handle social activities but remember to pace yourself.';
        } else {
            level.style.background = 'linear-gradient(90deg, #4d96ff, #3b82f6)';
            tipText.innerText = '💪 Fully charged! Great time for social activities, networking, or helping others.';
        }
    };

    window.logBattery = () => {
        const val = document.getElementById('social-slider').value;
        const history = JSON.parse(localStorage.getItem('batteryHistory') || '[]');
        const batteryData = { level: val, date: new Date().toISOString() };
        history.push(batteryData);
        localStorage.setItem('batteryHistory', JSON.stringify(history));

        // Sync to MongoDB
        saveMentalActivity('social-battery', batteryData);

        alert('Energy level logged! Track your patterns over time.');
    };

    /* --- Need a Moment --- */
    const momentActivities = {
        count: {
            title: '5-4-3-2-1 Grounding',
            content: `<div class="grounding-exercise">
                <p><strong>5</strong> things you can <em>see</em></p>
                <p><strong>4</strong> things you can <em>touch</em></p>
                <p><strong>3</strong> things you can <em>hear</em></p>
                <p><strong>2</strong> things you can <em>smell</em></p>
                <p><strong>1</strong> thing you can <em>taste</em></p>
            </div>`
        },
        stretch: {
            title: '30-Second Stretch',
            content: `<div class="stretch-guide">
                <p>🙆 Raise arms overhead, stretch tall</p>
                <p>🔄 Roll shoulders back 5 times</p>
                <p>↩️ Gentle neck rolls, both sides</p>
                <p>🧘 Deep breath in... and out</p>
            </div>`
        },
        water: {
            title: 'Hydration Check',
            content: `<div class="water-reminder">
                <p style="font-size: 3rem;">💧</p>
                <p>Take a slow sip of water.<br>Feel it hydrate your body.</p>
                <p><em>Dehydration affects mood and energy!</em></p>
            </div>`
        },
        look: {
            title: 'Nature Break',
            content: `<div class="nature-break">
                <p style="font-size: 3rem;">🪟🌳</p>
                <p>Look outside for 2 minutes.</p>
                <p>Notice colors, movement, light.</p>
                <p><em>Nature reduces stress hormones.</em></p>
            </div>`
        }
    };

    window.startMomentActivity = (type) => {
        const popup = document.getElementById('moment-popup');
        const content = document.getElementById('moment-content');
        const activity = momentActivities[type];

        content.innerHTML = `<h3>${activity.title}</h3>${activity.content}`;
        popup.style.display = 'block';
    };

    window.closeMomentPopup = () => {
        document.getElementById('moment-popup').style.display = 'none';
    };

    /* --- Future Me (Letters) --- */
    window.saveFutureLetter = () => {
        const dateInput = document.getElementById('future-date');
        const letterInput = document.getElementById('future-letter-text');

        if (!dateInput.value || !letterInput.value.trim()) {
            alert('Please select a date and write your letter.');
            return;
        }

        const letters = JSON.parse(localStorage.getItem('futureLetters') || '[]');
        letters.push({
            id: Date.now(),
            date: dateInput.value,
            letter: letterInput.value,
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('futureLetters', JSON.stringify(letters));

        // Sync to MongoDB (Atlas)
        saveMentalActivity('future-me', {
            date: dateInput.value,
            letter: letterInput.value,
            id: letterId
        });

        dateInput.value = '';
        letterInput.value = '';
        alert('📮 Your letter has been sealed and saved for Future You!');
        completeTask('future');
        renderFutureLetters();
    };

    const renderFutureLetters = () => {
        const list = document.getElementById('letters-list');
        if (!list) return;

        const letters = JSON.parse(localStorage.getItem('futureLetters') || '[]');
        const today = new Date().toISOString().split('T')[0];

        list.innerHTML = letters.map(l => {
            const canOpen = l.date <= today;
            return `
                <div class="letter-item ${canOpen ? 'openable' : 'sealed'}">
                    <span>📧 Letter for ${new Date(l.date).toLocaleDateString()}</span>
                    ${canOpen
                    ? `<button class="btn btn-sm btn-outline" onclick="openLetter(${l.id})">Open</button>`
                    : '<span class="sealed-badge">🔒 Sealed</span>'
                }
                </div>
            `;
        }).join('') || '<p style="color: var(--text-light);">No letters yet. Write one to future you!</p>';
    };

    window.openLetter = (id) => {
        const letters = JSON.parse(localStorage.getItem('futureLetters') || '[]');
        const letter = letters.find(l => l.id === id);
        if (letter) {
            alert(`📬 Letter from ${new Date(letter.createdAt).toLocaleDateString()}:\n\n${letter.letter}`);
        }
    };

    /* --- Focus Timer --- */
    let focusInterval;
    let focusSeconds = 25 * 60;
    let isFocusing = false;

    window.toggleFocusTimer = () => {
        const btn = document.getElementById('focus-toggle-btn');
        const display = document.getElementById('focus-timer-text');

        if (isFocusing) {
            clearInterval(focusInterval);
            btn.innerText = 'Resume';
            isFocusing = false;
            return;
        }

        isFocusing = true;
        btn.innerText = 'Pause';

        focusInterval = setInterval(() => {
            focusSeconds--;
            const mins = Math.floor(focusSeconds / 60);
            const secs = focusSeconds % 60;
            display.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

            if (focusSeconds <= 0) {
                clearInterval(focusInterval);
                completeTask('focus');
                alert('🎯 Focus session complete! Great work. Take a break.');
                resetFocusTimer();
            }
        }, 1000);
    };

    window.resetFocusTimer = () => {
        clearInterval(focusInterval);
        focusSeconds = 25 * 60;
        document.getElementById('focus-timer-text').innerText = '25:00';
        document.getElementById('focus-toggle-btn').innerText = 'Start Focus';
        isFocusing = false;
    };

    /* --- Sleep Wind-Down --- */
    window.startSleepWindDown = () => {
        alert('🌙 Sleep Wind-Down starting!\n\n1. Dim your lights now\n2. Put devices away after this\n3. Do some gentle stretching\n4. Focus on slow, deep breaths\n\nSweet dreams! 💜');
        completeTask('sleep');
    };

    /* --- Gratitude --- */
    window.addGratitude = () => {
        const input = document.getElementById('gratitude-input');
        if (!input.value.trim()) return;

        const gratitudes = JSON.parse(localStorage.getItem('gratitudeList') || '[]');
        const gratitudeData = { text: input.value, date: new Date().toISOString() };
        gratitudes.push(gratitudeData);
        localStorage.setItem('gratitudeList', JSON.stringify(gratitudes));

        // Sync to MongoDB (Atlas)
        saveMentalActivity('gratitude', gratitudeData);

        input.value = '';
        renderGratitude();
        completeTask('gratitude');
    };

    const renderGratitude = () => {
        const list = document.getElementById('gratitude-list');
        if (!list) return;

        const gratitudes = JSON.parse(localStorage.getItem('gratitudeList') || '[]').slice(-5);
        list.innerHTML = gratitudes.map(g => `
            <div class="capsule-item">✨ ${g.text}</div>
        `).join('') || '<p style="color: var(--text-light);">Your gratitude capsule is empty. Add something!</p>';
    };

    /* --- Tiny Wins --- */
    window.addWin = () => {
        const input = document.getElementById('win-input');
        if (!input.value.trim()) return;

        const wins = JSON.parse(localStorage.getItem('tinyWins') || '[]');
        const winData = { text: input.value, date: new Date().toISOString() };
        wins.push(winData);
        localStorage.setItem('tinyWins', JSON.stringify(wins));

        // Sync to MongoDB (Atlas)
        saveMentalActivity('tiny-wins', winData);

        input.value = '';
        renderWins();
        completeTask('wins');
    };

    const renderWins = () => {
        const list = document.getElementById('wins-list');
        if (!list) return;

        const wins = JSON.parse(localStorage.getItem('tinyWins') || '[]').slice(-10);
        list.innerHTML = wins.map(w => `
            <div class="win-item">🏆 ${w.text}</div>
        `).join('') || '<p style="color: var(--text-light);">No wins yet. Start small!</p>';
    };

    /* --- Booking Functions with Backend API --- */
    const APPOINTMENTS_URL = 'http://localhost:5050/api';
    let currentService = '';
    let userToken = localStorage.getItem('userToken');
    let currentUser = null;

    window.showAuthMode = (mode) => {
        document.getElementById('login-form').style.display = mode === 'login' ? 'block' : 'none';
        document.getElementById('register-form').style.display = mode === 'register' ? 'block' : 'none';
    };

    window.userLogin = async () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorMsg = document.getElementById('login-err-msg');

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (data.token) {
                userToken = data.token;
                currentUser = data.user;
                localStorage.setItem('userToken', userToken);
                updateAuthUI();
                closeModal('auth-modal');
                renderAppointments();
            } else {
                errorMsg.innerText = data.error || 'Login failed';
            }
        } catch (err) {
            errorMsg.innerText = 'Connection error';
        }
    }

    window.userRegister = async () => {
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const errorMsg = document.getElementById('reg-err-msg');

        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();

            if (data.token) {
                userToken = data.token;
                currentUser = data.user;
                localStorage.setItem('userToken', userToken);
                updateAuthUI();
                closeModal('auth-modal');
                renderAppointments();
            } else {
                errorMsg.innerText = data.error || 'Registration failed';
            }
        } catch (err) {
            errorMsg.innerText = 'Connection error';
        }
    }

    window.logout = () => {
        localStorage.removeItem('userToken');
        userToken = null;
        currentUser = null;
        updateAuthUI();
        renderAppointments();
    }

    const updateAuthUI = () => {
        const loginBtn = document.getElementById('login-nav-btn');
        const logoutBtn = document.getElementById('logout-nav-btn');
        const nameSpan = document.getElementById('nav-user-name');

        if (userToken && currentUser) {
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'inline-block';
            nameSpan.innerText = `Hi, ${currentUser.name.split(' ')[0]}`;
            nameSpan.style.display = 'inline-block';
        } else {
            loginBtn.style.display = 'inline-block';
            logoutBtn.style.display = 'none';
            nameSpan.style.display = 'none';
        }
    }

    let currentProfessional = '';
    window.openBooking = (professional) => {
        if (!userToken) {
            openModal('auth-modal');
            return;
        }
        currentProfessional = professional;
        // Map professional to type
        if (professional === 'Dr. Md. Zahir Uddin') {
            currentService = 'Counselling';
        } else {
            currentService = 'Psychiatrist';
        }

        const titleEl = document.getElementById('modal-service-title');
        if (titleEl) titleEl.innerText = `Book Session with ${professional}`;
        openModal('booking-modal');
    };

    window.submitBooking = async () => {
        const date = document.getElementById('book-date').value;
        const time = document.getElementById('book-time').value;

        if (!date) {
            alert('Please select a date.');
            return;
        }

        if (!userToken) {
            alert('Please login first');
            return;
        }

        try {
            const res = await fetch(`${APPOINTMENTS_URL}/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify({
                    type: currentService,
                    professionalName: currentProfessional,
                    date,
                    time,
                    notes: ''
                })
            });

            const data = await res.json();
            if (res.ok) {
                closeModal('booking-modal');
                alert(`✅ Session requested with ${currentProfessional} for ${date} at ${time}.\nAwaiting admin approval.`);
                renderAppointments();
            } else {
                alert(data.error || 'Booking failed');
            }
        } catch (err) {
            console.error(err);
            // Fallback to localStorage for offline support
            const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
            appointments.push({
                id: Date.now(),
                service: currentService,
                date,
                time,
                status: 'pending'
            });
            localStorage.setItem('appointments', JSON.stringify(appointments));
            closeModal('booking-modal');
            alert(`✅ ${currentService} appointment saved locally.\nNote: Backend appears offline.`);
            renderAppointments();
        }
    };

    const renderAppointments = async () => {
        const box = document.getElementById('booking-status-box');
        const list = document.getElementById('appointment-list');

        if (!box || !list) return;

        if (!userToken) {
            // Show local appointments
            const local = JSON.parse(localStorage.getItem('appointments') || '[]');
            if (local.length === 0) {
                box.style.display = 'none';
                return;
            }
            box.style.display = 'block';
            list.innerHTML = local.map(a => `
                <div class="appointment-item status-${a.status}">
                    <span>${a.service} - ${new Date(a.date).toLocaleDateString()} at ${a.time}</span>
                    <span class="status-badge">${a.status.toUpperCase()}</span>
                </div>
            `).join('');
            return;
        }

        try {
            const res = await fetch(`${APPOINTMENTS_URL}/appointments`, {
                headers: { 'Authorization': `Bearer ${userToken}` }
            });
            const data = await res.json();

            if (!data.appointments || data.appointments.length === 0) {
                box.style.display = 'none';
                return;
            }

            box.style.display = 'block';
            list.innerHTML = data.appointments.map(a => `
                <div class="appointment-item status-${a.status}">
                    <div style="flex: 1;">
                        <strong>${a.type}</strong> - ${new Date(a.date).toLocaleDateString()} at ${a.time}
                        <br><small style="color: #888;">${a.professionalId?.name || 'Awaiting assignment'}</small>
                    </div>
                    <span class="status-badge">${a.status.toUpperCase()}</span>
                    ${a.status === 'approved' ? `
                        <div class="appointment-actions" style="display: flex; gap: 8px; margin-left: 10px;">
                            ${a.chatEnabled ? `<a href="chat.html?appointmentId=${a._id}" class="btn btn-sm btn-primary" style="padding: 6px 12px; font-size: 0.85rem; text-decoration: none;">💬 Chat</a>` : ''}
                            ${a.callEnabled ? `<a href="chat.html?appointmentId=${a._id}&mode=call" class="btn btn-sm btn-outline" style="padding: 6px 12px; font-size: 0.85rem; text-decoration: none;">📞 Call</a>` : ''}
                            ${a.callEnabled ? `<a href="chat.html?appointmentId=${a._id}&mode=video" class="btn btn-sm btn-outline" style="padding: 6px 12px; font-size: 0.85rem; text-decoration: none;">📹 Video</a>` : ''}
                        </div>
                    ` : ''}
                </div>
            `).join('');
        } catch (err) {
            console.error('Could not fetch appointments:', err);
            box.style.display = 'none';
        }
    };

    // Check user auth on load
    const checkUserAuth = async () => {
        if (!userToken) return;
        try {
            const res = await fetch(`${API_URL}/auth/me`, {
                headers: { 'Authorization': `Bearer ${userToken}` }
            });
            const data = await res.json();
            if (res.ok && data.user) {
                currentUser = data.user;
                updateAuthUI();
                renderAppointments();
            } else {
                localStorage.removeItem('userToken');
                userToken = null;
                updateAuthUI();
            }
        } catch (err) {
            console.error(err);
        }
    };

    /* --- Stories & Hope --- */
    let allStories = [];
    let activeStoryFilter = 'All';

    window.fetchStories = async () => {
        try {
            const res = await fetch(`${API_URL}/stories`);
            const data = await res.json();
            allStories = data;
            renderStories();
        } catch (err) {
            console.error('Failed to fetch stories:', err);
        }
    };

    const renderStories = () => {
        const grid = document.getElementById('stories-grid');
        const hero = document.getElementById('story-of-the-day');
        if (!grid || !hero) return;

        const filtered = activeStoryFilter === 'All'
            ? allStories
            : allStories.filter(s => s.moodTag === activeStoryFilter);

        // Story of the Day (just the first approved one for now)
        if (allStories.length > 0) {
            const top = allStories[0];
            hero.innerHTML = `
                <div class="story-hero-content">
                    <span class="mood-tag tag-${top.moodTag.toLowerCase()}">${top.moodTag}</span>
                    <h3>${top.title}</h3>
                    <div class="story-meta">Shared ${top.isAnonymous ? 'anonymously' : top.userId?.username} • ${top.readTime}</div>
                    <p class="story-preview">${top.content.substring(0, 200)}...</p>
                    <div class="reaction-bar">
                        <button class="reaction-btn" onclick="reactToStory('${top._id}', 'helpful')">💛 ${top.reactions.helpful}</button>
                        <button class="reaction-btn" onclick="reactToStory('${top._id}', 'hopeful')">🌱 ${top.reactions.hopeful}</button>
                        <button class="reaction-btn" onclick="reactToStory('${top._id}', 'relatable')">🤝 ${top.reactions.relatable}</button>
                    </div>
                </div>
            `;
            hero.style.display = 'block';
        } else {
            hero.style.display = 'none';
        }

        grid.innerHTML = filtered.map(s => `
            <div class="story-card fade-in">
                <span class="mood-tag tag-${s.moodTag.toLowerCase()}">${s.moodTag}</span>
                <h4>${s.title}</h4>
                <p>${s.content.substring(0, 120)}...</p>
                <div class="reaction-bar">
                    <button class="reaction-btn" onclick="reactToStory('${s._id}', 'helpful')">💛 ${s.reactions.helpful}</button>
                    <button class="reaction-btn" onclick="reactToStory('${s._id}', 'hopeful')">🌱 ${s.reactions.hopeful}</button>
                    <button class="reaction-btn" onclick="reactToStory('${s._id}', 'relatable')">🤝 ${s.reactions.relatable}</button>
                </div>
            </div>
        `).join('');

        if (filtered.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888; padding: 40px;">No stories found in this category yet. Be the first to share! 🌸</p>';
        }
    };

    window.setStoryFilter = (tag) => {
        activeStoryFilter = tag;
        document.querySelectorAll('#story-filter-chips .filter-chip').forEach(btn => {
            btn.classList.toggle('active', btn.innerText === tag);
        });
        renderStories();
    };

    window.filterStories = () => {
        const query = document.getElementById('story-search').value.toLowerCase();
        const grid = document.getElementById('stories-grid');
        const filtered = allStories.filter(s =>
            s.title.toLowerCase().includes(query) ||
            s.content.toLowerCase().includes(query)
        );

        // Simple re-render for search
        grid.innerHTML = filtered.map(s => `
            <div class="story-card">
                <span class="mood-tag tag-${s.moodTag.toLowerCase()}">${s.moodTag}</span>
                <h4>${s.title}</h4>
                <p>${s.content.substring(0, 120)}...</p>
                <div class="reaction-bar">
                    <button class="reaction-btn" onclick="reactToStory('${s._id}', 'helpful')">💛 ${s.reactions.helpful}</button>
                    <button class="reaction-btn" onclick="reactToStory('${s._id}', 'hopeful')">🌱 ${s.reactions.hopeful}</button>
                    <button class="reaction-btn" onclick="reactToStory('${s._id}', 'relatable')">🤝 ${s.reactions.relatable}</button>
                </div>
            </div>
        `).join('');
    };

    window.submitStory = async (e) => {
        e.preventDefault();
        if (!userToken) return openModal('auth-modal');

        const title = document.getElementById('story-title').value;
        const content = document.getElementById('story-content').value;
        const moodTag = document.getElementById('story-mood').value;
        const isAnonymous = document.getElementById('story-anonymous').checked;

        try {
            const res = await fetch(`${API_URL}/stories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify({ title, content, moodTag, isAnonymous })
            });

            if (res.ok) {
                alert('🌸 Story submitted! It will appear once approved by our team.');
                closeModal('share-story-modal');
                document.getElementById('story-form').reset();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to submit story');
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong. Please try again.');
        }
    };

    window.reactToStory = async (storyId, type) => {
        try {
            const res = await fetch(`${API_URL}/stories/${storyId}/react`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type })
            });
            if (res.ok) {
                // Refresh stories locally to show updated count
                fetchStories();
            }
        } catch (err) {
            console.error(err);
        }
    };

    /* --- Init --- */
    checkUserAuth();
    renderProgress();
    updateMoodTimeline();
    renderGratitude();
    renderWins();
    renderFutureLetters();
    renderAppointments();
    fetchStories();

    // Set minimum date for future letters to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const futureDate = document.getElementById('future-date');
    if (futureDate) futureDate.min = tomorrow.toISOString().split('T')[0];

    // Quick Actions
    window.openQuickCalm = () => scrollToSection('panic-rescue');
    window.openCheckIn = () => scrollToSection('mental-weather');

    // Emergency Call Function
    window.callEmergency = () => {
        const confirmCall = confirm('🚨 EMERGENCY RESCUE\n\nIf you are feeling threatened or in immediate danger:\n\n✅ Click OK to see emergency helpline numbers\n❌ Click Cancel to return\n\nFor life-threatening emergencies:\n🇧🇩 Bangladesh: Call 999\n💚 Suicide Prevention: +880 1779-554391');

        if (confirmCall) {
            openModal('helpline-modal');
            // Optional: Attempt to initiate phone call on mobile devices
            if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                const callOptions = confirm('Choose emergency service:\n\nOK = Call 999 (Emergency)\nCancel = Call Suicide Prevention Hotline');
                if (callOptions) {
                    window.location.href = 'tel:999';
                } else {
                    window.location.href = 'tel:+8801779554391';
                }
            }
        }
    };

    // Energy Level Labels
    window.updateEnergyLabel = (val) => {
        const labels = ['Exhausted', 'Drained', 'Low', 'Below Average', 'Moderate', 'Okay', 'Good', 'Energized', 'Great', 'Peak'];
        document.getElementById('energy-val').innerText = labels[val - 1];
    };

    /* --- Sidebar Scroll Spy --- */
    const sections = document.querySelectorAll('.feature-section, .emergency-card');
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const displayEl = document.getElementById('current-section-display');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');

                // Update nav links
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });

                // Update display name
                if (displayEl) {
                    const sectionTitle = entry.target.querySelector('h2').innerText;
                    displayEl.innerText = sectionTitle;

                    // Add a small animation effect
                    displayEl.style.transform = 'scale(1.05)';
                    setTimeout(() => displayEl.style.transform = 'scale(1)', 200);
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
});
