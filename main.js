const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const calendarList = document.getElementById('calendar');
const workoutTitle = document.getElementById('workoutTitle');
const logDateInput = document.getElementById('logDate');
const contentDiv = document.getElementById('content');
const progressStatsDiv = document.getElementById('progressStats');
const workoutHistory = document.getElementById('workoutHistory');
const timerDisplay = document.getElementById('timerDisplay');
const startTimerBtn = document.getElementById('startTimer');
const pauseTimerBtn = document.getElementById('pauseTimer');
const resetTimerBtn = document.getElementById('resetTimer');

let workouts = isBrowser ? JSON.parse(localStorage.getItem('workouts')) || [] : [];
let currentWorkout = '';
let timerInterval = null;
let timerSeconds = 0;
let isTimerRunning = false;

const workoutPlans = {
  push: [
    { name: "Incline Machine Press", sets: 3, reps: "8–10", category: "Push" },
    { name: "Seated Cable Chest Fly", sets: 3, reps: "10–12", category: "Push" },
    { name: "Machine Shoulder Press", sets: 3, reps: "8–10", category: "Push" },
    { name: "Dumbbell Lateral Raises", sets: 3, reps: "12–15", category: "Push" },
    { name: "Overhead Rope Triceps Extension", sets: 3, reps: "12–15", category: "Push" },
    { name: "Close-Grip Machine Press", sets: 2, reps: "8–12", category: "Push" }
  ],
  pull: [
    { name: "Lat Pulldown (Wide Neutral Grip)", sets: 3, reps: "10", category: "Pull" },
    { name: "Seated Row (Close Grip)", sets: 3, reps: "10", category: "Pull" },
    { name: "Rear Delt Cable Fly", sets: 3, reps: "12–15", category: "Pull" },
    { name: "Dumbbell Hammer Curls", sets: 3, reps: "10–12", category: "Pull" },
    { name: "Preacher Curl Machine", sets: 3, reps: "10–12", category: "Pull" },
    { name: "Face Pulls (Optional)", sets: 2, reps: "15", category: "Pull" }
  ],
  legs: [
    { name: "Goblet Squat", sets: 3, reps: "10–12", category: "Legs" },
    { name: "Dumbbell Romanian Deadlifts", sets: 3, reps: "10", category: "Legs" },
    { name: "Seated Calf Raise Machine", sets: 3, reps: "12–15", category: "Legs" },
    { name: "Dumbbell Lateral Raises", sets: 3, reps: "15", category: "Shoulders" },
    { name: "Cable Lateral Raise", sets: 2, reps: "12", category: "Shoulders" },
    { name: "Dumbbell Front Raise", sets: 2, reps: "10–12", category: "Shoulders" }
  ],
  arms: [
    { name: "Dumbbell Bicep Curl", sets: 3, reps: "10", category: "Arms" },
    { name: "Rope Triceps Pushdown", sets: 3, reps: "12–15", category: "Arms" },
    { name: "Incline Dumbbell Fly", sets: 3, reps: "12", category: "Chest" },
    { name: "Concentration Curl", sets: 3, reps: "10", category: "Arms" },
    { name: "Dumbbell Overhead Triceps Extension", sets: 2, reps: "10–12", category: "Arms" },
    { name: "Cable Chest Crossover", sets: 2, reps: "15", category: "Chest" }
  ],
  pushB: [
    { name: "Machine Chest Press (Flat)", sets: 3, reps: "10–12", category: "Push" },
    { name: "Incline Cable Fly (Low to High)", sets: 3, reps: "12", category: "Push" },
    { name: "Arnold Press (Dumbbells)", sets: 3, reps: "8–10", category: "Push" },
    { name: "Cable Lateral Raises", sets: 3, reps: "12–15", category: "Push" },
    { name: "Overhead Dumbbell Triceps Extension (Seated)", sets: 3, reps: "10–12", category: "Push" },
    { name: "Triceps Rope Pushdown (Paused at Bottom)", sets: 2, reps: "12–15", category: "Push" }
  ],
  pullB: [
    { name: "Neutral-Grip Lat Pulldown", sets: 3, reps: "10", category: "Pull" },
    { name: "Cable Face Pulls (High + Out)", sets: 3, reps: "12–15", category: "Pull" },
    { name: "Straight Arm Cable Pulldown", sets: 3, reps: "10–12", category: "Pull" },
    { name: "EZ Bar Curl (Preloaded or Cable)", sets: 3, reps: "10", category: "Pull" },
    { name: "Incline Dumbbell Curls", sets: 2, reps: "10–12", category: "Pull" },
    { name: "Reverse Curl (EZ Bar or Dumbbells)", sets: 2, reps: "12", category: "Pull" }
  ],
  legsB: [
    { name: "Leg Press (Feet Medium Width)", sets: 3, reps: "12–15", category: "Legs" },
    { name: "Walking Lunges (Dumbbells)", sets: 3, reps: "10 steps each leg", category: "Legs" },
    { name: "Hamstring Curl Machine", sets: 3, reps: "12", category: "Legs" },
    { name: "Dumbbell Lateral Raise", sets: 3, reps: "15", category: "Shoulders" },
    { name: "Rear Delt Dumbbell Fly (Chest Supported)", sets: 3, reps: "12–15", category: "Shoulders" },
    { name: "Upright Row (EZ Bar or Dumbbells)", sets: 2, reps: "12", category: "Shoulders" }
  ],
  armsB: [
    { name: "Machine Chest Fly (Mid Position)", sets: 3, reps: "12–15", category: "Chest" },
    { name: "Barbell or Cable Curl (Strict Form)", sets: 3, reps: "10", category: "Arms" },
    { name: "Skull Crushers (EZ Bar or Machine)", sets: 3, reps: "10–12", category: "Arms" },
    { name: "Cable Rope Hammer Curl", sets: 3, reps: "12", category: "Arms" },
    { name: "Overhead Rope Triceps Extension", sets: 3, reps: "12", category: "Arms" },
    { name: "Pec Deck (Finisher)", sets: 2, reps: "15–20", category: "Chest" }
  ]
};

