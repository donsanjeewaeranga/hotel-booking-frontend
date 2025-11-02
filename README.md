# Hotel Booking Frontend (Vue + Vite)

Prerequisites:
- Node.js 18+
- API running at http://localhost:5039 (Vite proxies /api to this origin)

Install & Run:
```bash
cd hotel-booking-frontend
npm install
npm run dev
```
Then open http://localhost:5173.

Sitemap:
- Room Search: `/`
- Rooms: `/rooms`
- Contact Information: `/contact`
- Confirmation: `/confirm`
- Login/Register: `/auth`
- Dashboard: `/dashboard`

Notes:
- Auth token is stored in local storage via `src/store.js`.
- Reservation create requires JWT (login/register via API).
- Endpoints used: `/api/Rooms/search`, `/api/Reservations`, `/api/Reservations/guest/{guestId}`, `/api/Reservations/{id}/cancel`, `/api/Auth/register`, `/api/Auth/login`, `/api/Guests/user/{userId}`, `/api/Guests`.
