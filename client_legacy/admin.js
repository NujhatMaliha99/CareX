const API_URL = 'http://localhost:3000/api';
let token = localStorage.getItem('adminToken');
let professionals = [];
let allAppointments = [];
let allStories = [];

// Initialize Socket.io
const socket = io('http://localhost:3000');

// --- Real-time Updates ---
socket.on('connect', () => console.log('✅ Connected to Socket.io server'));

socket.on('new-appointment', (data) => {
    showToast('📅 New Appointment Request!', 'info');
    loadAppointments(); // Refresh current view
});

socket.on('new-story', (data) => {
    showToast('🌸 New Story Submitted for Review!', 'info');
    loadAdminStories();
});

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    if (token) {
        checkAuth();
    } else {
        showLoginOverlay();
    }

    // --- Mobile Sidebar Toggle ---
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('active');
        });
    }

    // Close sidebar when clicking outside or on a link (on mobile)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && 
            sidebar.classList.contains('active') && 
            !sidebar.contains(e.target) && 
            e.target !== mobileMenuToggle) {
            sidebar.classList.remove('active');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('active');
            }
        });
    });
});

async function checkAuth() {
    try {
        const res = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.user && data.user.role === 'admin') {
            document.getElementById('login-overlay').style.display = 'none';
            document.getElementById('admin-name-display').innerText = data.user.name;
            document.getElementById('admin-initials').innerText = data.user.name.substring(0, 2).toUpperCase();
            loadDashboard();
        } else {
            logout();
        }
    } catch (err) {
        console.error(err);
        logout();
    }
}

function loadDashboard() {
    loadAppointments();
    loadProfessionals();
    loadAdminStories();
}

// --- Tab Management ---
function showTab(tabId, el) {
    document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
    document.getElementById(`tab-${tabId}`).style.display = 'block';

    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    el.classList.add('active');
}

// --- Appointments ---
async function loadAppointments() {
    try {
        const res = await fetch(`${API_URL}/admin/appointments`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        allAppointments = data.appointments;
        renderAppointments(allAppointments);
        updateStats();
    } catch (err) {
        console.error(err);
    }
}

function renderAppointments(apps) {
    const tbody = document.getElementById('appointments-body');
    tbody.innerHTML = apps.map(a => `
        <tr>
            <td>
                <div style="font-weight: 700;">${a.userId?.name || 'Unknown'}</div>
                <div style="font-size: 0.8rem; color: #888;">${a.userId?.email || ''}</div>
            </td>
            <td><span class="badge-${a.type.toLowerCase()}">${a.type}</span></td>
            <td>
                <div style="font-weight:600; color:#5c35a8;">${a.requestedProfessional || '—'}</div>
                <div style="font-size:0.75rem; color:#888;">Requested</div>
            </td>
            <td>
                <div>${new Date(a.date).toLocaleDateString()}</div>
                <div style="font-size: 0.8rem; color: #888;">${a.time}</div>
            </td>
            <td><span class="status-badge badge-${a.status}">${a.status.toUpperCase()}</span></td>
            <td>
                ${a.status === 'pending' ? `
                    <select class="assign-select" id="assign-${a._id}" style="width: 100%;">
                        <option value="">Select Pro...</option>
                        ${professionals.map(p => `<option value="${p._id}">${p.name} (${p.role})</option>`).join('')}
                    </select>
                ` : (a.professionalId?.name || '—')}
            </td>
            <td>
                <div class="action-buttons">
                    ${a.status === 'pending' ? `
                        <button class="btn btn-primary btn-small" onclick="updateAppointment('${a._id}', 'approved')">Approve</button>
                        <button class="btn btn-small" style="background: #eee;" onclick="updateAppointment('${a._id}', 'rejected')">Reject</button>
                    ` : '—'}
                </div>
            </td>
        </tr>
    `).join('') || '<tr><td colspan="7" style="text-align:center; padding: 40px;">No appointments found.</td></tr>';
}

async function updateAppointment(id, status) {
    const professionalId = document.getElementById(`assign-${id}`)?.value;

    if (status === 'approved' && !professionalId) {
        showToast('⚠️ Please select a professional', 'error');
        return;
    }

    try {
        const res = await fetch(`${API_URL}/admin/appointments/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status, professionalId })
        });

        if (res.ok) {
            showToast(`✅ Appointment ${status}!`, 'success');
            loadAppointments();
        }
    } catch (err) {
        showToast('❌ Failed to update appointment', 'error');
    }
}

// --- Stories ---
async function loadAdminStories() {
    try {
        const res = await fetch(`${API_URL}/admin/stories`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        allStories = await res.json();
        renderStories(allStories);
    } catch (err) {
        console.error(err);
    }
}

function renderStories(stories) {
    const tbody = document.getElementById('stories-body');
    const pendingCount = stories.filter(s => s.status === 'pending').length;

    // Update badge
    const badge = document.getElementById('stories-badge');
    if (pendingCount > 0) {
        badge.innerText = pendingCount;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }

    tbody.innerHTML = stories.map(s => `
        <tr>
            <td>
                <div style="font-weight: 700;">${s.userId?.username || 'Anonymous'}</div>
                <div style="font-size: 0.8rem; color: #888;">${s.userId?.email || 'No email'}</div>
            </td>
            <td>
                <div style="font-weight: 600;">${s.title}</div>
                <div style="font-size: 0.8rem; color: #888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px;">
                    ${s.content}
                </div>
            </td>
            <td><span class="status-badge badge-${s.status}">${s.status.toUpperCase()}</span></td>
            <td>${s.readTime}</td>
            <td>
                <div class="action-buttons">
                    ${s.status === 'pending' ? `
                        <button class="btn btn-primary btn-small" onclick="updateStoryStatus('${s._id}', 'approved')">Approve</button>
                        <button class="btn btn-small" style="background: #eee;" onclick="updateStoryStatus('${s._id}', 'rejected')">Reject</button>
                    ` : `
                        <button class="btn btn-small" style="background: #eee;" onclick="updateStoryStatus('${s._id}', 'pending')">Reset</button>
                    `}
                </div>
            </td>
        </tr>
    `).join('') || '<tr><td colspan="5" style="text-align:center; padding: 40px;">No stories found.</td></tr>';
}

async function updateStoryStatus(id, status) {
    try {
        const res = await fetch(`${API_URL}/admin/stories/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });

        if (res.ok) {
            showToast(`✅ Story ${status}!`, 'success');
            loadAdminStories();
        }
    } catch (err) {
        showToast('❌ Failed to update story', 'error');
    }
}

