export function setupStopwatch() {
  let startTime = 0;
  let elapsedTime = 0;
  let timerInterval = null;
  let isRunning = false;
  let lapCounter = 1;
  let lapTimes = [];

  const timeDisplay = document.getElementById('time-display');
  const startPauseBtn = document.getElementById('start-pause-btn');
  const resetBtn = document.getElementById('reset-btn');
  const lapBtn = document.getElementById('lap-btn');
  const lapList = document.getElementById('lap-list');
  const clearLapsBtn = document.getElementById('clear-laps-btn');

  function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
  }

  function updateDisplay() {
    const currentTime = isRunning ? Date.now() - startTime + elapsedTime : elapsedTime;
    timeDisplay.textContent = formatTime(currentTime);
  }

  function start() {
    startTime = Date.now();
    isRunning = true;
    timerInterval = setInterval(updateDisplay, 10);
    
    startPauseBtn.textContent = 'Pause';
    startPauseBtn.className = 'btn btn-pause';
    lapBtn.disabled = false;
    resetBtn.disabled = false;
  }

  function pause() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    
    elapsedTime += Date.now() - startTime;
    isRunning = false;
    
    startPauseBtn.textContent = 'Resume';
    startPauseBtn.className = 'btn btn-start';
  }

  function reset() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    
    startTime = 0;
    elapsedTime = 0;
    isRunning = false;
    lapCounter = 1;
    
    timeDisplay.textContent = '00:00:00';
    startPauseBtn.textContent = 'Start';
    startPauseBtn.className = 'btn btn-start';
    lapBtn.disabled = true;
    resetBtn.disabled = true;
  }

  function addLap() {
    if (isRunning || elapsedTime > 0) {
      const currentTime = isRunning ? Date.now() - startTime + elapsedTime : elapsedTime;
      const lapTime = formatTime(currentTime);
      
      lapTimes.unshift({
        number: lapCounter,
        time: lapTime,
        ms: currentTime
      });
      
      renderLapTimes();
      lapCounter++;
    }
  }

  function renderLapTimes() {
    if (lapTimes.length === 0) {
      lapList.innerHTML = '<div class="no-laps">No lap times recorded</div>';
      clearLapsBtn.style.display = 'none';
      return;
    }

    clearLapsBtn.style.display = 'block';
    
    // Find fastest and slowest lap times (excluding the first lap)
    let fastestTime = Infinity;
    let slowestTime = -1;
    
    if (lapTimes.length > 1) {
      for (let i = 1; i < lapTimes.length; i++) {
        const lapTime = lapTimes[i - 1].ms - lapTimes[i].ms;
        if (lapTime < fastestTime) fastestTime = lapTime;
        if (lapTime > slowestTime) slowestTime = lapTime;
      }
    }

    lapList.innerHTML = lapTimes.map((lap, index) => {
      let lapTimeMs = 0;
      let className = '';
      
      if (index < lapTimes.length - 1) {
        lapTimeMs = lap.ms - lapTimes[index + 1].ms;
        if (lapTimes.length > 2) {
          if (lapTimeMs === fastestTime) className = 'fastest';
          else if (lapTimeMs === slowestTime) className = 'slowest';
        }
      }
      
      const splitTime = index < lapTimes.length - 1 ? formatTime(lapTimeMs) : lap.time;
      
      return `
        <div class="lap-item ${className}">
          <div class="lap-number">Lap ${lap.number}</div>
          <div class="lap-times">
            <div class="split-time">${splitTime}</div>
            <div class="total-time">${lap.time}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  function clearLaps() {
    lapTimes = [];
    lapCounter = 1;
    renderLapTimes();
  }

  // Event listeners
  startPauseBtn.addEventListener('click', () => {
    if (isRunning) {
      pause();
    } else {
      start();
    }
  });

  resetBtn.addEventListener('click', reset);
  lapBtn.addEventListener('click', addLap);
  clearLapsBtn.addEventListener('click', clearLaps);

  // Initialize
  renderLapTimes();
  resetBtn.disabled = true;
}