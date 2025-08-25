const eventTimeInput = document.getElementById('eventTime');
const eventNameInput = document.getElementById('eventName');
const customSoundInput = document.getElementById('customSound');
const startBtn = document.getElementById('startBtn');
const eventList = document.getElementById('eventList');
const alarm = document.getElementById('alarm');

// Request notification permission
if ("Notification" in window) {
  Notification.requestPermission();
}

// Play alarm
function playAlarm() {
  alarm.currentTime = 0;
  alarm.play().catch(() => console.log("Audio blocked"));
}

// Show notification
function showNotification(title, body) {
  if (Notification.permission === "granted") {
    new Notification(title, { body: body });
  }
}

startBtn.addEventListener('click', () => {
  const eventName = eventNameInput.value.trim();
  const eventTime = new Date(eventTimeInput.value);

  if (!eventName || isNaN(eventTime.getTime())) {
    alert("Please enter valid name and time");
    return;
  }

  // Custom sound
  if (customSoundInput.files[0]) {
    alarm.src = URL.createObjectURL(customSoundInput.files[0]);
  }

  addEvent(eventName, eventTime);

  eventNameInput.value = '';
  eventTimeInput.value = '';
  customSoundInput.value = '';
});

function addEvent(name, time) {
  const box = document.createElement('div');
  box.className = 'countdown-box';

  const title = document.createElement('h3');
  title.textContent = name;

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'deleteBtn';
  deleteBtn.textContent = 'Delete';
  deleteBtn.onclick = () => box.remove();
  title.appendChild(deleteBtn);
  box.appendChild(title);

  const countdownDiv = document.createElement('div');
  countdownDiv.className = 'countdown';
  countdownDiv.innerHTML = `
    <div><span class="days">00</span><br>Days</div>
    <div><span class="hours">00</span><br>Hours</div>
    <div><span class="minutes">00</span><br>Minutes</div>
    <div><span class="seconds">00</span><br>Seconds</div>
  `;
  box.appendChild(countdownDiv);
  eventList.appendChild(box);

  const interval = setInterval(() => {
    const now = new Date();
    const diff = time - now;

    if (diff <= 0) {
      clearInterval(interval);
      countdownDiv.innerHTML = `<div style="text-align:center; width:100%;">Event Started!</div>`;
      playAlarm();
      showNotification("Event Started!", name);
      return;
    }

    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff / (1000*60*60)) % 24);
    const minutes = Math.floor((diff / (1000*60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    countdownDiv.querySelector('.days').textContent = String(days).padStart(2,'0');
    countdownDiv.querySelector('.hours').textContent = String(hours).padStart(2,'0');
    countdownDiv.querySelector('.minutes').textContent = String(minutes).padStart(2,'0');
    countdownDiv.querySelector('.seconds').textContent = String(seconds).padStart(2,'0');
  }, 1000);
}