const weeklySchedule = {
  A: ['Rest', 'Rest', 'push', 'pull', 'Rest', 'legs', 'arms'],
  B: ['Rest', 'Rest', 'pushB', 'pullB', 'Rest', 'legsB', 'armsB']
};

if (isBrowser) {
  document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const pastDaysOfYear = (today - startOfYear + 86400000) / 86400000;
    const currentWeekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
    const currentWeekType = currentWeekNumber % 2 === 0 ? 'B' : 'A';
    logDateInput.value = today.toISOString().split('T')[0];
    const todayIndex = today.getDay();
    const todayWorkout = weeklySchedule[currentWeekType][todayIndex];
    loadWorkout(todayWorkout === 'Rest' ? weeklySchedule[currentWeekType][2] : todayWorkout);
    renderCalendar();
    renderProgressStats();
    renderHistory();
  });
}

function renderCalendar() {
  if (!isBrowser || !calendarList) return;
  calendarList.innerHTML = '';
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const currentWeekNumber = Math.ceil(((today - new Date(today.getFullYear(), 0, 1) + 86400000) / 86400000 + new Date(today.getFullYear(), 0, 1).getDay() + 1) / 7);
  const currentWeekType = currentWeekNumber % 2 === 0 ? 'B' : 'A';
  const schedule = weeklySchedule[currentWeekType];

  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    const dayName = day.toLocaleDateString('en-US', { weekday: 'long' });
    const workout = schedule[i];
    const isToday = day.toDateString() === today.toDateString();
    const displayWorkout = workout === 'Rest' ? 'Rest' : (workout.includes('B') ? workout.replace('B', ' B').toUpperCase() : workout.toUpperCase() + ' A');
    const li = document.createElement('li');
    li.className = isToday ? 'font-bold text-blue-600' : '';
    li.textContent = `${dayName}: ${displayWorkout}`;
    calendarList.appendChild(li);
  }
}

