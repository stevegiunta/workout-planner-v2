# Steve's Workout Planner V2

A Progressive Web App (PWA) for planning and logging strength workouts with alternating A/B weeks, a weekly schedule, rest timer, editable history, and progress stats.

## Features

- **Workouts**: 8 types (Push A/B, Pull A/B, Legs + Shoulders A/B, Arms + Chest A/B) with predefined exercises.
- **Weekly Schedule**: 4 workout days (Mon, Wed, Fri, Sat), 3 rest days (Tue, Thu, Sun), alternating A/B weeks.
- **Logging**: Save weights per exercise and date to localStorage.
- **Rest Timer**: 60s timer for rest between sets.
- **Editable History**: Edit past workouts via a form.
- **Progress Stats**: Total weight lifted and workout counts.
- **UI**: Responsive Tailwind CSS design.
- **Offline Support**: Service worker for reliable offline use.

## Setup

1. **Clone the Repo**:

   ```bash
   git clone https://github.com/stevegiunta/workout-planner-v2.git
   cd workout-planner-v2
   ```
2. **Run Locally**:

   ```bash
   python -m http.server 8000
   ```

   Open `http://localhost:8000`.
3. **Deploy to GitHub Pages**:
   - Push to `gh-pages` branch.
   - Access at `https://stevegiunta.github.io/workout-planner-v2`.

## Files

- `index.html`: UI with calendar, workout selector, timer, and logging.
- `styles.css`: Custom styles with Tailwind.
- `main.js`: Logic for workouts, calendar, timer, and stats.
- `sw.js`: Service worker.
- `manifest.json`: PWA manifest.
- `icon-192x192.png`, `icon-512x512.png`: PWA icons.

## Customization

- **Workouts**: Edit `workoutPlans` in `main.js`.
- **Schedule**: Modify `weeklySchedule` in `main.js`.
- **Timer**: Adjust `timerSeconds` in `main.js`.

## Notes

- Test on iPhone for offline functionality and cache updates.
- Icons included for PWA installation.

## License

MIT License