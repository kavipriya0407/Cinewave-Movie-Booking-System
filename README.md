# CineWave – Movie Ticket Booking Management System

![CineWave Banner](https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80)

**CineWave** is a modern, full-stack responsive web application for online movie ticket booking and theatre management. Built with **React 19**, **Vite**, and styled with **modern Glassmorphic CSS**, CineWave delivers an engaging cinematic experience for moviegoers and a robust operational dashboard for theatre staff.

---

## 🌟 Key Features

### 🎬 For Moviegoers & Customers
- **Curated Movie Showcase**: Explore currently showing and upcoming blockbuster movies with trailers, ratings, genres, and cast details.
- **Theatre & Showtimes Discovery**: Filter shows by date, venue, and screen technology (IMAX 3D, Dolby Atmos, 4DX).
- **Interactive Visual Seat Matrix**: Real-time interactive seat picker supporting Standard, Premium, and VIP Recliner categories.
- **Dynamic Pricing & Snacks Add-ons**: Choose seats, add concessions/snacks, and calculate taxes/discounts dynamically.
- **Ticket Lifecycle Tracker**: End-to-end status tracking (`Pending Approval` ➔ `Confirmed` ➔ `Admitted` / `Cancelled`).
- **Digital Boarding Pass / Ticket**: High-fidelity digital ticket with QR code generation, barcode, and print/download ready layout.
- **Customer Dashboard & Notifications**: View booking history, active tickets, and system alerts.

### 🛡️ For Operations & Theatre Staff
- **Centralized Operations Dashboard**: Real-time KPIs for today's revenue, active bookings, occupancy rates, and pending reviews.
- **Booking Review & Approval Flow**: Accept, confirm, modify, or reject customer bookings with status tracking.
- **Screening & Shows Scheduler**: Add and manage showtimes across multiple screens and formats.
- **Theatres & Movies Catalog Management**: Create and update theatre halls, screens, and movie listings.
- **Visual Analytics & Reports**: Revenue mini-charts, format popularity distributions, and occupancy metrics.

---

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Effects & Feedback**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Styling**: Vanilla CSS Design System with custom glassmorphism, responsive grids, and CSS variables
- **Data & State**: React Context API (`AuthContext`, `BookingContext`, `ToastContext`) + Reactive LocalStorage Persistence

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/kavipriya0407/Cinewave-Movie-Booking-System.git
cd Cinewave-Movie-Booking-System
npm install
```

### 3. Development Server

Start the local development server:

```bash
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

### 4. Production Build

```bash
npm run build
npm run preview
```

---

## 🔑 Demo Credentials

Quickly test different roles using the preconfigured demo accounts (or use the one-click demo login buttons on the login page):

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@cinewave.com` | `customer123` | Booking tickets, seat selection, profile, my bookings |
| **Theatre Staff** | `staff@cinewave.com` | `staff123` | Staff dashboard, show scheduling, ticket verification, reports |

---

## 📁 Project Structure

```text
cinewave/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images and branding
│   ├── components/
│   │   ├── common/      # Navbar, Footer, ProtectedRoute, LifecycleTracker, StatusBadge
│   │   ├── customer/    # MovieCard, TheatreCard, SeatMatrix, ConcessionSelector
│   │   └── staff/       # StaffSidebar, BookingReviewModal, MiniChart
│   ├── context/         # AuthContext, BookingContext, ToastContext
│   ├── data/            # Seed data & localStorage service layer
│   ├── pages/
│   │   ├── customer/    # Dashboards, Seat selection, Ticket view, My bookings
│   │   ├── public/      # Home, Movies catalog, Details, Theatres, Login, Register
│   │   └── staff/       # Admin dashboard, Shows, Movies, Theatres, Reports
│   ├── styles/          # Modular CSS design system
│   ├── utils/           # Formatters and calculation helpers
│   ├── App.jsx          # Route configuration
│   └── main.jsx         # App bootstrap
├── package.json
└── vite.config.js
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
