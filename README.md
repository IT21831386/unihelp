# 🎓 UniHelp

A full-stack university student platform built with the **MERN stack** (MongoDB, Express.js, React, Node.js). UniHelp brings together essential campus services — notices, marketplace, bookings, boarding, and careers — into a single, unified experience.

---

## ✨ Features

| Feature | Description |
|---|---|
| **📢 Special Notices** | University events, club events, and announcements in one place |
| **🛒 Marketplace** | Buy and sell second-hand items (boarding supplies, electronics, textbooks) |
| **📅 Bookings** | Reserve seats in the canteen, study areas, and the library |
| **🏠 Find a Boarding** | Discover and rate student boarding places recommended by peers |
| **💼 Careers** | Post and find part-time, full-time, and freelance job opportunities |
| **🔐 Authentication** | Secure JWT-based signup, login, and role-based access (user / employer / admin) |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** with JSX
- **Vite 8** — blazing-fast dev server & build tool
- **React Router DOM v7** — client-side routing
- **Vanilla CSS** — custom, component-scoped stylesheets

### Backend
- **Node.js** + **Express 4**
- **MongoDB** + **Mongoose 8** — database & ODM
- **JWT** (`jsonwebtoken`) — stateless authentication
- **bcryptjs** — password hashing
- **CORS** — cross-origin resource sharing
- **dotenv** — environment variable management

---

## 📁 Project Structure

```
unihelp/
├── client/                     # React frontend (Vite)
│   ├── public/
│   │   └── assets/images/      # Static images
│   ├── src/
│   │   ├── assets/             # App assets
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx      # Navigation bar
│   │   │   ├── Hero.jsx        # Landing hero section
│   │   │   ├── EventsBanner.jsx
│   │   │   ├── FeatureSection.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/              # Route-level pages
│   │   │   ├── Home.jsx        # Landing page
│   │   │   ├── Bookings.jsx    # Seat reservation
│   │   │   ├── Careers.jsx     # Job board
│   │   │   ├── Login.jsx       # User login
│   │   │   └── Signup.jsx      # User registration
│   │   ├── App.jsx             # Root component & routes
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Express backend
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   └── authController.js   # Auth logic (register, login, getMe)
│   ├── models/
│   │   └── User.js             # Mongoose User schema
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth routes
│   │   └── index.js            # Route aggregator
│   ├── server.js               # Express app entry point
│   └── package.json
│
└── package.json                # Root scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) connection string

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/unihelp.git
cd unihelp
```

### 2. Install dependencies

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/unihelp
JWT_SECRET=your_jwt_secret_key
```

### 4. Run the application

```bash
# Start the backend (from /server)
npm run dev

# Start the frontend (from /client)
npm run dev
```

Or from the project root:

```bash
npm run server   # Starts the Express API
npm run client   # Starts the Vite dev server
```

The client runs on **http://localhost:5173** and the server on **http://localhost:5000**.

---

## 🔗 API Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api` | Welcome message | Public |
| `GET` | `/api/health` | Health check | Public |
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Authenticate a user | Public |
| `GET` | `/api/auth/me` | Get current user profile | Private |

---

## 🗂️ User Roles

| Role | Description |
|---|---|
| `user` | Default role — browse notices, marketplace, bookings, and careers |
| `employer` | Post and manage job listings on the careers board |
| `admin` | Full platform administration access |

---

## 📜 Available Scripts

### Root (`/`)

| Script | Command | Description |
|---|---|---|
| `client` | `npm run client` | Start the Vite dev server |
| `server` | `npm run server` | Start the Express API server |
| `dev` | `npm run dev` | Start the client (alias) |

### Client (`/client`)

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start Vite dev server |
| `build` | `npm run build` | Build for production |
| `preview` | `npm run preview` | Preview production build |
| `lint` | `npm run lint` | Run ESLint |

### Server (`/server`)

| Script | Command | Description |
|---|---|---|
| `start` | `npm start` | Start with Node |
| `dev` | `npm run dev` | Start in development mode |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
