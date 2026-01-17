rade Show "Spin to Win" Kiosk
A minimalist, high-performance "Wheel of Fortune" web application designed for trade show environments. Built with a React frontend and Node.js backend, it features "un-gameable" server-side logic and offline resilience for flaky Wi-Fi.

Key Features
Server-Authoritative Logic: The winning prize and landing angle are calculated on the backend using a weighted probability engine to prevent client-side manipulation.

Offline-First Resilience: If the internet drops, leads are queued in localStorage and automatically synced to the server once the connection is restored.

Minimalist 4K UI: High-fidelity SVG wheel animated at 60fps using Framer Motion, optimized for large Full HD and 4K TV displays.

One Spin Per User: Email validation via SQLite ensures each attendee only gets one chance to win.

PWA Ready: Assets are cached locally to ensure the app loads even without an active internet connection.

Tech Stack
Frontend: React 18, Vite, Tailwind CSS, Framer Motion.

Backend: Node.js, Express, Better-SQLite3.

Tools: Axios, Canvas-Confetti, Lucide-React