// --- Professionals ---
async function loadProfessionals() {
    try {
        const res = await fetch(`${API_URL}/admin/professionals`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        professionals = data.professionals;
        renderProfessionals(professionals);
    } catch (err) {
        console.error(err);
    }
}

function renderProfessionals(pros) {
    const tbody = document.getElementById('professionals-body');
    tbody.innerHTML = pros.map(p => `
        <tr>
            <td><strong>${p.name}</strong></td>
            <td>${p.email}</td>
            <td><span style="text-transform: capitalize;">${p.role}</span></td>
            <td>${p.specialty || 'General'}</td>
        </tr>
    `).join('') || '<tr><td colspan="4" style="text-align:center; padding: 40px;">No professionals found.</td></tr>';
}

async function addProfessional() {
    const name = document.getElementById('pro-name').value;
    const email = document.getElementById('pro-email').value;
    const password = document.getElementById('pro-password').value;
    const role = document.getElementById('pro-role').value;
    const specialty = document.getElementById('pro-specialty').value;

    if (!name || !email || !password) {
        showToast('⚠️ Please fill required fields', 'error');
        return;
    }

    try {
        const res = await fetch(`${API_URL}/admin/professionals`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, email, password, role, specialty })
        });

        if (res.ok) {
            showToast('✅ Professional added!', 'success');
            document.getElementById('pro-name').value = '';
            document.getElementById('pro-email').value = '';
            document.getElementById('pro-password').value = '';
            document.getElementById('pro-specialty').value = '';
            loadProfessionals();
        } else {
            const data = await res.json();
            showToast(`❌ ${data.error}`, 'error');
        }
    } catch (err) {
        showToast('❌ Failed to add professional', 'error');
    }
}

// --- Search / Filter ---
function filterAppointments(query) {
    const filtered = allAppointments.filter(a =>
        (a.userId?.name || '').toLowerCase().includes(query.toLowerCase()) ||
        a.type.toLowerCase().includes(query.toLowerCase())
    );
    renderAppointments(filtered);
}

function filterStories(query) {
    const filtered = allStories.filter(s =>
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        (s.userId?.username || '').toLowerCase().includes(query.toLowerCase())
    );
    renderStories(filtered);
}

// --- Dashboard Logic ---
function updateStats() {
    document.getElementById('stat-pending').innerText = allAppointments.filter(a => a.status === 'pending').length;
    document.getElementById('stat-approved').innerText = allAppointments.filter(a => a.status === 'approved').length;
    document.getElementById('stat-completed').innerText = allAppointments.filter(a => a.status === 'completed').length;
    document.getElementById('stat-pros').innerText = professionals.length;
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

// --- Auth ---
async function adminLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btn = event.target;

    btn.disabled = true;
    btn.innerText = 'Logging in...';

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (data.token && data.user.role === 'admin') {
            token = data.token;
            localStorage.setItem('adminToken', token);
            location.reload();
        } else {
            document.getElementById('login-error').innerText = data.error || 'Access denied. Admin only.';
        }
    } catch (err) {
        document.getElementById('login-error').innerText = 'Connection error';
    } finally {
        btn.disabled = false;
        btn.innerText = 'Login';
    }
}

function logout() {
    localStorage.removeItem('adminToken');
    location.reload();
}
