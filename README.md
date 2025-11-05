# Hotel Booking Frontend (Vue + Vite)

Prerequisites:
- Node.js 18+
- Build the dotnet API running at Ex: http://localhost:5039 in Local (Vite proxies /api to this origin)

Install & Run:
```bash
cd hotel-booking-frontend
npm install
npm run dev
```
Then open http://localhost:5173.

Sitemap:
- Room Search: `/`
- Booking (multi-step): `/booking`
	- Select Room → Contact Info → Confirmation (steps inside the same route)
- Login/Register: `/auth`
- Dashboard: `/dashboard`

Notes:
- Auth token is stored in local storage via `src/store.js`.
- Reservation create requires JWT (login/register via API).
- Search page dates: users must select Check-in and Check-out (no default dates). Past dates are disabled. When a Check-in date is picked, Check-out auto-advances to the next day (min).
- If a search returns no availability, the Select Room step shows a friendly "No Rooms Available" message with a link to modify the search.
- Confirmation step includes a "Manage Bookings" button that navigates to the Dashboard.
- Dashboard status mapping aligns with backend enum: 0 = Confirmed, 1 = Canceled, 2 = CheckedIn, 3 = CheckedOut. Upcoming shows Confirmed future bookings; Past shows CheckedIn/CheckedOut. Only Confirmed future bookings can be canceled.
- Mobile navigation menu is handled in `NavBar.vue` (Vue-controlled). The toggle applies an `active` class to the button and nav, closes on outside clicks and when a nav item is clicked.

Endpoints used:
- `/api/Rooms/search`
- `/api/Reservations`
- `/api/Reservations/guest/{guestId}`
- `/api/Reservations/{id}/cancel`
- `/api/Auth/register`
- `/api/Auth/login`
- `/api/Guests/user/{userId}`
- `/api/Guests`
