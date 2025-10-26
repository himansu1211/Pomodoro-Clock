// --- DOM Elements ---
const timerDisplay = document.getElementById('timer-display');
const startPauseResumeBtn = document.getElementById('start-pause-resume-btn');
const stopBtn = document.getElementById('stop-btn');
const pomodoroBtn = document.getElementById('pomodoro-btn');
const breakBtn = document.getElementById('break-btn');
const pomodoroDurationInput = document.getElementById('pomodoro-duration');
const breakDurationInput = document.getElementById('break-duration');
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const alarmSound = document.getElementById('alarm-sound');

// --- State Variables ---
let currentMode = 'pomodoro'; // 'pomodoro' or 'break'
let isRunning = false;
let isPaused = false;
let totalSeconds; // Total seconds for the current session (e.g., 25 * 60)
let remainingSeconds; // Seconds left
let intervalId = null;

// Initial setup with default values
function initializeTimer() {
    const duration = currentMode === 'pomodoro' 
        ? parseInt(pomodoroDurationInput.value) 
        : parseInt(breakDurationInput.value);
        
    totalSeconds = duration * 60;
    remainingSeconds = totalSeconds;
    updateDisplay();

    // Reset buttons and state
    isRunning = false;
    isPaused = false;
    startPauseResumeBtn.textContent = 'Start';
    clearInterval(intervalId);
    intervalId = null;
}

// --- Display Functions ---
function updateDisplay() {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    timerDisplay.textContent = formattedTime;
    document.title = `${formattedTime} | Pomodoro Clock`;
}

function updateModeButtons(newMode) {
    pomodoroBtn.classList.remove('active');
    breakBtn.classList.remove('active');
    
    if (newMode === 'pomodoro') {
        pomodoroBtn.classList.add('active');
    } else {
        breakBtn.classList.add('active');
    }
}

// --- Timer Logic ---
function startTimer() {
    if (intervalId) return; // Already running

    isRunning = true;
    isPaused = false;
    startPauseResumeBtn.textContent = 'Pause';

    intervalId = setInterval(() => {
        remainingSeconds--;
        updateDisplay();

        if (remainingSeconds < 0) {
            clearInterval(intervalId);
            intervalId = null;
            alarmSound.play();
            
            // Auto-switch mode
            currentMode = currentMode === 'pomodoro' ? 'break' : 'pomodoro';
            updateModeButtons(currentMode);
            initializeTimer();
            // Optional: Start the new session automatically
            // startTimer(); 
        }
    }, 1000);
}

function pauseTimer() {
    if (!isRunning || isPaused) return;

    isPaused = true;
    startPauseResumeBtn.textContent = 'Resume';
    clearInterval(intervalId);
    intervalId = null;
}

function resumeTimer() {
    if (!isRunning || !isPaused) return;
    
    // Resume is just calling startTimer, as intervalId is null
    startTimer();
}

function stopTimer() {
    clearInterval(intervalId);
    intervalId = null;
    initializeTimer(); // Resets timer to initial state
}

// --- Event Handlers ---

// Handle Start/Pause/Resume button
startPauseResumeBtn.addEventListener('click', () => {
    if (isRunning && !isPaused) {
        pauseTimer();
    } else if (isPaused) {
        resumeTimer();
    } else {
        // First time start or after stop
        startTimer();
    }
});

// Handle Stop button
stopBtn.addEventListener('click', stopTimer);

// Handle Mode Switching
function switchMode(mode) {
    if (currentMode === mode) return; // Already in this mode

    currentMode = mode;
    updateModeButtons(mode);
    stopTimer(); // Stop and reset the timer when switching mode
}

pomodoroBtn.addEventListener('click', () => switchMode('pomodoro'));
breakBtn.addEventListener('click', () => switchMode('break'));

// Handle Duration Edits
pomodoroDurationInput.addEventListener('change', () => {
    if (parseInt(pomodoroDurationInput.value) < 1) {
        pomodoroDurationInput.value = 1;
    }
    // Only re-initialize if currently in this mode
    if (currentMode === 'pomodoro' && !isRunning) {
        initializeTimer();
    }
});

breakDurationInput.addEventListener('change', () => {
    if (parseInt(breakDurationInput.value) < 1) {
        breakDurationInput.value = 1;
    }
    // Only re-initialize if currently in this mode
    if (currentMode === 'break' && !isRunning) {
        initializeTimer();
    }
});

// Handle Theme Toggle
themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    themeToggle.innerHTML = newTheme === 'dark' 
        ? '<i class="fas fa-moon"></i> Dark' 
        : '<i class="fas fa-sun"></i> Light';
});

// --- Initial Call ---
initializeTimer();
