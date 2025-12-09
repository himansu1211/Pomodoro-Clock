// timer.js - Countdown Timer logic

document.addEventListener('DOMContentLoaded', () => {
    let timeLeft = 0;
    let totalTime = 0;
    let isRunning = false;
    let timerInterval = null;

    // DOM Elements
    const countdownDisplay = document.getElementById('countdown-display');
    const minutesInput = document.getElementById('minutes-input');
    const startBtn = document.getElementById('countdown-start-btn');
    const pauseBtn = document.getElementById('countdown-pause-btn');
    const resetBtn = document.getElementById('countdown-reset-btn');

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    function updateDisplay() {
        countdownDisplay.textContent = formatTime(timeLeft);
    }

    function startTimer() {
        const minutes = parseInt(minutesInput.value);
        if (isNaN(minutes) || minutes < 0 || minutes > 999) {
            alert('Please enter a valid number of minutes (0-999)');
            return;
        }

        if (!isRunning) {
            if (timeLeft === 0) {
                timeLeft = minutes * 60;
                totalTime = timeLeft;
            }
        }

        if (timeLeft === 0) {
            alert('Please enter a valid time greater than 0');
            return;
        }

        isRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;

        // Ensure Tone is started on user interaction
        if (window.sharedFunctions && window.sharedFunctions.soundEnabled) {
            Tone.start();
        }

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
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }

    function resetTimer() {
        pauseTimer();
        timeLeft = 0;
        totalTime = 0;
        updateDisplay();
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        minutesInput.value = '';
    }

    function handleTimerEnd() {
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        playRingtone('bell');
        alert('Timer finished!');
    }

    function playRingtone(ringtone) {
        if (!window.sharedFunctions || !window.sharedFunctions.soundEnabled) return;

        // Ensure Tone is started on user interaction
        Tone.start();

        const now = Tone.now();
        switch (ringtone) {
            case 'beep':
                const synth = new Tone.Synth().toDestination();
                synth.triggerAttackRelease("C4", "8n", now);
                synth.triggerAttackRelease("E4", "8n", now + 0.2);
                synth.triggerAttackRelease("G4", "8n", now + 0.4);
                break;
            case 'chime':
                const chimeSynth = new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'sine' } }).toDestination();
                chimeSynth.triggerAttackRelease(["C5", "G4"], "4n", now);
                break;
            case 'bell':
                const bellSynth = new Tone.MembraneSynth().toDestination();
                bellSynth.triggerAttackRelease("F4", "4n", now);
                break;
            case 'melody':
                const melodySynth = new Tone.AMSynth().toDestination();
                melodySynth.triggerAttackRelease("A4", "8n", now);
                melodySynth.triggerAttackRelease("F4", "8n", now + 0.2);
                melodySynth.triggerAttackRelease("D4", "4n", now + 0.4);
                break;
        }
    }

    // Event Listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);

    // Initial setup
    updateDisplay();
    pauseBtn.disabled = true;
});
