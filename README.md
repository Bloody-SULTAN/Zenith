# Project Zenith — Space Intelligence Dashboard

> **[Launch App](https://Bloody-SULTAN.github.io/Zenith/)**

A zero-cost, single-page Space Intelligence Dashboard that aggregates real-time orbital tracking, Mars rover photography, asteroid threat monitoring, and NASA's Astronomy Picture of the Day into a futuristic dark-mode interface.

## Modules

| Module | Data Source | Description |
|---|---|---|
| **Orbital Tracker** | Open Notify API | Real-time ISS position on a Leaflet.js map |
| **Martian Archive** | NASA Mars Rover Photos API | Searchable gallery filtered by Rover & Camera |
| **Asteroid Sentinel** | NASA NeoWs API | Near Earth Objects dashboard with hazard levels |
| **Astro-Hero** | NASA APOD API | Dynamic hero banner from Astronomy Picture of the Day |

## Tech Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4 (dark mode)
- **Icons:** Lucide React
- **Charts:** Recharts
- **Maps:** Leaflet.js + React Leaflet
- **Deployment:** GitHub Pages via GitHub Actions

## Getting Started (Local Development)

```bash
git clone https://github.com/Bloody-SULTAN/Zenith.git
cd Zenith
npm install
npm run dev
```

Optionally create a `.env` file with a free NASA API key from [api.nasa.gov](https://api.nasa.gov):

```
VITE_NASA_API_KEY=your_key_here
```

The app works without one using `DEMO_KEY` (30 requests/hour).
