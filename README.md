# Lion's Den Movie Theater

A cross-platform movie booking application built with **React Native (Expo)** for iOS/Android and **React + TypeScript** for web. Users can browse movies, find nearby theaters, select seats, order food, and pay — all through a seamless experience on both platforms.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Web Frontend | React, TypeScript, Tailwind CSS, Vite |
| Mobile App | React Native, TypeScript, NativeWind, Expo |
| Backend | ASP.NET Core 9, C# |
| Database | SQL Server |
| Payments | Stripe API / Stripe React Native |
| Hosting | Azure |

---

## Architecture

Both platforms share the same Context API patterns for state management:

- **AuthContext** — session management with AsyncStorage persistence (mobile) and cookie-based auth (web)
- **BookingContext** — global cart state managing selected seats, food items, and current showtime
- **TheaterContext** — GPS-based nearest theater detection with Haversine formula and fallback logic
- **SearchContext** — shared movie search state across both platforms

---

## Features

### User
- Browse current and upcoming movies with showtimes
- GPS-powered nearest theater detection using Haversine formula and Nominatim geocoding
- Interactive seat selection with real-time availability (booked seats fetched per showtime)
- Food & drinks ordering as part of the checkout flow
- Stripe payment sheet integration for end-to-end ticket purchasing
- Booking history and profile management
- QR code ticket generation (web)

### Admin
- Dashboard with live ticket sales charts and site statistics
- Full CRUD for movies, theaters, and showtimes
- User management and role-based access control
- Admin-only routes protected across both platforms

---

## Project Structure

```
├── Selu383.SP25.P03.Web      # React + TypeScript web frontend
├── Selu383.SP25.P03.Mobile   # React Native + Expo mobile app
├── Selu383.SP25.P03.Api      # ASP.NET Core 9 backend
```

---

## Getting Started

### Prerequisites
- Node.js & npm
- .NET 9 SDK
- SQL Server
- Expo CLI (`npm install -g expo-cli`)

### Web
```bash
cd Selu383.SP25.P03.Web
npm install
npm run dev
```

### Mobile
```bash
cd Selu383.SP25.P03.Mobile
npm install
npm run start
```
Scan the Expo QR code with Expo Go on iOS or Android.

### Backend
```bash
cd Selu383.SP25.P03.Api
dotnet restore
dotnet run
```
Set your SQL Server connection string in `appsettings.json`.
