/**
 * ROUTINE TABLET - CORE LOGIC & PWA CONTROLLER
 * Target: Always-on landscape Android Tablet (Lenovo Tab M10)
 */

(function () {
  'use strict';

  // --- DEFAULT ROUTINE TEMPLATE ---
  const DEFAULT_TEMPLATE = [
    { id: 'task-1', title: 'Wake up and drink water', timeOfDay: 'morning', targetTime: '07:00', days: [0, 1, 2, 3, 4, 5, 6] },
    { id: 'task-2', title: 'Exercise (home workout)', timeOfDay: 'morning', targetTime: '07:30', days: [0, 1, 2, 3, 4, 5, 6] },
    { id: 'task-3', title: 'Breakfast with protein', timeOfDay: 'morning', targetTime: '08:30', days: [0, 1, 2, 3, 4, 5, 6] },
    { id: 'task-4', title: 'Study / coding block', timeOfDay: 'morning', targetTime: '09:30', days: [0, 1, 2, 3, 4, 5, 6] },
    { id: 'task-5', title: 'Lunch', timeOfDay: 'afternoon', targetTime: '13:00', days: [0, 1, 2, 3, 4, 5, 6] },
    { id: 'task-6', title: 'Project work', timeOfDay: 'afternoon', targetTime: '14:30', days: [0, 1, 2, 3, 4, 5, 6] },
    { id: 'task-7', title: 'Evening walk or sport', timeOfDay: 'evening', targetTime: '17:30', days: [0, 1, 2, 3, 4, 5, 6] },
    { id: 'task-8', title: 'Dinner', timeOfDay: 'evening', targetTime: '20:00', days: [0, 1, 2, 3, 4, 5, 6] },
    { id: 'task-9', title: 'Plan tomorrow', timeOfDay: 'evening', targetTime: '21:30', days: [0, 1, 2, 3, 4, 5, 6] },
    { id: 'task-10', title: 'Sleep by 11 pm', timeOfDay: 'evening', targetTime: '23:00', days: [0, 1, 2, 3, 4, 5, 6] }
  ];

  const QUOTES = [
    { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Will Durant" },
    { text: "Consistency is the DNA of mastery.", author: "Robin Sharma" },
    { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
    { text: "The secret of your future is hidden in your daily routine.", author: "Mike Murdock" },
    { text: "Every action you take is a vote for the person you wish to become.", author: "James Clear" },
    { text: "Discipline equals freedom.", author: "Jocko Willink" },
    { text: "Focus on the process, not the outcome.", author: "Atomic Habits" }
  ];

  const STORAGE_KEY = 'routine_tablet_v1_state';

  // --- STATE ---
  let state = {
    version: 1,
    lastActiveDate: null,
    currentStreak: 0,
    bestStreak: 0,
    isRestDay: false,
    manualNightMode: false,
    lastReloadDate: null,
    settings: {
      threshold: 1.0, // 100%
      soundEnabled: true,
      clock24h: false,
      nightModeAuto: true,
      nightStartHour: 22,
      nightEndHour: 6,
      burnInProtection: true
    },
    template: [...DEFAULT_TEMPLATE],
    todayTasks: [],
    history: {} // "YYYY-MM-DD": { date, doneCount, totalCount, status, isRestDay, tasks }
  };

  let activeFilter = 'all';
  let wakeLockSentinel = null;
  let audioCtx = null;

  // --- UTILS ---
  function getLocalDateStr(d = new Date()) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function addDays(dateStr, numDays) {
    const parts = dateStr.split('-');
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    d.setDate(d.getDate() + numDays);
    return getLocalDateStr(d);
  }

  function daysDifference(dateStr1, dateStr2) {
    const d1 = new Date(dateStr1);
    const d2 = new Date(dateStr2);
    const diffTime = d2.getTime() - d1.getTime();
    return Math.round(diffTime / (1000 * 3600 * 24));
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        state = {
          ...state,
          ...parsed,
          settings: { ...state.settings, ...(parsed.settings || {}) }
        };
      }
    } catch (e) {
      console.error('Failed to load state from localStorage:', e);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }

  // --- AUDIO SYNTHESIZER (WEB AUDIO API) ---
  function initAudio() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSound(type) {
    if (!state.settings.soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;

      if (type === 'check') {
        // Soothing warm harmonic chord (D5 -> A5 -> D6)
        const freqs = [587.33, 880.0, 1174.66];
        freqs.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.05);

          gain.gain.setValueAtTime(0, now + idx * 0.05);
          gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.05 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.35);

          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + idx * 0.05);
          osc.stop(now + idx * 0.05 + 0.38);
        });
      } else if (type === 'uncheck') {
        // Gentle descending blip
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(260, now + 0.12);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'complete') {
        // Grand victory fanfare
        const chord = [523.25, 659.25, 783.99, 1046.50]; // C Major
        chord.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);

          gain.gain.setValueAtTime(0, now + idx * 0.08);
          gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.08 + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.6);

          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.65);
        });
      }
    } catch (err) {
      console.warn('Audio playback error:', err);
    }
  }

  // --- ROUTINE & TASK GENERATION ---
  function generateTodayTasks(dateStr) {
    const parts = dateStr.split('-');
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    const dayOfWeek = d.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat

    return state.template
      .filter(t => !t.days || t.days.includes(dayOfWeek))
      .map(t => ({
        id: t.id,
        title: t.title,
        timeOfDay: t.timeOfDay,
        targetTime: t.targetTime || '',
        done: false,
        completedAt: null
      }));
  }

  // --- DAILY ROLLOVER LOGIC ---
  function checkDateAndRollover() {
    const todayStr = getLocalDateStr();
    if (!state.lastActiveDate) {
      // First time running
      state.lastActiveDate = todayStr;
      state.todayTasks = generateTodayTasks(todayStr);
      saveState();
      renderAll();
      return;
    }

    if (todayStr > state.lastActiveDate) {
      performRollover(state.lastActiveDate, todayStr);
    }
  }

  function performRollover(prevDateStr, todayStr) {
    console.log(`Performing rollover from ${prevDateStr} to ${todayStr}`);

    // 1. Evaluate previous active day
    const prevDone = state.todayTasks.filter(t => t.done).length;
    const prevTotal = state.todayTasks.length;
    const prevRate = prevTotal > 0 ? (prevDone / prevTotal) : 1;

    let prevStatus = 'missed';
    if (state.isRestDay) {
      prevStatus = 'rest';
      // Rest day keeps current streak untouched
    } else if (prevRate >= state.settings.threshold) {
      prevStatus = 'completed';
      state.currentStreak += 1;
      state.bestStreak = Math.max(state.bestStreak, state.currentStreak);
    } else {
      prevStatus = prevDone > 0 ? 'partial' : 'missed';
      state.currentStreak = 0; // streak reset
    }

    // Save previous day to history
    state.history[prevDateStr] = {
      date: prevDateStr,
      doneCount: prevDone,
      totalCount: prevTotal,
      status: prevStatus,
      isRestDay: state.isRestDay,
      tasks: [...state.todayTasks]
    };

    // Auto backup in localStorage
    try {
      localStorage.setItem(`routine_backup_${prevDateStr}`, JSON.stringify(state));
    } catch (e) {
      console.warn('Backup error:', e);
    }

    // 2. Handle intervening skipped days if app was off for multiple days
    let cursor = addDays(prevDateStr, 1);
    while (cursor < todayStr) {
      if (!state.history[cursor]) {
        state.history[cursor] = {
          date: cursor,
          doneCount: 0,
          totalCount: 0,
          status: 'missed',
          isRestDay: false,
          tasks: []
        };
        state.currentStreak = 0;
      }
      cursor = addDays(cursor, 1);
    }

    // 3. Setup fresh tasks for today
    state.todayTasks = generateTodayTasks(todayStr);
    state.isRestDay = false;
    state.lastActiveDate = todayStr;
    saveState();

    renderAll();
  }

  // --- AUTO RELOAD AT NIGHT ---
  function checkNightAutoReload() {
    const now = new Date();
    const hour = now.getHours();
    const todayStr = getLocalDateStr(now);

    // Between 03:00 and 03:59 AM, reload once to ensure browser memory stays fresh
    if (hour === 3 && state.lastReloadDate !== todayStr) {
      state.lastReloadDate = todayStr;
      saveState();
      console.log('Nightly scheduled memory refresh. Reloading...');
      window.location.reload();
    }
  }

  // --- SCREEN WAKE LOCK ---
  async function requestWakeLock() {
    if ('wakeLock' in navigator) {
      try {
        wakeLockSentinel = await navigator.wakeLock.request('screen');
        updateWakeLockUI(true);

        wakeLockSentinel.addEventListener('release', () => {
          updateWakeLockUI(false);
          wakeLockSentinel = null;
        });
      } catch (err) {
        console.warn('Screen WakeLock error:', err.message);
        updateWakeLockUI(false);
      }
    } else {
      updateWakeLockUI(false);
    }
  }

  function updateWakeLockUI(isActive) {
    const dot = document.getElementById('wakelock-dot');
    const label = document.getElementById('wakelock-label');
    if (!dot || !label) return;

    if (isActive) {
      dot.className = 'status-dot';
      label.textContent = 'Awake';
    } else {
      dot.className = 'status-dot dot-inactive';
      label.textContent = 'Screen Lock';
    }
  }

  // --- PIXEL SHIFT (BURN-IN MITIGATION) ---
  function applyPixelShift() {
    if (!state.settings.burnInProtection) return;
    const root = document.getElementById('app-root');
    if (!root) return;

    // Small random offset between -2 and +2 pixels
    const dx = Math.floor(Math.random() * 5) - 2;
    const dy = Math.floor(Math.random() * 5) - 2;
    root.style.transform = `translate(${dx}px, ${dy}px)`;
  }

  // --- NIGHT MODE DETECTION ---
  function updateNightMode() {
    const body = document.body;
    let shouldBeNight = state.manualNightMode;

    if (state.settings.nightModeAuto && !state.manualNightMode) {
      const currentHour = new Date().getHours();
      const start = state.settings.nightStartHour;
      const end = state.settings.nightEndHour;

      if (start > end) {
        // e.g. 22:00 to 06:00
        if (currentHour >= start || currentHour < end) {
          shouldBeNight = true;
        }
      } else {
        if (currentHour >= start && currentHour < end) {
          shouldBeNight = true;
        }
      }
    }

    if (shouldBeNight) {
      body.classList.add('night-mode');
    } else {
      body.classList.remove('night-mode');
    }
  }

  // --- CLOCK & GREETING ---
  function updateClock() {
    const now = new Date();
    const clockEl = document.getElementById('digital-clock');
    const ampmEl = document.getElementById('clock-ampm');
    const dateEl = document.getElementById('date-display');
    const greetTextEl = document.getElementById('greeting-text');
    const greetIconEl = document.getElementById('greeting-icon');

    if (!clockEl || !ampmEl || !dateEl) return;

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');

    if (state.settings.clock24h) {
      clockEl.textContent = `${String(hours).padStart(2, '0')}:${minutes}`;
      ampmEl.textContent = '';
      ampmEl.style.display = 'none';
    } else {
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 becomes 12
      clockEl.textContent = `${String(hours).padStart(2, '0')}:${minutes}`;
      ampmEl.textContent = ampm;
      ampmEl.style.display = 'inline';
    }

    // Date
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    dateEl.textContent = now.toLocaleDateString('en-US', options);

    // Dynamic Greeting
    const hour24 = now.getHours();
    let greeting = 'Good morning, Kishan';
    let icon = '☀️';

    if (hour24 >= 5 && hour24 < 12) {
      greeting = 'Good morning, Kishan';
      icon = '☀️';
    } else if (hour24 >= 12 && hour24 < 17) {
      greeting = 'Good afternoon, Kishan';
      icon = '🌤️';
    } else if (hour24 >= 17 && hour24 < 22) {
      greeting = 'Good evening, Kishan';
      icon = '🌆';
    } else {
      greeting = 'Good night, Kishan';
      icon = '🌙';
    }

    greetTextEl.textContent = greeting;
    greetIconEl.textContent = icon;
  }

  // --- MOTIVATIONAL QUOTE ---
  function updateMotivationalQuote() {
    const quoteEl = document.getElementById('quote-text');
    const authorEl = document.getElementById('quote-author');
    if (!quoteEl || !authorEl) return;

    // Use day of year to deterministically select quote
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const quote = QUOTES[dayOfYear % QUOTES.length];
    quoteEl.textContent = `"${quote.text}"`;
    authorEl.textContent = `— ${quote.author}`;
  }

  // --- RENDERING ---
  function renderAll() {
    updateClock();
    updateNightMode();
    renderSidebarStats();
    renderTasks();
    renderTemplateList();
  }

  function renderSidebarStats() {
    const streakCountEl = document.getElementById('current-streak-val');
    const bestStreakEl = document.getElementById('best-streak-tag');
    const streakCard = document.getElementById('streak-card');
    const streakStatusText = document.getElementById('streak-status-text');

    const progressFractionEl = document.getElementById('progress-fraction');
    const progressFillEl = document.getElementById('progress-fill');
    const progressPercentEl = document.getElementById('progress-percent');
    const restDayIndicator = document.getElementById('rest-day-indicator');
    const celebrationBanner = document.getElementById('celebration-banner');

    const total = state.todayTasks.length;
    const done = state.todayTasks.filter(t => t.done).length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 100;

    // Streak
    streakCountEl.textContent = state.currentStreak;
    bestStreakEl.textContent = `Best: ${state.bestStreak}d`;

    if (state.isRestDay) {
      streakCard.classList.remove('streak-locked');
      streakStatusText.textContent = '🏖️ Rest Day Active (Streak Preserved)';
    } else if (done >= total && total > 0) {
      streakCard.classList.add('streak-locked');
      streakStatusText.textContent = '🔥 Target Reached! Streak advancing tomorrow';
    } else {
      streakCard.classList.remove('streak-locked');
      streakStatusText.textContent = `${total - done} more to complete today's streak`;
    }

    // Progress
    progressFractionEl.textContent = `${done} of ${total}`;
    progressFillEl.style.width = `${percent}%`;
    progressPercentEl.textContent = `${percent}% Done`;

    // Rest Day badge
    restDayIndicator.style.display = state.isRestDay ? 'inline-block' : 'none';

    // Celebration banner
    if (done >= total && total > 0) {
      celebrationBanner.style.display = 'block';
    } else {
      celebrationBanner.style.display = 'none';
    }

    // Update filter counts
    const morningCount = state.todayTasks.filter(t => t.timeOfDay === 'morning').length;
    const afternoonCount = state.todayTasks.filter(t => t.timeOfDay === 'afternoon').length;
    const eveningCount = state.todayTasks.filter(t => t.timeOfDay === 'evening').length;

    document.getElementById('count-all').textContent = total;
    document.getElementById('count-morning').textContent = morningCount;
    document.getElementById('count-afternoon').textContent = afternoonCount;
    document.getElementById('count-evening').textContent = eveningCount;
  }

  function renderTasks() {
    const grid = document.getElementById('task-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const filtered = state.todayTasks.filter(t => {
      if (activeFilter === 'all') return true;
      return t.timeOfDay === activeFilter;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px; color: var(--text-tertiary);">
          <div style="font-size: 2.5rem; margin-bottom: 8px;">✨</div>
          <p style="font-size: 1.1rem; font-weight: 600;">No tasks scheduled for this section.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(task => {
      const card = document.createElement('div');
      card.className = `task-card ${task.done ? 'task-done' : ''}`;
      card.setAttribute('role', 'checkbox');
      card.setAttribute('aria-checked', task.done ? 'true' : 'false');
      card.setAttribute('tabindex', '0');

      // Checkbox SVG with draw animation
      const checkSvg = `
        <div class="task-checkbox-wrap">
          <div class="custom-checkbox">
            <svg viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>
      `;

      let timeTagClass = 'tag-anytime';
      if (task.timeOfDay === 'morning') timeTagClass = 'tag-morning';
      else if (task.timeOfDay === 'afternoon') timeTagClass = 'tag-afternoon';
      else if (task.timeOfDay === 'evening') timeTagClass = 'tag-evening';

      const timeHint = task.targetTime ? `<span class="task-time">${task.targetTime}</span>` : '';

      card.innerHTML = `
        ${checkSvg}
        <div class="task-info">
          <span class="task-title">${escapeHtml(task.title)}</span>
          <div class="task-meta">
            <span class="task-tag ${timeTagClass}">${task.timeOfDay}</span>
            ${timeHint}
          </div>
        </div>
      `;

      // Tap / Click handling
      card.addEventListener('click', () => {
        toggleTask(task.id);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          toggleTask(task.id);
        }
      });

      grid.appendChild(card);
    });
  }

  function toggleTask(taskId) {
    const task = state.todayTasks.find(t => t.id === taskId);
    if (!task) return;

    task.done = !task.done;
    task.completedAt = task.done ? new Date().toISOString() : null;

    if (task.done) {
      playSound('check');
      const allDone = state.todayTasks.length > 0 && state.todayTasks.every(t => t.done);
      if (allDone) {
        setTimeout(() => playSound('complete'), 300);
      }
    } else {
      playSound('uncheck');
    }

    saveState();
    renderSidebarStats();
    renderTasks();
  }

  // --- ROUTINE TEMPLATE EDITOR ---
  function renderTemplateList() {
    const listEl = document.getElementById('template-list');
    if (!listEl) return;

    listEl.innerHTML = '';

    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    state.template.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'template-item';

      const activeDaysStr = (item.days && item.days.length === 7)
        ? 'Everyday'
        : (item.days || []).map(d => dayLabels[d]).join(', ');

      row.innerHTML = `
        <div class="template-item-info">
          <span class="template-item-title">${escapeHtml(item.title)}</span>
          <div class="template-item-meta">
            <span style="text-transform: capitalize; color: var(--accent-cyan);">${item.timeOfDay}</span>
            <span>•</span>
            <span>${item.targetTime || 'Anytime'}</span>
            <span>•</span>
            <span>${activeDaysStr}</span>
          </div>
        </div>
        <div class="template-item-actions">
          <button class="btn-icon-sm btn-move-up" data-idx="${index}" title="Move Up" ${index === 0 ? 'disabled style="opacity:0.3"' : ''}>▲</button>
          <button class="btn-icon-sm btn-move-down" data-idx="${index}" title="Move Down" ${index === state.template.length - 1 ? 'disabled style="opacity:0.3"' : ''}>▼</button>
          <button class="btn-icon-sm btn-edit-template" data-idx="${index}" title="Edit">✏️</button>
          <button class="btn-icon-sm btn-delete-template" data-idx="${index}" title="Delete">🗑️</button>
        </div>
      `;

      listEl.appendChild(row);
    });

    // Attach actions
    listEl.querySelectorAll('.btn-move-up').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        if (idx > 0) {
          const temp = state.template[idx];
          state.template[idx] = state.template[idx - 1];
          state.template[idx - 1] = temp;
          saveState();
          renderTemplateList();
        }
      });
    });

    listEl.querySelectorAll('.btn-move-down').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        if (idx < state.template.length - 1) {
          const temp = state.template[idx];
          state.template[idx] = state.template[idx + 1];
          state.template[idx + 1] = temp;
          saveState();
          renderTemplateList();
        }
      });
    });

    listEl.querySelectorAll('.btn-edit-template').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        openEditTaskForm(state.template[idx]);
      });
    });

    listEl.querySelectorAll('.btn-delete-template').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        if (confirm(`Delete routine task "${state.template[idx].title}"?`)) {
          state.template.splice(idx, 1);
          saveState();
          renderTemplateList();
        }
      });
    });
  }

  function openEditTaskForm(task = null) {
    const form = document.getElementById('task-form');
    const idInput = document.getElementById('edit-task-id');
    const titleInput = document.getElementById('task-title-input');
    const todSelect = document.getElementById('task-tod-select');
    const timeInput = document.getElementById('task-time-input');
    const dayChecks = document.querySelectorAll('input[name="task-day"]');

    form.style.display = 'flex';

    if (task) {
      idInput.value = task.id;
      titleInput.value = task.title;
      todSelect.value = task.timeOfDay || 'morning';
      timeInput.value = task.targetTime || '';
      dayChecks.forEach(cb => {
        cb.checked = (task.days || []).includes(parseInt(cb.value, 10));
      });
    } else {
      idInput.value = '';
      titleInput.value = '';
      todSelect.value = 'morning';
      timeInput.value = '';
      dayChecks.forEach(cb => cb.checked = true);
    }

    titleInput.focus();
  }

  function closeEditTaskForm() {
    const form = document.getElementById('task-form');
    form.reset();
    form.style.display = 'none';
  }

  function handleSaveTaskForm(e) {
    e.preventDefault();
    const idInput = document.getElementById('edit-task-id').value;
    const title = document.getElementById('task-title-input').value.trim();
    const tod = document.getElementById('task-tod-select').value;
    const targetTime = document.getElementById('task-time-input').value;

    const selectedDays = [];
    document.querySelectorAll('input[name="task-day"]:checked').forEach(cb => {
      selectedDays.push(parseInt(cb.value, 10));
    });

    if (!title) return;

    if (idInput) {
      // Edit existing
      const existing = state.template.find(t => t.id === idInput);
      if (existing) {
        existing.title = title;
        existing.timeOfDay = tod;
        existing.targetTime = targetTime;
        existing.days = selectedDays;

        // Also update today's task if present
        const todayT = state.todayTasks.find(t => t.id === idInput);
        if (todayT) {
          todayT.title = title;
          todayT.timeOfDay = tod;
          todayT.targetTime = targetTime;
        }
      }
    } else {
      // Add new
      const newId = 'task-' + Date.now();
      const newTask = {
        id: newId,
        title,
        timeOfDay: tod,
        targetTime,
        days: selectedDays
      };
      state.template.push(newTask);

      // Check if applies to today
      const todayDayOfWeek = new Date().getDay();
      if (selectedDays.includes(todayDayOfWeek)) {
        state.todayTasks.push({
          id: newId,
          title,
          timeOfDay: tod,
          targetTime,
          done: false,
          completedAt: null
        });
      }
    }

    saveState();
    closeEditTaskForm();
    renderAll();
  }

  // --- HISTORY & HEATMAP ---
  function renderHistoryModal() {
    // 1. Calculate Summary Stats
    const historyEntries = Object.values(state.history);
    const totalDays = historyEntries.length;
    const perfectDays = historyEntries.filter(h => h.status === 'completed').length;

    // Last 7 days rate
    let last7Completed = 0;
    let last7Total = 0;
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const ds = getLocalDateStr(d);
      if (state.history[ds]) {
        last7Total++;
        if (state.history[ds].status === 'completed') last7Completed++;
      }
    }
    const rate7 = last7Total > 0 ? Math.round((last7Completed / last7Total) * 100) : 0;

    // Last 30 days rate
    let last30Completed = 0;
    let last30Total = 0;
    for (let i = 1; i <= 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const ds = getLocalDateStr(d);
      if (state.history[ds]) {
        last30Total++;
        if (state.history[ds].status === 'completed') last30Completed++;
      }
    }
    const rate30 = last30Total > 0 ? Math.round((last30Completed / last30Total) * 100) : 0;

    document.getElementById('stat-current-streak').textContent = state.currentStreak;
    document.getElementById('stat-best-streak').textContent = state.bestStreak;
    document.getElementById('stat-7day-rate').textContent = `${rate7}%`;
    document.getElementById('stat-30day-rate').textContent = `${rate30}%`;
    document.getElementById('stat-total-completed').textContent = perfectDays;

    // 2. Render Heatmap (Past 60 Days)
    const heatmapGrid = document.getElementById('heatmap-grid');
    heatmapGrid.innerHTML = '';

    const daysToShow = 60;
    const cells = [];

    for (let i = daysToShow - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = getLocalDateStr(d);
      const dayNum = d.getDate();

      let cellClass = 'cell-missed';
      let record = state.history[dateStr];

      if (i === 0) {
        // Today
        const done = state.todayTasks.filter(t => t.done).length;
        const total = state.todayTasks.length;
        if (state.isRestDay) cellClass = 'cell-rest';
        else if (done >= total && total > 0) cellClass = 'cell-completed';
        else if (done > 0) cellClass = 'cell-partial';
        else cellClass = 'cell-missed';
      } else if (record) {
        if (record.status === 'completed') cellClass = 'cell-completed';
        else if (record.status === 'partial') cellClass = 'cell-partial';
        else if (record.status === 'rest') cellClass = 'cell-rest';
        else cellClass = 'cell-missed';
      }

      const cell = document.createElement('div');
      cell.className = `heatmap-cell ${cellClass}`;
      cell.textContent = dayNum;
      cell.title = dateStr;

      cell.addEventListener('click', () => {
        showDayDetail(dateStr, i === 0);
      });

      heatmapGrid.appendChild(cell);
    }
  }

  function showDayDetail(dateStr, isToday = false) {
    const titleEl = document.getElementById('detail-date-title');
    const listEl = document.getElementById('detail-tasks-list');

    titleEl.textContent = `Details for ${dateStr} ${isToday ? '(Today)' : ''}`;
    listEl.innerHTML = '';

    let tasks = [];
    let isRest = false;

    if (isToday) {
      tasks = state.todayTasks;
      isRest = state.isRestDay;
    } else if (state.history[dateStr]) {
      tasks = state.history[dateStr].tasks || [];
      isRest = state.history[dateStr].isRestDay;
    }

    if (isRest) {
      listEl.innerHTML = '<p style="color: #a5b4fc; font-weight: 600;">🏖️ Rest Day was active.</p>';
      return;
    }

    if (tasks.length === 0) {
      listEl.innerHTML = '<p style="color: var(--text-tertiary);">No routine recorded for this day.</p>';
      return;
    }

    tasks.forEach(t => {
      const item = document.createElement('div');
      item.className = `detail-task-item ${t.done ? 'is-done' : ''}`;
      item.innerHTML = `
        <span>${t.done ? '✅' : '⚪'}</span>
        <span>${escapeHtml(t.title)}</span>
        <span style="color: var(--text-tertiary); font-size: 0.75rem;">(${t.timeOfDay})</span>
      `;
      listEl.appendChild(item);
    });
  }

  // --- EXPORT / IMPORT / RESET ---
  function exportData() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `routine-tablet-backup-${getLocalDateStr()}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function importData(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported && imported.template && Array.isArray(imported.template)) {
          state = {
            ...state,
            ...imported,
            settings: { ...state.settings, ...(imported.settings || {}) }
          };
          saveState();
          renderAll();
          alert('Data imported successfully!');
          document.getElementById('settings-modal').style.display = 'none';
        } else {
          alert('Invalid backup file structure.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  }

  function resetToDefaults() {
    if (confirm('Are you sure you want to reset all routines to default? Your streaks will be preserved.')) {
      state.template = [...DEFAULT_TEMPLATE];
      state.todayTasks = generateTodayTasks(getLocalDateStr());
      saveState();
      renderAll();
      alert('Routine reset to defaults.');
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  // --- EVENT LISTENERS SETUP ---
  function setupEventListeners() {
    // Filter tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter;
        renderTasks();
      });
    });

    // Sound toggle
    const soundBtn = document.getElementById('btn-sound');
    soundBtn.addEventListener('click', () => {
      state.settings.soundEnabled = !state.settings.soundEnabled;
      document.getElementById('sound-icon').textContent = state.settings.soundEnabled ? '🔊' : '🔇';
      document.getElementById('setting-sound').checked = state.settings.soundEnabled;
      saveState();
      if (state.settings.soundEnabled) playSound('check');
    });

    // Rest day toggle
    const restBtn = document.getElementById('btn-rest');
    restBtn.addEventListener('click', () => {
      state.isRestDay = !state.isRestDay;
      saveState();
      renderSidebarStats();
      if (state.isRestDay) {
        alert("🏖️ Today is set as a Rest Day! Your streak will not break even if tasks are unticked.");
      }
    });

    // Night mode manual toggle
    const nightBtn = document.getElementById('btn-night');
    nightBtn.addEventListener('click', () => {
      state.manualNightMode = !state.manualNightMode;
      updateNightMode();
    });

    // Settings Modal
    const settingsBtn = document.getElementById('btn-settings');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsBtn = document.getElementById('btn-close-settings');

    settingsBtn.addEventListener('click', () => {
      settingsModal.style.display = 'flex';
      renderTemplateList();
    });

    closeSettingsBtn.addEventListener('click', () => {
      settingsModal.style.display = 'none';
      closeEditTaskForm();
    });

    // Settings tabs
    document.querySelectorAll('.modal-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');
        const targetId = `pane-${btn.dataset.modaltab}`;
        document.getElementById(targetId).style.display = 'block';
      });
    });

    // Routine Form
    document.getElementById('btn-add-task').addEventListener('click', () => {
      openEditTaskForm(null);
    });

    document.getElementById('btn-cancel-task').addEventListener('click', () => {
      closeEditTaskForm();
    });

    document.getElementById('task-form').addEventListener('submit', handleSaveTaskForm);

    // Settings Inputs
    const thresholdSelect = document.getElementById('setting-threshold');
    thresholdSelect.value = String(state.settings.threshold);
    thresholdSelect.addEventListener('change', () => {
      state.settings.threshold = parseFloat(thresholdSelect.value);
      saveState();
      renderSidebarStats();
    });

    const clockFormatSelect = document.getElementById('setting-clock-format');
    clockFormatSelect.value = state.settings.clock24h ? '24' : '12';
    clockFormatSelect.addEventListener('change', () => {
      state.settings.clock24h = (clockFormatSelect.value === '24');
      saveState();
      updateClock();
    });

    const soundCheck = document.getElementById('setting-sound');
    soundCheck.checked = state.settings.soundEnabled;
    soundCheck.addEventListener('change', () => {
      state.settings.soundEnabled = soundCheck.checked;
      document.getElementById('sound-icon').textContent = state.settings.soundEnabled ? '🔊' : '🔇';
      saveState();
    });

    const nightAutoCheck = document.getElementById('setting-night-auto');
    nightAutoCheck.checked = state.settings.nightModeAuto;
    nightAutoCheck.addEventListener('change', () => {
      state.settings.nightModeAuto = nightAutoCheck.checked;
      saveState();
      updateNightMode();
    });

    const nightStartInput = document.getElementById('setting-night-start');
    nightStartInput.value = state.settings.nightStartHour;
    nightStartInput.addEventListener('change', () => {
      state.settings.nightStartHour = parseInt(nightStartInput.value, 10);
      saveState();
      updateNightMode();
    });

    const nightEndInput = document.getElementById('setting-night-end');
    nightEndInput.value = state.settings.nightEndHour;
    nightEndInput.addEventListener('change', () => {
      state.settings.nightEndHour = parseInt(nightEndInput.value, 10);
      saveState();
      updateNightMode();
    });

    const burninCheck = document.getElementById('setting-burnin');
    burninCheck.checked = state.settings.burnInProtection;
    burninCheck.addEventListener('change', () => {
      state.settings.burnInProtection = burninCheck.checked;
      saveState();
    });

    // Backup buttons
    document.getElementById('btn-export-json').addEventListener('click', exportData);

    const importInput = document.getElementById('import-file-input');
    document.getElementById('btn-trigger-import').addEventListener('click', () => {
      importInput.click();
    });
    importInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        importData(e.target.files[0]);
      }
    });

    document.getElementById('btn-reset-routine').addEventListener('click', resetToDefaults);

    // History Modal
    const historyBtn = document.getElementById('btn-history');
    const historyModal = document.getElementById('history-modal');
    const closeHistoryBtn = document.getElementById('btn-close-history');

    historyBtn.addEventListener('click', () => {
      historyModal.style.display = 'flex';
      renderHistoryModal();
    });

    closeHistoryBtn.addEventListener('click', () => {
      historyModal.style.display = 'none';
    });

    // Close modal on click outside
    window.addEventListener('click', (e) => {
      if (e.target === settingsModal) {
        settingsModal.style.display = 'none';
        closeEditTaskForm();
      }
      if (e.target === historyModal) {
        historyModal.style.display = 'none';
      }
    });

    // Re-acquire wake lock & check rollover on visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
        checkDateAndRollover();
        updateNightMode();
      }
    });

    // Tap anywhere to unlock audio context & re-request wake lock
    window.addEventListener('pointerdown', () => {
      initAudio();
      if (!wakeLockSentinel) {
        requestWakeLock();
      }
    }, { once: false });
  }

  // --- SERVICE WORKER REGISTRATION ---
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(reg => {
            console.log('ServiceWorker registered successfully with scope:', reg.scope);
          })
          .catch(err => {
            console.warn('ServiceWorker registration failed:', err);
          });
      });
    }
  }

  // --- INITIALIZATION ---
  function init() {
    loadState();
    checkDateAndRollover();
    setupEventListeners();
    updateClock();
    updateMotivationalQuote();
    updateNightMode();
    renderAll();
    requestWakeLock();
    registerServiceWorker();

    // Regular Timers:
    // 1. Clock update every second
    setInterval(updateClock, 1000);

    // 2. Midnight date check and night mode check every 5 seconds
    setInterval(() => {
      checkDateAndRollover();
      updateNightMode();
      checkNightAutoReload();
    }, 5000);

    // 3. Pixel shift for screen burn-in protection every 3 minutes (180s)
    setInterval(applyPixelShift, 180000);
  }

  // Launch when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
