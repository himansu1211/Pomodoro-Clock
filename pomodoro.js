// Update button states
function updateButtonStates() {
    if (isRunning && !isPaused) {
        startPauseBtn.textContent = 'Pause';
        pauseBtn.style.display = 'inline-block';
    } else if (isPaused) {
        startPauseBtn.textContent = 'Resume';
        pauseBtn.style.display = 'none';
    } else {
        startPauseBtn.textContent = 'Start';
        pauseBtn.style.display = 'none';
    }
}
