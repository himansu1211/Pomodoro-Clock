let timer;
let timeLeft = 25 * 60; // 25 minutes in seconds
let isRunning = false;
let isWork = true;
let pomodoroCount = 0;
let sessionCount = 0;

const timerDisplay = document.getElementById('timer');
const sessionDisplay = document.getElementById('session');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const pomodoroCountDisplay = document.getElementById('pomodoro-count');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    sessionDisplay.textContent = isWork ? 'Work' : 'Break';
    pomodoroCountDisplay.textContent = `Pomodoros: ${pomodoroCount}`;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timer = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft <= 0) {
                clearInterval(timer);
                isRunning = false;
                if (isWork) {
                    pomodoroCount++;
                    sessionCount++;
                    if (sessionCount % 4 === 0) {
                        timeLeft = 25 * 60; // Long break 25 minutes
                        isWork = false;
                    } else {
                        timeLeft = 5 * 60; // Short break 5 minutes
                        isWork = false;
                    }
                } else {
                    timeLeft = 25 * 60; // Back to work
                    isWork = true;
                }
                updateDisplay();
                alert(isWork ? 'Time to work!' : 'Time for a break!');
            }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    timeLeft = 25 * 60;
    isWork = true;
    sessionCount = 0;
    updateDisplay();
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

updateDisplay();
