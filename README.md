# 🎬 Lion's Den Movie Theater

**Lion's Den Movie Theater** is a full-stack web and mobile application that delivers a seamless movie-booking experience. Users can browse movies, find nearby theaters, book and pay for tickets online, and get support — all through an intuitive UI on both web and mobile platforms. Admins can manage content and users through a secure dashboard.

---

## 🚀 Features

### 👤 User Features
- Browse latest and upcoming movies
- View detailed movie info and showtimes
- Locate nearby theaters using GPS
- Book and pay for tickets online (Stripe integration)
- View booking history and manage profile
- Responsive mobile-first experience using React Native
- In-app email chat support for assistance

### 🛠️ Admin Features
- Dashboard displaying key statistics
- Add, update, and delete movies and theater listings
- Manage users and view email chat logs
- Admin authentication with role-based access control

---

## 🧰 Tech Stack

| Layer        | Technology                                |
|--------------|--------------------------------------------|
| Frontend     | React, TypeScript, Tailwind CSS, Vite      |
| Backend      | ASP.NET Core 9, C#                         |
| Database     | SQL Server                                 |
| Mobile App   | React Native, TypeScript, NativeWind, Expo |
| Payments     | Stripe API                                 |
| Hosting      | Azure                                      |

---

## 📦 Getting Started

### 🔧 Prerequisites

- Node.js & npm
- .NET 9 SDK
- SQL Server (local or cloud)
- Expo CLI (`npm install -g expo-cli`)

---

### 🌐 Start Web App (React + Vite)
bash
cd Selu383.SP25.P03.Web
npm install
npm run dev

📱 Start Mobile App (React Native + Expo)
```bash
cd Selu383.SP25.P03.Mobile
npm install
npm run start
Open the Expo QR code in your Expo Go app (iOS/Android) to run the app on your device.

🖥️ Start Backend (ASP.NET Core 9)
cd Selu383.SP25.P03.Api
dotnet restore
dotnet run
Ensure your SQL Server connection string is correctly set in appsettings.json.

📁 Project Structure
├── Selu383.SP25.P03.Web  # React web frontend
├── Selu383.SP25.P03.Mobile  # React Native mobile app
├── Selu383.SP25.P03.Api    # ASP.NET Core backend API

🙌 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
