import './style.css'
import { setupStopwatch } from './stopwatch.js'

document.querySelector('#app').innerHTML = `
  <div class="stopwatch-container">
    <div class="stopwatch-header">
      <h1>Arsenic</h1>
      <p class="subtitle">Precision Stopwatch</p>
    </div>
    
    <div class="time-display">
      <span id="time-display">00:00:00</span>
    </div>
    
    <div class="controls">
      <button id="start-pause-btn" class="btn btn-start">Start</button>
      <button id="reset-btn" class="btn btn-reset">Reset</button>
      <button id="lap-btn" class="btn btn-lap" disabled>Lap</button>
    </div>
    
    <div class="lap-times">
      <div class="lap-header">
        <h3>Lap Times</h3>
        <button id="clear-laps-btn" class="btn-clear">Clear All</button>
      </div>
      <div id="lap-list" class="lap-list"></div>
    </div>
  </div>
`

setupStopwatch()