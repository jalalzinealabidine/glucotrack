# GlucoTrack

GlucoTrack is a React website for diabetes tracking. It lets a user log blood sugar readings, log insulin injection units, view history, visualize charts, create reminders, and export a printable report.

> Medical disclaimer: This app is for tracking only. It does not diagnose, prescribe insulin doses, or replace advice from a doctor.

## Features

- Dashboard with today statistics
- Add blood sugar readings
- Add insulin injection logs
- Edit and delete records
- Search history
- Daily blood sugar line chart
- Weekly average blood sugar bar chart
- Daily reminder list
- Browser notifications while the website is open
- Printable doctor report with CSV export
- PWA manifest and service worker
- LocalStorage mode by default
- Optional Supabase Auth + Supabase PostgreSQL mode

## Tech stack

- React
- Vite
- React Router
- Recharts
- date-fns
- Supabase, optional
- localStorage fallback
- CSS

## How to run

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal.

## Build for production

```bash
npm run build
npm run preview
```

## Local mode

The app works immediately after `npm run dev`. In local mode, records are saved in the current browser using `localStorage`.

## Supabase mode

Supabase mode is optional. Use it if you want login/register and cloud database storage.

### 1. Create a Supabase project

Create a new project on Supabase.

### 2. Run the SQL schema

Open Supabase SQL Editor and run:

```text
supabase/schema.sql
```

This creates:

- `blood_sugar_logs`
- `insulin_logs`
- `reminders`
- Row Level Security policies

### 3. Add environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then add your values:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Restart Vite after editing `.env`.

## Project structure

```text
src/
  components/
  context/
  hooks/
  lib/
  pages/
  utils/
  App.jsx
  main.jsx
  styles.css
supabase/
  schema.sql
public/
  manifest.json
  sw.js
  icon-192.png
  icon-512.png
```

## Important safety note

This app should not calculate insulin doses or give treatment decisions. It only logs information and displays charts/reports.

## Suggested future improvements

- Real background push notifications using a backend and web push subscriptions
- Monthly charts
- Dark mode
- Better report PDF design
- Data import/export JSON
- Doctor sharing link