function loadWorkout(type) {
  if (!isBrowser || !contentDiv || !workoutTitle) return;
  currentWorkout = type;
  const date = logDateInput?.value || new Date().toISOString().split('T')[0];
  workoutTitle.textContent = type.toUpperCase() + (type.includes('B') ? ' (Week 2)' : ' (Week 1)');
  const exercises = workoutPlans[type];
  if (!exercises) {
    contentDiv.innerHTML = `<p class="text-center text-red-500">Workout "${type}" not found.</p>`;
    return;
  }

  contentDiv.innerHTML = exercises.map((ex, index) => {
    const inputId = `${type}-${index}`;
    const logKey = `${inputId}-${date}`;
    const savedValue = isBrowser ? JSON.parse(localStorage.getItem(logKey)) || [] : [];
    const prevDates = isBrowser ? Object.keys(localStorage)
      .filter(k => k.startsWith(inputId + '-') && k !== logKey)
      .sort().reverse() : [];
    const lastLogKey = prevDates[0];
    const lastValue = lastLogKey && isBrowser ? JSON.parse(localStorage.getItem(lastLogKey)) || [] : [];
    const lastDisplay = lastValue.length ? lastValue.map(s => `${s.weight}x${s.reps}`).join(', ') : '—';
    const maxSets = ex.sets || 3; // Default to 3 sets if not specified
    let setInputs = '';
    for (let i = 0; i < maxSets; i++) {
      const weight = savedValue[i]?.weight || '';
      const reps = savedValue[i]?.reps || '';
      setInputs += `
        <div class="flex space-x-4">
          <div class="flex-1">
            <label for="${inputId}-weight-${i}" class="block text-gray-700">Set ${i + 1} Weight (lbs):</label>
            <input id="${inputId}-weight-${i}" type="number" value="${weight}" class="w-full p-2 border rounded" min="0" placeholder="e.g. 50" aria-label="Weight for set ${i + 1}" oninput="saveSets('${logKey}', '${inputId}', ${maxSets}); updateLastDisplay('${inputId}', '${lastLogKey}')">
          </div>
          <div class="flex-1">
            <label for="${inputId}-reps-${i}" class="block text-gray-700">Set ${i + 1} Reps:</label>
            <input id="${inputId}-reps-${i}" type="number" value="${reps}" class="w-full p-2 border rounded" min="0" placeholder="e.g. 12" aria-label="Reps for set ${i + 1}" oninput="saveSets('${logKey}', '${inputId}', ${maxSets}); updateLastDisplay('${inputId}', '${lastLogKey}')">
          </div>
        </div>
      `;
    }
    return `
      <div class="exercise space-y-2">
        <strong>${ex.name}</strong>
        <div>Sets: ${ex.sets}, Reps: ${ex.reps}</div>
        ${setInputs}
        <div class="text-sm text-gray-500">Last: <span id="last-${inputId}">${lastDisplay}</span></div>
      </div>
    `;
  }).join('');
}

function saveSets(logKey, inputId, maxSets) {
  if (!isBrowser) return;
  const sets = [];
  for (let i = 0; i < maxSets; i++) {
    const weight = parseInt(document.getElementById(`${inputId}-weight-${i}`).value) || 0;
    const reps = parseInt(document.getElementById(`${inputId}-reps-${i}`).value) || 0;
    if (weight || reps) sets.push({ weight, reps });
  }
  localStorage.setItem(logKey, JSON.stringify(sets));
  const status = document.createElement('div');
  status.textContent = 'Saved';
  status.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded';
  document.body.appendChild(status);
  setTimeout(() => status.remove(), 1000);

  const date = logDateInput?.value || new Date().toISOString().split('T')[0];
  const workoutLog = {
    id: Date.now(),
    type: currentWorkout,
    date,
    exercises: workoutPlans[currentWorkout].map((ex, index) => {
      const exLogKey = `${currentWorkout}-${index}-${date}`;
      const exSets = JSON.parse(localStorage.getItem(exLogKey)) || [];
      return {
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        setsData: exSets,
        category: ex.category
      };
    })
  };
  workouts = workouts.filter(w => !(w.type === workoutLog.type && w.date === workoutLog.date));
  workouts.push(workoutLog);
  localStorage.setItem('workouts', JSON.stringify(workouts));
  renderHistory();
  renderProgressStats();
}

function updateLastDisplay(inputId, lastLogKey) {
  if (!isBrowser) return;
  const lastValue = lastLogKey ? JSON.parse(localStorage.getItem(lastLogKey)) || [] : [];
  const lastDisplay = lastValue.length ? lastValue.map(s => `${s.weight}x${s.reps}`).join(', ') : '—';
  document.getElementById(`last-${inputId}`).innerText = lastDisplay;
}

