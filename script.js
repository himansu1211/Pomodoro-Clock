// --- Pomodoro Timer Script ---

// Import Tone.js library
// Assuming Tone.js is included in the HTML via a <script> tag
// <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.min.js"></script>

// --- Timer Configuration (in seconds) ---
const POMODORO_DURATION = 25 * 60;
const SHORT_BREAK_DURATION = 5 * 60;
const LONG_BREAK_DURATION = 15 * 60;
const DEFAULT_COLOR_RGB = '79, 70, 229'; 

let totalSeconds = POMODORO_DURATION;
let secondsRemaining = totalSeconds;
let timerInterval = null;
let isRunning = false;
let currentMode = 'pomodoro';
let isDayMode = false;
let soundEnabled = true;

const timerDisplay = document.getElementById('timer-display');
const startPauseBtn = document.getElementById('start-pause-btn');
const resetBtn = document.getElementById('reset-btn');
const statusMessage = document.getElementById('status-message');
const progressFill = document.getElementById('progress-fill');
const modeButtons = {
    pomodoro: document.getElementById('pomodoro-btn'),
    shortBreak: document.getElementById('short-break-btn'),
    longBreak: document.getElementById('long-break-btn')
};
const themeToggle = document.getElementById('theme-toggle');
const moonIcon = document.getElementById('moon-icon');
const sunIcon = document.getElementById('sun-icon');
const colorPicker = document.getElementById('color-picker');
const bgColorPicker = document.getElementById('bg-color-picker');
const soundToggle = document.getElementById('sound-toggle');

// --- Audio Setup (Tone.js) ---
// Create synths for different ringtones
const synth = new Tone.Synth().toDestination();
const chimeSynth = new Tone.MetalSynth().toDestination();
const bellSynth = new Tone.FMSynth().toDestination();
const melodySynth = new Tone.PolySynth().toDestination();

const playRingtone = (ringtone) => {
    if (!soundEnabled) return;
    // Check if audio context is running (required for some browsers)
    if (Tone.context.state !== 'running') {
        Tone.start();
    }
    switch (ringtone) {
        case 'beep':
            // Play a simple beep sequence
            synth.triggerAttackRelease('C4', '8n');
            setTimeout(() => synth.triggerAttackRelease('C4', '8n'), 200);
            setTimeout(() => synth.triggerAttackRelease('C4', '8n'), 400);
            break;
        case 'chime':
            chimeSynth.triggerAttackRelease('C5', '4n');
            setTimeout(() => chimeSynth.triggerAttackRelease('E5', '4n'), 250);
            setTimeout(() => chimeSynth.triggerAttackRelease('G5', '4n'), 500);
            break;
        case 'bell':
            bellSynth.triggerAttackRelease('C4', '2n');
            break;
        case 'melody':
            melodySynth.triggerAttackRelease(['C4', 'E4', 'G4'], '4n');
            setTimeout(() => melodySynth.triggerAttackRelease(['D4', 'F#4', 'A4'], '4n'), 250);
            setTimeout(() => melodySynth.triggerAttackRelease(['E4', 'G#4', 'B4'], '4n'), 500);
            break;
    }
};

const alarmSound = () => playRingtone('beep'); // Default for timer

function updateDisplay() {
    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    timerDisplay.textContent = formattedTime;
    document.title = `${formattedTime} | Pomodoro`;

    const progress = ((totalSeconds - secondsRemaining) / totalSeconds) * 100;
    progressFill.style.width = `${progress}%`;
}

