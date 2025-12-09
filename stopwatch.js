// stopwatch.js - Stopwatch logic

document.addEventListener('DOMContentLoaded', () => {
    let startTime = 0;
    let elapsedTime = 0;
    let isRunning = false;
    let timerInterval = null;
    let laps = [];

    // DOM Elements
    const stopwatchDisplay = document.getElementById('stopwatch-display');
    const startBtn = document.getElementById('stopwatch-start-btn');
    const pauseBtn = document.getElementById('stopwatch-pause-btn');
    const resetBtn = document.getElementById('stopwatch-reset-btn');
    const lapBtn = document.getElementById('stopwatch-lap-btn');
    const lapsList = document.getElementById('laps-list');

    function formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const ms = Math.floor((milliseconds % 1000) / 10); // 2 decimal places for ms

        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}.${ms < 10 ? '0' : ''}${ms}`;
    }

    function updateDisplay() {
        const currentTime = isRunning ? Date.now() - startTime + elapsedTime : elapsedTime;
        stopwatchDisplay.textContent = formatTime(currentTime);
    }

    function startStopwatch() {
        if (isRunning) return;

        isRunning = true;
        startTime = Date.now();
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        lapBtn.disabled = false;

        timerInterval = setInterval(updateDisplay, 10); // Update every 10ms
    }

    function pauseStopwatch() {
        if (!isRunning) return;

        isRunning = false;
        elapsedTime += Date.now() - startTime;
        clearInterval(timerInterval);
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        lapBtn.disabled = true;
    }

    function resetStopwatch() {
        pauseStopwatch();
        elapsedTime = 0;
        laps = [];
        updateDisplay();
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        lapBtn.disabled = true;
        lapsList.innerHTML = '';
    }

    function recordLap() {
        if (!isRunning) return;

        const currentTime = Date.now() - startTime + elapsedTime;
        laps.push(currentTime);

        const lapItem = document.createElement('li');
        lapItem.className = 'text-sm py-1 border-b border-gray-600';
        lapItem.textContent = `Lap ${laps.length}: ${formatTime(currentTime)}`;
        lapsList.appendChild(lapItem);
    }

    // Event Listeners
    startBtn.addEventListener('click', startStopwatch);
    pauseBtn.addEventListener('click', pauseStopwatch);
    resetBtn.addEventListener('click', resetStopwatch);
    lapBtn.addEventListener('click', recordLap);

    // Initialize
    updateDisplay();
    pauseBtn.disabled = true;
    lapBtn.disabled = true;
});
