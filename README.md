# AI Project Sprint — Growth Hub 🚀

A modern web application built for **Growth Hub**, designed to drive student registrations for a free 60-Minute "Build Your First AI Project" workshop. Features real-time viral growth mechanics, referral tracking, and an analytics dashboard.

---

## 🌟 Features

- **Landing Page (`/`)**: High-converting workshop overview with FAQ and referral detection.
- **Registration Flow (`/register`)**:
  - Validated registration form capturing student details (College, Branch, Graduation Year, Channel).
  - Preserves incoming referral codes across sessions.
  - Dynamic referral code generator for every registered participant.
  - 1-Click **Copy Link** & **Share via WhatsApp** buttons.
- **Analytics Dashboard (`/dashboard`)**:
  - Key Performance Indicators: Total Signups, Target Progress (500 Goal), Referrals %, Budget Spent, Remaining Budget, Cost per Registration (CPR).
  - **Registrations by Day** (Bar Chart).
  - **Registrations by Acquisition Channel** (Pie Chart).
  - **Referral Leaderboard**: Real-time ranking of top student advocates.
  - **Registered Participants Roster**: Live list of attendee submissions.
  - Interactive **Load Demo Dataset** and **Clear Data** controls.

---

## 🛠️ Tech Stack

- **Framework**: React 18
- **Bundler & Dev Server**: Vite 5
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **Charts**: Recharts
- **Containerization**: Docker (Multi-stage build with Nginx Alpine)

---

## 💻 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build & Test Production Bundle
```bash
npm run build
npm run preview
```

---

## 🚀 Deployment on Render (Docker)

This repository includes a production-ready **multi-stage Dockerfile** and **Nginx configuration template** that automatically handles Render's dynamic `$PORT` environment variable and SPA client-side routing.

### Step-by-Step Instructions:

1. **Commit and Push Code to GitHub / GitLab**:
   ```bash
   git add .
   git commit -m "feat: complete Growth Hub app with Docker deployment setup"
   git push origin main
   ```

2. **Create Web Service on Render**:
   - Go to [dashboard.render.com](https://dashboard.render.com/) and log in.
   - Click **New +** and select **Web Service**.
   - Connect your GitHub repository.

3. **Configure the Service**:
   - **Name**: `growth-hub` (or your preferred name)
   - **Runtime**: **Docker** (Render will automatically detect the `Dockerfile`)
   - **Branch**: `main`
   - **Instance Type**: **Free**

4. **Deploy**:
   - Click **Create Web Service**.
   - Render will build the Docker container and start Nginx on the dynamic port.
   - Once deployed, your site will be live at `https://<your-service-name>.onrender.com`.