function startTimer() {
    if (isRunning) return;

    isRunning = true;
    startPauseBtn.textContent = 'Pause';
    statusMessage.classList.remove('opacity-100');
    statusMessage.classList.add('opacity-0');

    timerInterval = setInterval(() => {
        secondsRemaining--;
        updateDisplay();

        if (secondsRemaining <= 0) {
            clearInterval(timerInterval);
            isRunning = false;
            handleTimerEnd();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    startPauseBtn.textContent = 'Start';
}

function handleTimerEnd() {
    startPauseBtn.textContent = 'Start';
    alarmSound();

    if (currentMode === 'pomodoro') {
        statusMessage.textContent = "Time's Up! Take a break.";
        statusMessage.style.color = `rgb(${DEFAULT_COLOR_RGB})`;
    } else {
        statusMessage.textContent = "Break Over! Back to work.";
        statusMessage.style.color = 'red';
    }
    statusMessage.classList.remove('opacity-0');
    statusMessage.classList.add('opacity-100');

    if (currentMode === 'pomodoro') {
        setMode('shortBreak');
    } else {
        setMode('pomodoro');
    }
}

function resetTimer() {
    pauseTimer();
    setMode(currentMode, true); 

    statusMessage.classList.remove('opacity-100');
    statusMessage.classList.add('opacity-0');
}
/**
 * Sets the timer mode and updates the display.
 *                                                                                                      
   @param {string} mode - 'pomodoro', 'shortBreak', or 'longBreak'
 * @param {boolean} [keepRunningState=false] - If true, only reset time, not the selected button state.
 */
function setMode(mode, keepRunningState = false) {
    pauseTimer();

    // Determine new duration
    let duration;
    if (mode === 'pomodoro') {
        duration = POMODORO_DURATION;
    } else if (mode === 'shortBreak') {
        duration = SHORT_BREAK_DURATION;
    } else if (mode === 'longBreak') {
        duration = LONG_BREAK_DURATION;
    } else {
        return; // Invalid mode
    }

    totalSeconds = duration;
    secondsRemaining = duration;
    currentMode = mode;

    updateDisplay();

    // Update mode buttons' active state
    if (!keepRunningState) {
        Object.values(modeButtons).forEach(btn => btn.classList.remove('active'));
        modeButtons[mode].classList.add('active');
    }
}

/**
 * Toggles between Day (light) and Night (dark) themes.
 */
function toggleTheme() {
    isDayMode = !isDayMode;
    document.body.classList.toggle('day-mode', isDayMode);

    // Update icons visibility
    moonIcon.classList.toggle('hidden', isDayMode);
    sunIcon.classList.toggle('hidden', !isDayMode);
}

/**
 * Updates the primary accent color globally.
 * @param {string} hex - New color in hexadecimal format.
 */
function updatePrimaryColor(hex) {
    // Convert Hex to RGB format (e.g., "79 70 229")
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const rgbString = `${r} ${g} ${b}`;

    document.documentElement.style.setProperty('--primary-color', rgbString);
}

/**
 * Updates the custom background color.
 * @param {string} hex - New background color in hexadecimal format.
 */
function updateBackgroundColor(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const rgbString = `${r} ${g} ${b}`;

    document.documentElement.style.setProperty('--bg-main', rgbString);
    document.documentElement.style.setProperty('--custom-bg', rgbString);
}

/**
 * Toggles sound on/off.
 */
function toggleSound() {
    soundEnabled = !soundEnabled;
    const icon = soundToggle.querySelector('svg');
    if (soundEnabled) {
        icon.classList.remove('text-red-400');
        icon.classList.add('text-green-400');
    } else {
        icon.classList.remove('text-green-400');
        icon.classList.add('text-red-400');
    }
}

// --- Event Listeners ---

// Start/Pause Button
startPauseBtn.addEventListener('click', () => {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
});

// Reset Button
resetBtn.addEventListener('click', resetTimer);

// Mode Buttons
modeButtons.pomodoro.addEventListener('click', () => setMode('pomodoro'));
modeButtons.shortBreak.addEventListener('click', () => setMode('shortBreak'));
modeButtons.longBreak.addEventListener('click', () => setMode('longBreak'));

// Theme Toggle
themeToggle.addEventListener('click', toggleTheme);

// Color Picker
colorPicker.addEventListener('input', (event) => {
    updatePrimaryColor(event.target.value);
});

// Background Color Picker
bgColorPicker.addEventListener('input', (event) => {
    updateBackgroundColor(event.target.value);
});

// Sound Toggle
soundToggle.addEventListener('click', toggleSound);

// --- World Clock and Alarm Variables ---
let selectedTimezone = 'America/New_York';
let alarmTime = null;
let alarmRingtone = 'beep';
let alarmInterval = null;

// --- DOM Elements for World Clock and Alarm ---
const timezoneSelect = document.getElementById('timezone-select');
const worldTimeDisplay = document.getElementById('world-time');
const alarmTimeInput = document.getElementById('alarm-time');
const ringtoneSelect = document.getElementById('ringtone-select');
const setAlarmBtn = document.getElementById('set-alarm-btn');
const alarmStatus = document.getElementById('alarm-status');

/**
 * Updates the world clock display based on selected timezone.
 */
function updateWorldClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        timeZone: selectedTimezone,
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    worldTimeDisplay.textContent = timeString;
}

/**
 * Checks if the current time matches the alarm time.
 */
function checkAlarm() {
    if (!alarmTime) return;

    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', {
        timeZone: selectedTimezone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
    });

    if (currentTime === alarmTime) {
        playRingtone(alarmRingtone);
        alarmStatus.textContent = 'Alarm ringing!';
        setTimeout(() => {
            alarmStatus.textContent = '';
        }, 5000);
        // Clear alarm after ringing
        clearAlarm();
    }
}

/**
 * Sets the alarm based on user input.
 */
function setAlarm() {
    const timeValue = alarmTimeInput.value;
    if (!timeValue) {
        alarmStatus.textContent = 'Please select a time.';
        return;
    }

    alarmTime = timeValue;
    alarmRingtone = ringtoneSelect.value;
    alarmStatus.textContent = `Alarm set for ${alarmTime} with ${alarmRingtone} ringtone.`;

    // Start checking alarm every second
    if (alarmInterval) clearInterval(alarmInterval);
    alarmInterval = setInterval(checkAlarm, 1000);
}

/**
 * Clears the current alarm.
 */
function clearAlarm() {
    alarmTime = null;
    if (alarmInterval) {
        clearInterval(alarmInterval);
        alarmInterval = null;
    }
    alarmStatus.textContent = '';
}

// --- Event Listeners for World Clock and Alarm ---

// Timezone Select
timezoneSelect.addEventListener('change', (event) => {
    selectedTimezone = event.target.value;
    updateWorldClock();
});

// Set Alarm Button
setAlarmBtn.addEventListener('click', setAlarm);

// --- Initialization ---
window.onload = () => {
    updateDisplay();
    // Update colors on load based on default picker values
    updatePrimaryColor(colorPicker.value);
    updateBackgroundColor(bgColorPicker.value);

    // Initialize world clock
    updateWorldClock();
    setInterval(updateWorldClock, 1000); // Update every second
};
