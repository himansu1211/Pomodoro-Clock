document.addEventListener('DOMContentLoaded', () => {
    // --- 1. CONFIGURATION AND STATE ---
    const TIME_MODES = {
        'pomodoro': 25 * 60,
        'short-break': 5 * 60,
        'long-break': 15 * 60
    };

    let currentMode = 'pomodoro';
    let timeLeft = TIME_MODES[currentMode];
    let totalTime = timeLeft;
    let isRunning = false;
    let timerInterval = null;
    let soundEnabled = true;
    let alarmTime = null;
    let alarmInterval = null;

    // Initialize Tone.js Synth for simple sound alerts
    const synth = new Tone.Synth().toDestination();
    const bellSynth = new Tone.MembraneSynth().toDestination();
    const chimeSynth = new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'sine' } }).toDestination();
    const melodySynth = new Tone.AMSynth().toDestination();

    // --- 2. DOM ELEMENTS ---
    const timerDisplay = document.getElementById('timer-display');
    const startPauseBtn = document.getElementById('start-pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const statusMessage = document.getElementById('status-message');
    const progressFill = document.getElementById('progress-fill');
    const modeBtns = document.querySelectorAll('.mode-btn');

    const themeToggle = document.getElementById('theme-toggle');
    const moonIcon = document.getElementById('moon-icon');
    const sunIcon = document.getElementById('sun-icon');
    const soundToggle = document.getElementById('sound-toggle');
    const colorPicker = document.getElementById('color-picker');
    const bgColorPicker = document.getElementById('bg-color-picker');

    const worldTimeDisplay = document.getElementById('world-time');
    const timezoneSelect = document.getElementById('timezone-select');
    const alarmTimeInput = document.getElementById('alarm-time');
    const setAlarmBtn = document.getElementById('set-alarm-btn');
    const alarmStatus = document.getElementById('alarm-status');
    const ringtoneSelect = document.getElementById('ringtone-select');

    // --- 3. TIMER FUNCTIONS ---

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    function updateDisplay() {
        timerDisplay.textContent = formatTime(timeLeft);

        // Update progress bar
        const progress = ((totalTime - timeLeft) / totalTime) * 100;
        progressFill.style.width = `${100 - progress}%`;
    }

    function startTimer() {
        if (isRunning) return;

        // Ensure Tone is started on user interaction
        Tone.start();

        isRunning = true;
        startPauseBtn.textContent = 'Pause';
        statusMessage.classList.remove('opacity-100');
        statusMessage.classList.add('opacity-0');

        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timerInterval);
                handleTimerEnd();
            }
        }, 1000);
    }

    function pauseTimer() {
        if (!isRunning) return;

        isRunning = false;
        clearInterval(timerInterval);
        startPauseBtn.textContent = 'Start';
    }

    function resetTimer() {
        pauseTimer();
        timeLeft = TIME_MODES[currentMode];
        totalTime = timeLeft;
        updateDisplay();
        statusMessage.classList.remove('opacity-100');
        statusMessage.classList.add('opacity-0');
    }

    function handleTimerEnd() {
        isRunning = false;
        startPauseBtn.textContent = 'Start';
        statusMessage.textContent = "Time's Up! Take a break.";
        statusMessage.classList.remove('opacity-0');
        statusMessage.classList.add('opacity-100');
        
        playRingtone('bell'); // Default sound for Pomodoro end

        // Auto-switch modes (optional feature)
        // const nextMode = currentMode === 'pomodoro' ? 'short-break' : 'pomodoro';
        // switchMode(nextMode);
    }

    function switchMode(newMode) {
        if (currentMode === newMode) return;
        
        pauseTimer();
        currentMode = newMode;
        timeLeft = TIME_MODES[newMode];
        totalTime = timeLeft;
        updateDisplay();
        statusMessage.classList.remove('opacity-100');
        statusMessage.classList.add('opacity-0');

        // Update active button
        modeBtns.forEach(btn => btn.classList.remove('active'));
        document.getElementById(`${newMode}-btn`).classList.add('active');
    }

    // --- 4. THEME & COLOR FUNCTIONS ---

    function hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `${r} ${g} ${b}`;
    }

    function updatePrimaryColor(hex) {
        const root = document.documentElement;
        const rgb = hexToRgb(hex);
        root.style.setProperty('--primary-color', rgb);
    }

    function updateBackgroundColor(hex) {
        const root = document.documentElement;
        const rgb = hexToRgb(hex);
        root.style.setProperty('--custom-bg', rgb);
        document.body.style.backgroundColor = `rgb(${rgb})`;
    }
    
    function toggleTheme() {
        document.body.classList.toggle('day-mode');
        const isDayMode = document.body.classList.contains('day-mode');
        if (isDayMode) {
            moonIcon.classList.add('hidden');
            sunIcon.classList.remove('hidden');
            bgColorPicker.value = '#FFFFFF'; // Set picker value for light mode
        } else {
            moonIcon.classList.remove('hidden');
            sunIcon.classList.add('hidden');
            bgColorPicker.value = '#0a0a19'; // Set picker value for dark mode
        }
        // Reset background color to the theme's default on toggle
        updateBackgroundColor(bgColorPicker.value); 
    }
    
    // --- 5. AUDIO FUNCTIONS ---
    
    function playRingtone(ringtone) {
        if (!soundEnabled) return;
        
        // Ensure Tone is started on user interaction
        Tone.start();

        const now = Tone.now();
        switch (ringtone) {
            case 'beep':
                synth.triggerAttackRelease("C4", "8n", now);
                synth.triggerAttackRelease("E4", "8n", now + 0.2);
                synth.triggerAttackRelease("G4", "8n", now + 0.4);
                break;
            case 'chime':
                chimeSynth.triggerAttackRelease(["C5", "G4"], "4n", now);
                break;
            case 'bell':
                bellSynth.triggerAttackRelease("F4", "4n", now);
                break;
            case 'melody':
                melodySynth.triggerAttackRelease("A4", "8n", now);
                melodySynth.triggerAttackRelease("F4", "8n", now + 0.2);
                melodySynth.triggerAttackRelease("D4", "4n", now + 0.4);
                break;
        }
    }

    function toggleSound() {
        soundEnabled = !soundEnabled;
        const svg = soundToggle.querySelector('svg');
        if (soundEnabled) {
            svg.classList.add('text-green-400');
            svg.classList.remove('text-red-400');
            svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 2L10 6H6a2 2 0 00-2 2v4a2 2 0 002 2h4l2 4V2z" />'; // Speaker on
        } else {
            svg.classList.remove('text-green-400');
            svg.classList.add('text-red-400');
            svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 7.5L9.75 14.25M9.75 7.5l6.75 6.75M12 2L10 6H6a2 2 0 00-2 2v4a2 2 0 002 2h4l2 4V2z" />'; // Speaker off with cross
        }
    }
    
    // --- 6. WORLD CLOCK & ALARM FUNCTIONS ---
    
    function updateWorldTime() {
        const timezone = timezoneSelect.value;
        const now = new Date();
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: timezone,
            hour12: true
        };
        const timeString = now.toLocaleTimeString('en-US', options);
        worldTimeDisplay.textContent = `${timezone.split('/')[1].replace('_', ' ')}: ${timeString}`;
    }

    function checkAlarm() {
        if (!alarmTime) return;

        const now = new Date();
        const alarmDate = new Date();
        
        // Parse HH:MM from alarmTime (e.g., "14:30")
        const [alarmHour, alarmMinute] = alarmTime.split(':').map(Number);
        
        alarmDate.setHours(alarmHour, alarmMinute, 0, 0);

        // Check if the alarm time is within the current minute
        if (
            now.getHours() === alarmDate.getHours() &&
            now.getMinutes() === alarmDate.getMinutes() &&
            now.getSeconds() === 0 // Check precisely at the minute mark
        ) {
            handleAlarmTrigger();
        }
    }

    function handleAlarmTrigger() {
        const ringtone = ringtoneSelect.value;
        playRingtone(ringtone);
        alarmStatus.textContent = `🚨 Alarm Triggered at ${alarmTime}!`;
        
        // Optional: clear alarm after trigger
        // alarmTime = null;
        // alarmStatus.textContent = 'Alarm triggered and deactivated. Set a new one.';
    }

    function setAlarm() {
        const timeValue = alarmTimeInput.value;
        if (!timeValue) {
            alarmStatus.textContent = 'Please set a valid time.';
            return;
        }

        alarmTime = timeValue;
        const now = new Date();
        
        // Check if the alarm time is in the past for today
        const [alarmHour, alarmMinute] = timeValue.split(':').map(Number);
        const alarmHourNow = now.getHours();
        const alarmMinuteNow = now.getMinutes();

        if (alarmHour < alarmHourNow || (alarmHour === alarmHourNow && alarmMinute <= alarmMinuteNow)) {
            alarmStatus.textContent = `Alarm set for tomorrow at ${timeValue}.`;
        } else {
            alarmStatus.textContent = `Alarm set for today at ${timeValue}.`;
        }
    }


    // --- 7. EVENT LISTENERS & INITIALIZATION ---

    startPauseBtn.addEventListener('click', () => isRunning ? pauseTimer() : startTimer());
    resetBtn.addEventListener('click', resetTimer);

    modeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const mode = e.target.id.replace('-btn', '');
            switchMode(mode);
        });
    });

    themeToggle.addEventListener('click', toggleTheme);
    soundToggle.addEventListener('click', toggleSound);

    // Color Pickers
    colorPicker.addEventListener('input', (e) => updatePrimaryColor(e.target.value));
    bgColorPicker.addEventListener('input', (e) => updateBackgroundColor(e.target.value));

    // World Clock & Alarm Listeners
    timezoneSelect.addEventListener('change', updateWorldTime);
    setAlarmBtn.addEventListener('click', setAlarm);


    // Initial setup
    function initialize() {
        updateDisplay();
        updateWorldTime(); // Initial world clock display
        
        // Main loop for world clock and alarm check (runs every second)
        setInterval(() => {
            updateWorldTime();
            checkAlarm();
        }, 1000);

        // Initialize custom colors based on CSS defaults
        updatePrimaryColor(colorPicker.value);
        updateBackgroundColor(bgColorPicker.value);
        
        // Initialize sound toggle state
        toggleSound(); 
        toggleSound(); // Call twice to set correct icon initially
    }

    initialize();
});