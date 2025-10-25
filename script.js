let workTime = 25 * 60;
let breakTime = 5 * 60;
let remaining = workTime;
let timerInterval = null;
let isPaused = false;

function updateDisplay() {
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  document.getElementById('timer').textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    if (!isPaused && remaining > 0) {
      remaining--;
      updateDisplay();
    } else if (remaining === 0) {
      alert("Time's up! Take a break.");
      stopTimer();
    }
  }, 1000);
}

function pauseResumeTimer() {
  isPaused = !isPaused;
  document.getElementById('pauseBtn').textContent = isPaused ? "Resume" : "Pause";
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  isPaused = false;
  remaining = workTime;
  updateDisplay();
  document.getElementById('pauseBtn').textContent = "Pause";
}

function setBreakTime() {
  const minutes = parseInt(document.getElementById('breakInput').value);
  if (!isNaN(minutes)) {
    breakTime = minutes * 60;
    alert(`Break time set to ${minutes} minutes.`);
  } else {
    alert("Please enter a valid number.");
  }
}

updateDisplay();