function editWorkout(id) {
  if (!isBrowser || !contentDiv) return;
  const workout = workouts.find(w => w.id === id);
  if (!workout) return;

  contentDiv.innerHTML = `
    <h3 class="text-lg font-semibold text-gray-800 mb-4">Edit Workout: ${workout.type.toUpperCase()} (${workout.date})</h3>
    <form id="editForm" class="space-y-4">
      ${workout.exercises.map((ex, index) => `
        <div class="space-y-2">
          <strong>${ex.name}</strong>
          <div>Sets: ${ex.sets}, Reps: ${ex.reps}</div>
          ${Array.from({ length: ex.sets }, (_, i) => `
            <div class="flex space-x-4">
              <div class="flex-1">
                <label for="edit-${index}-weight-${i}" class="block text-gray-700">Set ${i + 1} Weight (lbs):</label>
                <input id="edit-${index}-weight-${i}" type="number" value="${ex.setsData[i]?.weight || 0}" class="w-full p-2 border rounded" min="0" aria-label="Edit weight for set ${i + 1}">
              </div>
              <div class="flex-1">
                <label for="edit-${index}-reps-${i}" class="block text-gray-700">Set ${i + 1} Reps:</label>
                <input id="edit-${index}-reps-${i}" type="number" value="${ex.setsData[i]?.reps || 0}" class="w-full p-2 border rounded" min="0" aria-label="Edit reps for set ${i + 1}">
              </div>
            </div>
          `).join('')}
        </div>
      `).join('')}
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save Changes</button>
    </form>
  `;

  document.getElementById('editForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const newExercises = workout.exercises.map((ex, index) => {
      const newSets = Array.from({ length: ex.sets }, (_, i) => ({
        weight: parseInt(document.getElementById(`edit-${index}-weight-${i}`).value) || 0,
        reps: parseInt(document.getElementById(`edit-${index}-reps-${i}`).value) || 0
      })).filter(s => s.weight || s.reps);
      const exLogKey = `${workout.type}-${index}-${workout.date}`;
      localStorage.setItem(exLogKey, JSON.stringify(newSets));
      return {
        ...ex,
        setsData: newSets
      };
    });
    workout.exercises = newExercises;
    localStorage.setItem('workouts', JSON.stringify(workouts));
    renderHistory();
    renderProgressStats();
    loadWorkout(currentWorkout);
    alert('Workout updated successfully!');
  });
}

function renderProgressStats() {
  if (!isBrowser || !progressStatsDiv) return;
  const totalWeight = workouts.reduce((sum, w) => sum + w.exercises.reduce((s, e) => s + e.setsData.reduce((t, set) => t + (set.weight || 0), 0), 0), 0);
  const workoutsByType = {};
  workouts.forEach(w => {
    workoutsByType[w.type] = (workoutsByType[w.type] || 0) + 1;
  });
  progressStatsDiv.innerHTML = `
    <p>Total Weight Lifted: ${totalWeight} lbs</p>
    <p>Workouts Completed: ${workouts.length}</p>
    <p>By Type: ${Object.entries(workoutsByType).map(([type, count]) => `${type.toUpperCase()}: ${count}`).join(', ')}</p>
  `;
}

function renderHistory() {
  if (!isBrowser || !workoutHistory) return;
  workoutHistory.innerHTML = '';
  workouts.forEach(w => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${w.date}: ${w.type.toUpperCase()}<br>
      ${w.exercises.map(e => `${e.name}: ${e.setsData.length ? e.setsData.map(s => `${s.weight}x${s.reps}`).join(', ') : 'No data'}`).join('<br>')}
      <span class="edit-btn" data-id="${w.id}">Edit</span>
    `;
    workoutHistory.appendChild(li);
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => editWorkout(parseInt(btn.dataset.id)));
  });
}

function updateTimerDisplay() {
  if (!isBrowser || !timerDisplay) return;
  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
  if (!isBrowser || isTimerRunning) return;
  isTimerRunning = true;
  startTimerBtn.disabled = true;
  pauseTimerBtn.disabled = false;
  timerInterval = setInterval(() => {
    timerSeconds++;
    updateTimerDisplay();
    if (timerSeconds === 60) {
      clearInterval(timerInterval);
      isTimerRunning = false;
      startTimerBtn.disabled = false;
      pauseTimerBtn.disabled = true;
      alert('Rest timer complete!');
    }
  }, 1000);
}

function pauseTimer() {
  if (!isBrowser || !isTimerRunning) return;
  clearInterval(timerInterval);
  isTimerRunning = false;
  startTimerBtn.disabled = false;
  pauseTimerBtn.disabled = true;
}

function resetTimer() {
  if (!isBrowser) return;
  clearInterval(timerInterval);
  isTimerRunning = false;
  timerSeconds = 0;
  updateTimerDisplay();
  startTimerBtn.disabled = false;
  pauseTimerBtn.disabled = true;
}

if (isBrowser) {
  startTimerBtn?.addEventListener('click', startTimer);
  pauseTimerBtn?.addEventListener('click', pauseTimer);
  resetTimerBtn?.addEventListener('click', resetTimer);
  logDateInput?.addEventListener('change', () => loadWorkout(currentWorkout));
}