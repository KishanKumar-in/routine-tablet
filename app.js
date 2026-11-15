/**
 * ROUTINE TABLET - CORE LOGIC & PWA CONTROLLER (V2 Premium)
 * Designed for landscape wall tablet (Lenovo Tab M10, 1280x800)
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
    "Consistency is the DNA of mastery.",
    "We are what we repeatedly do. Excellence is a habit.",
    "Small daily improvements lead to stunning long-term results.",
    "The secret of your future is hidden in your daily routine.",
    "Every action you take is a vote for the person you wish to become.",
    "Discipline equals freedom.",
    "Focus on the trajectory, not the current position."
  ];

  const STORAGE_KEY = 'routine_tablet_v2_state';
  const RING_CIRCUMFERENCE = 452.39; // 2 * Math.PI * 72

  // --- STATE ---
  let state = {
    version: 2,
    lastActiveDate: null,
    currentStreak: 0,
    bestStreak: 0,
    isRestDay: false,
    manualNightMode: false,
    lastReloadDate: null,
    celebrationTriggeredToday: false,
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
    history: {}
  };

  let activeFilter = 'all';
  let wakeLockSentinel = null;
  let audioCtx = null;
  let nextTaskId = null;

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

  function formatTimeDisplay(timeStr, clock24h = false) {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    if (parts.length < 2) return timeStr;
    let h = parseInt(parts[0], 10);
    const m = parts[1];
    if (clock24h) {
      return `${String(h).padStart(2, '0')}:${m}`;
    }
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    return `${String(h).padStart(2, '0')}:${m} ${ampm}`;
  }

  function isTimePassed(targetTimeStr) {
    if (!targetTimeStr) return false;
    const now = new Date();
    const parts = targetTimeStr.split(':');
    if (parts.length < 2) return false;
    const targetMinutes = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    return currentMinutes > targetMinutes;
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
      console.error('Failed to load state:', e);
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
        // Crisp, soothing upward chime (D5 -> A5 -> D6)
        const freqs = [587.33, 880.0, 1174.66];
        freqs.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.045);

          gain.gain.setValueAtTime(0, now + idx * 0.045);
          gain.gain.linearRampToValueAtTime(0.14, now + idx * 0.045 + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.045 + 0.32);

          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + idx * 0.045);
          osc.stop(now + idx * 0.045 + 0.35);
        });
      } else if (type === 'uncheck') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(260, now + 0.12);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.14);
      } else if (type === 'complete') {
        const chord = [523.25, 659.25, 783.99, 1046.50]; // C Major
        chord.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);

          gain.gain.setValueAtTime(0, now + idx * 0.07);
          gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.07 + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.6);

          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.65);
        });
      }
    } catch (err) {
      console.warn('Audio error:', err);
    }
  }

  // --- CONFETTI ANIMATION (Subtle & Calm) ---
  function triggerConfetti() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#2DD4BF', '#06B6D4', '#F59E0B', '#38BDF8', '#F3F5F9'];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() * 200 - 100),
        y: canvas.height / 3 + (Math.random() * 100 - 50),
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.7) * 9,
        size: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 6,
        alpha: 1
      });
    }

    let animationFrame;
    const startTime = Date.now();

    function render() {
      const elapsed = Date.now() - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22; // gravity
        p.rotation += p.vr;
        p.alpha -= 0.009;

        if (p.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (elapsed < 2500) {
        animationFrame = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationFrame);
      }
    }

    render();
  }

  // --- ROUTINE & TASK GENERATION ---
  function generateTodayTasks(dateStr) {
    const parts = dateStr.split('-');
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    const dayOfWeek = d.getDay();

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
    const prevDone = state.todayTasks.filter(t => t.done).length;
    const prevTotal = state.todayTasks.length;
    const prevRate = prevTotal > 0 ? (prevDone / prevTotal) : 1;

    let prevStatus = 'missed';
    if (state.isRestDay) {
      prevStatus = 'rest';
    } else if (prevRate >= state.settings.threshold) {
      prevStatus = 'completed';
      state.currentStreak += 1;
      state.bestStreak = Math.max(state.bestStreak, state.currentStreak);
    } else {
      prevStatus = prevDone > 0 ? 'partial' : 'missed';
      state.currentStreak = 0;
    }

    state.history[prevDateStr] = {
      date: prevDateStr,
      doneCount: prevDone,
      totalCount: prevTotal,
      status: prevStatus,
      isRestDay: state.isRestDay,
      tasks: [...state.todayTasks]
    };

    try {
      localStorage.setItem(`routine_backup_${prevDateStr}`, JSON.stringify(state));
    } catch (e) {
      console.warn('Backup error:', e);
    }

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

    state.todayTasks = generateTodayTasks(todayStr);
    state.isRestDay = false;
    state.celebrationTriggeredToday = false;
    state.lastActiveDate = todayStr;
    saveState();

    renderAll();
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
    if (!dot) return;
    if (isActive) {
      dot.className = 'dock-dot';
    } else {
      dot.className = 'dock-dot dot-inactive';
    }
  }

  // --- PIXEL SHIFT (BURN-IN MITIGATION) ---
  function applyPixelShift() {
    if (!state.settings.burnInProtection) return;
    const root = document.getElementById('app-root');
    if (!root) return;
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
      hours = hours ? hours : 12;
      clockEl.textContent = `${String(hours).padStart(2, '0')}:${minutes}`;
      ampmEl.textContent = ampm;
      ampmEl.style.display = 'inline';
    }

    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    dateEl.textContent = now.toLocaleDateString('en-US', options);

    const hour24 = now.getHours();
    let greeting = 'Good morning, Kishan';
    if (hour24 >= 5 && hour24 < 12) greeting = 'Good morning, Kishan';
    else if (hour24 >= 12 && hour24 < 17) greeting = 'Good afternoon, Kishan';
    else if (hour24 >= 17 && hour24 < 22) greeting = 'Good evening, Kishan';
    else greeting = 'Good night, Kishan';

    greetTextEl.textContent = greeting;
  }

  // --- MOTIVATIONAL QUOTE ---
  function updateMotivationalQuote() {
    const quoteEl = document.getElementById('quote-text');
    if (!quoteEl) return;
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    quoteEl.textContent = `"${QUOTES[dayOfYear % QUOTES.length]}"`;
  }

  // --- 7-DAY HISTORY STRIP (MON - SUN) ---
  function renderWeekStrip() {
    const strip = document.getElementById('week-strip');
    const restBadge = document.getElementById('rest-badge-pill');
    if (!strip) return;

    strip.innerHTML = '';
    restBadge.style.display = state.isRestDay ? 'inline-block' : 'none';

    const now = new Date();
    const currentDayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
    // Convert to Monday-first index: Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6
    const mondayIndex = (currentDayOfWeek + 6) % 7;

    const dayLetters = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    for (let i = 0; i < 7; i++) {
      const dayOffset = i - mondayIndex;
      const targetDate = new Date(now);
      targetDate.setDate(now.getDate() + dayOffset);
      const dateStr = getLocalDateStr(targetDate);

      const col = document.createElement('div');
      col.className = `week-day-col ${i === mondayIndex ? 'is-today' : ''}`;

      let circleClass = 'day-missed';
      let circleText = '';

      if (i === mondayIndex) {
        // Today
        const total = state.todayTasks.length;
        const done = state.todayTasks.filter(t => t.done).length;
        if (state.isRestDay) {
          circleClass = 'day-rest';
        } else if (done >= total && total > 0) {
          circleClass = 'day-full';
        } else {
          circleClass = 'day-today-outline';
        }
      } else if (i < mondayIndex) {
        // Past day in current week
        const record = state.history[dateStr];
        if (record) {
          if (record.status === 'completed') circleClass = 'day-full';
          else if (record.status === 'partial') circleClass = 'day-partial';
          else if (record.status === 'rest') circleClass = 'day-rest';
          else circleClass = 'day-missed';
        } else {
          circleClass = 'day-missed';
        }
      } else {
        // Future day in current week
        circleClass = 'day-missed';
      }

      col.innerHTML = `
        <span class="week-day-label">${dayLetters[i]}</span>
        <div class="week-circle ${circleClass}">${circleText}</div>
      `;

      strip.appendChild(col);
    }
  }

  // --- "UP NEXT" CARD & TASKS RENDERING ---
  function renderAll() {
    updateClock();
    updateNightMode();
    renderHeroSection();
    renderWeekStrip();
    renderTasks();
    renderTemplateList();
  }

  function renderHeroSection() {
    const total = state.todayTasks.length;
    const done = state.todayTasks.filter(t => t.done).length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 100;

    // 1. Progress Ring
    const ringBar = document.getElementById('progress-ring-bar');
    const ringPercent = document.getElementById('ring-percent');
    const ringFraction = document.getElementById('ring-fraction');

    if (ringBar && ringPercent && ringFraction) {
      const offset = RING_CIRCUMFERENCE - (percent / 100) * RING_CIRCUMFERENCE;
      ringBar.style.strokeDashoffset = offset;
      ringPercent.textContent = `${percent}%`;
      ringFraction.textContent = `${done} of ${total} done`;
    }

    // 2. Hero Streak
    const streakCountEl = document.getElementById('current-streak-val');
    const bestStreakEl = document.getElementById('best-streak-tag');
    const streakCard = document.getElementById('streak-card');
    const streakHint = document.getElementById('streak-status-hint');

    streakCountEl.textContent = state.currentStreak;
    bestStreakEl.textContent = `Best: ${state.bestStreak}d`;

    if (state.isRestDay) {
      streakCard.classList.remove('streak-completed-today');
      streakHint.textContent = 'Rest Day (Preserved)';
    } else if (done >= total && total > 0) {
      streakCard.classList.add('streak-completed-today');
      streakHint.textContent = 'Locked in for tomorrow!';
    } else {
      streakCard.classList.remove('streak-completed-today');
      streakHint.textContent = `${total - done} left today`;
    }
  }

  function renderTasks() {
    const grid = document.getElementById('task-grid');
    const filterBadge = document.getElementById('active-filter-badge');
    const upnextCard = document.getElementById('upnext-card');
    const upnextLabel = document.getElementById('upnext-label');
    const upnextTime = document.getElementById('upnext-time');
    const upnextTitle = document.getElementById('upnext-title');
    const upnextBtn = document.getElementById('btn-upnext-done');

    if (!grid) return;

    // Filter tasks
    const filteredTasks = state.todayTasks.filter(t => {
      if (activeFilter === 'all') return true;
      return t.timeOfDay === activeFilter;
    });

    filterBadge.textContent = `${filteredTasks.length} tasks`;

    // 1. Identify "UP NEXT" Task (First unfinished task)
    const unfinishedTask = filteredTasks.find(t => !t.done) || state.todayTasks.find(t => !t.done);
    const allDone = state.todayTasks.length > 0 && state.todayTasks.every(t => t.done);

    if (allDone) {
      nextTaskId = null;
      upnextCard.className = 'upnext-card all-done-card';
      upnextLabel.textContent = 'ALL COMPLETED';
      upnextTime.textContent = 'Today';
      upnextTitle.textContent = 'All routines completed. Fantastic consistency!';
      upnextBtn.style.display = 'none';

      // Calm celebration trigger once
      if (!state.celebrationTriggeredToday) {
        state.celebrationTriggeredToday = true;
        saveState();
        playSound('complete');
        triggerConfetti();
      }
    } else if (unfinishedTask) {
      nextTaskId = unfinishedTask.id;
      upnextCard.className = 'upnext-card';
      upnextBtn.style.display = 'inline-flex';

      const overdue = isTimePassed(unfinishedTask.targetTime);
      upnextLabel.textContent = overdue ? 'OVERDUE' : 'UP NEXT';
      upnextTime.textContent = formatTimeDisplay(unfinishedTask.targetTime, state.settings.clock24h) || 'Today';
      upnextTitle.textContent = unfinishedTask.title;
    } else {
      nextTaskId = null;
      upnextCard.className = 'upnext-card';
      upnextLabel.textContent = 'ROUTINE';
      upnextTime.textContent = '';
      upnextTitle.textContent = 'No tasks in this section';
      upnextBtn.style.display = 'none';
    }

    // 2. Render stretching task grid
    grid.innerHTML = '';

    if (filteredTasks.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; display:flex; align-items:center; justify-content:center; color: var(--text-tertiary); font-size: 20px;">
          No routine tasks scheduled.
        </div>
      `;
      return;
    }

    filteredTasks.forEach(task => {
      const card = document.createElement('div');
      card.className = `task-card ${task.done ? 'task-done' : ''}`;
      card.setAttribute('role', 'checkbox');
      card.setAttribute('aria-checked', task.done ? 'true' : 'false');
      card.setAttribute('tabindex', '0');

      const checkSvg = `
        <div class="checkbox-circle">
          <svg viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      `;

      const overdue = (!task.done && isTimePassed(task.targetTime));
      const overdueDot = overdue ? '<span class="overdue-dot" title="Overdue"></span>' : '';
      const formattedTime = formatTimeDisplay(task.targetTime, state.settings.clock24h);

      card.innerHTML = `
        <div class="card-left-section">
          ${checkSvg}
          <div class="card-title-stack">
            <span class="section-eyebrow">${task.timeOfDay}</span>
            <span class="task-title-text">${escapeHtml(task.title)}</span>
          </div>
        </div>
        <div class="card-time-badge">
          ${overdueDot}
          <span>${formattedTime}</span>
        </div>
      `;

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
      if (allDone && !state.celebrationTriggeredToday) {
        state.celebrationTriggeredToday = true;
        setTimeout(() => {
          playSound('complete');
          triggerConfetti();
        }, 200);
      }
    } else {
      playSound('uncheck');
      state.celebrationTriggeredToday = false;
    }

    saveState();
    renderHeroSection();
    renderWeekStrip();
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
      row.className = 'template-row-item';

      const activeDaysStr = (item.days && item.days.length === 7)
        ? 'Everyday'
        : (item.days || []).map(d => dayLabels[d]).join(', ');

      row.innerHTML = `
        <div class="template-item-meta">
          <span class="template-item-name">${escapeHtml(item.title)}</span>
          <div class="template-item-tags">
            <span>${item.timeOfDay}</span>
            <span>•</span>
            <span>${item.targetTime ? formatTimeDisplay(item.targetTime, state.settings.clock24h) : 'Anytime'}</span>
            <span>•</span>
            <span>${activeDaysStr}</span>
          </div>
        </div>
        <div class="template-item-controls">
          <button class="btn-ctrl btn-move-up" data-idx="${index}" title="Move Up" ${index === 0 ? 'disabled style="opacity:0.25"' : ''}>
            <svg class="icon-svg" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"></polyline></svg>
          </button>
          <button class="btn-ctrl btn-move-down" data-idx="${index}" title="Move Down" ${index === state.template.length - 1 ? 'disabled style="opacity:0.25"' : ''}>
            <svg class="icon-svg" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <button class="btn-ctrl btn-edit-template" data-idx="${index}" title="Edit">
            <svg class="icon-svg" viewBox="0 0 24 24"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          </button>
          <button class="btn-ctrl btn-delete-template" data-idx="${index}" title="Delete">
            <svg class="icon-svg" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      `;

      listEl.appendChild(row);
    });

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
      const existing = state.template.find(t => t.id === idInput);
      if (existing) {
        existing.title = title;
        existing.timeOfDay = tod;
        existing.targetTime = targetTime;
        existing.days = selectedDays;

        const todayT = state.todayTasks.find(t => t.id === idInput);
        if (todayT) {
          todayT.title = title;
          todayT.timeOfDay = tod;
          todayT.targetTime = targetTime;
        }
      }
    } else {
      const newId = 'task-' + Date.now();
      const newTask = {
        id: newId,
        title,
        timeOfDay: tod,
        targetTime,
        days: selectedDays
      };
      state.template.push(newTask);

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
    const historyEntries = Object.values(state.history);
    const perfectDays = historyEntries.filter(h => h.status === 'completed').length;

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

    const heatmapGrid = document.getElementById('heatmap-grid');
    heatmapGrid.innerHTML = '';

    const daysToShow = 60;
    for (let i = daysToShow - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = getLocalDateStr(d);
      const dayNum = d.getDate();

      let cellClass = 'square-missed';
      let record = state.history[dateStr];

      if (i === 0) {
        const done = state.todayTasks.filter(t => t.done).length;
        const total = state.todayTasks.length;
        if (state.isRestDay) cellClass = 'square-rest';
        else if (done >= total && total > 0) cellClass = 'square-perfect';
        else if (done > 0) cellClass = 'square-partial';
        else cellClass = 'square-missed';
      } else if (record) {
        if (record.status === 'completed') cellClass = 'square-perfect';
        else if (record.status === 'partial') cellClass = 'square-partial';
        else if (record.status === 'rest') cellClass = 'square-rest';
        else cellClass = 'square-missed';
      }

      const cell = document.createElement('div');
      cell.className = `heatmap-square ${cellClass}`;
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

    titleEl.textContent = `Completed tasks for ${dateStr} ${isToday ? '(Today)' : ''}`;
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
      listEl.innerHTML = '<div class="detail-row" style="color: #a5b4fc;">Rest day was active.</div>';
      return;
    }

    if (tasks.length === 0) {
      listEl.innerHTML = '<div class="detail-row" style="color: var(--text-tertiary);">No tasks logged.</div>';
      return;
    }

    tasks.forEach(t => {
      const row = document.createElement('div');
      row.className = `detail-row ${t.done ? 'done-row' : ''}`;
      row.innerHTML = `
        <svg class="icon-svg" style="width:16px;height:16px;" viewBox="0 0 24 24">
          ${t.done ? '<polyline points="20 6 9 17 4 12"></polyline>' : '<circle cx="12" cy="12" r="9"></circle>'}
        </svg>
        <span>${escapeHtml(t.title)}</span>
        <span style="color:var(--text-tertiary); font-size:13px;">(${t.timeOfDay})</span>
      `;
      listEl.appendChild(row);
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
          alert('Routine data restored successfully.');
          document.getElementById('settings-modal').style.display = 'none';
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Could not read backup file.');
      }
    };
    reader.readAsText(file);
  }

  function resetToDefaults() {
    if (confirm('Reset template to original 10-task routine? Streak history will be kept.')) {
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
    // Segmented Control Switcher
    document.querySelectorAll('.seg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter;
        renderTasks();
      });
    });

    // "Up Next" Mark Done Button
    document.getElementById('btn-upnext-done').addEventListener('click', () => {
      if (nextTaskId) {
        toggleTask(nextTaskId);
      }
    });

    // Sound toggle
    const soundBtn = document.getElementById('btn-sound');
    soundBtn.addEventListener('click', () => {
      state.settings.soundEnabled = !state.settings.soundEnabled;
      updateSoundIcon();
      document.getElementById('setting-sound').checked = state.settings.soundEnabled;
      saveState();
      if (state.settings.soundEnabled) playSound('check');
    });

    // Rest Day toggle
    const restBtn = document.getElementById('btn-rest');
    restBtn.addEventListener('click', () => {
      state.isRestDay = !state.isRestDay;
      saveState();
      renderHeroSection();
      renderWeekStrip();
    });

    // Night Mode manual toggle
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

    // Settings Tabs
    document.querySelectorAll('.modal-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal-nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.pane-content').forEach(p => p.style.display = 'none');
        const targetId = `pane-${btn.dataset.modaltab}`;
        document.getElementById(targetId).style.display = 'block';
      });
    });

    // Template Form
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
      renderHeroSection();
    });

    const clockFormatSelect = document.getElementById('setting-clock-format');
    clockFormatSelect.value = state.settings.clock24h ? '24' : '12';
    clockFormatSelect.addEventListener('change', () => {
      state.settings.clock24h = (clockFormatSelect.value === '24');
      saveState();
      updateClock();
      renderTasks();
    });

    const soundCheck = document.getElementById('setting-sound');
    soundCheck.checked = state.settings.soundEnabled;
    soundCheck.addEventListener('change', () => {
      state.settings.soundEnabled = soundCheck.checked;
      updateSoundIcon();
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

    // Backup actions
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

    // Backdrop click
    window.addEventListener('click', (e) => {
      if (e.target === settingsModal) {
        settingsModal.style.display = 'none';
        closeEditTaskForm();
      }
      if (e.target === historyModal) {
        historyModal.style.display = 'none';
      }
    });

    // Wake lock on resume
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
        checkDateAndRollover();
        updateNightMode();
      }
    });

    window.addEventListener('pointerdown', () => {
      initAudio();
      if (!wakeLockSentinel) {
        requestWakeLock();
      }
    }, { once: false });
  }

  function updateSoundIcon() {
    const iconContainer = document.getElementById('icon-sound');
    if (!iconContainer) return;
    if (state.settings.soundEnabled) {
      iconContainer.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      `;
    } else {
      iconContainer.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <line x1="23" y1="9" x2="17" y2="15"></line>
        <line x1="17" y1="9" x2="23" y2="15"></line>
      `;
    }
  }

  // --- SERVICE WORKER ---
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(reg => {
            console.log('SW registered:', reg.scope);
          })
          .catch(err => {
            console.warn('SW register error:', err);
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
    updateSoundIcon();
    updateNightMode();
    renderAll();
    requestWakeLock();
    registerServiceWorker();

    setInterval(updateClock, 1000);
    setInterval(() => {
      checkDateAndRollover();
      updateNightMode();
    }, 5000);
    setInterval(applyPixelShift, 180000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
