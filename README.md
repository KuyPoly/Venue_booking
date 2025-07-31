# 🌊 OceanGate — Venue Booking System

OceanGate is a modern web platform that connects hall owners with customers, streamlining the traditional booking process for events such as weddings, parties, meetings, and more. Venue owners can showcase their spaces, and customers can search, compare, and book in just a few clicks.

# ✨ Features

🎯 Browse and search available venues by location, guest count, and budget

📅 Real-time availability and booking confirmation

🧾 Owner dashboard for adding/editing venue listings

🔒 Secure authentication (login/signup)

📊 Booking statistics and activity logs

📷 Image gallery for each venue

🚀 Tech Stack

# Frontend
React.js (JSX, ES6+ JavaScript)
HTML5, CSS3
Backend
Node.js & Express.js
Sequelize ORM + SQL database
Other
JSON for client–server data exchange
Environment variables via .env
Markdown for documentation

<details> <summary><strong>📁 Click to view: Project Folder Structure</strong></summary>
plaintext
Copy
Edit
Venue_booking/
├── backend/                   # Express.js backend API
│   ├── config/               # DB & environment variable config
│   ├── controllers/          # Route handler functions
│   ├── database/             # Sequelize DB connection setup
│   ├── middleware/           # Auth, error, and logger middlewares
│   ├── migrations/           # Sequelize migration files
│   ├── model/                # Sequelize data models
│   ├── public/               # Static files served by backend
│   ├── routes/               # API route definitions
│   ├── seeders/              # Sequelize seed data scripts
│   ├── utils/                # Utility/helper functions
│   ├── .env                  # Local environment variables (ignored by Git)
│   ├── .env.example          # Example env file for reference
│   ├── .sequelizerc          # Sequelize CLI config
│   ├── package.json          # Backend dependencies and scripts
│   ├── package-lock.json     # Lockfile for consistent installs
│   ├── railway.toml          # Railway deployment config
│   ├── README.md             # (This file)
│   └── server.js             # Backend app entry point
│
└── frontend/                 # React frontend client
    ├── node_modules/        # Frontend dependencies
    ├── public/              # Public files (favicon, index.html, etc.)
    └── src/                 # Main React app source code
        ├── assets/          # Static assets (images, fonts, etc.)
        ├── component/       # Small UI elements (optional, specific use)
        ├── components/      # Reusable React components
        ├── config/          # API base URL and constants
        ├── context/         # React Context API providers
        ├── hooks/           # Custom React hooks
        ├── page/            # Page-level components for routing
        ├── services/        # API request services (e.g., axios wrappers)
        ├── App_backup.js    # Backup version of App component
        └── App_debug.js     # Debug version of App component
</details>

# 🔧 Installation & Setup

Clone the repo
git clone https://github.com/your-username/Venue_booking.git
cd oceangate

Install dependencies

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
Configure environment variables
Copy backend/.env.example → backend/.env and fill in your PORT, database URL, JWT_SECRET, etc.
Create frontend/.env and set:
REACT_APP_API_BASE_URL=http://localhost:5000/api
Run the app

# In one terminal (backend)
cd backend
npm start

# In another (frontend)
cd frontend
npm start

Navigate to http://localhost:3000 to explore OceanGate.

# 📡 API Endpoints

OceanGate’s REST API is organized under the /api prefix.
Authentication Endpoints

POST
/api/auth/register
Register a new user account

POST
/api/auth/login
Authenticate user and get token


Hall Management Endpoints

GET
/api/halls
Retrieve list of all halls

GET
/api/halls/:id
Retrieve detailed info for one hall

POST
/api/owners/halls
Create a new hall listing (owners only)

PUT
/api/owners/halls/:id
Update an existing hall (owners only)

DELETE
/api/owners/halls/:id
Delete a hall listing (owners only)


POST
/api/bookings
Create a new booking (authenticated users only)

GET
/api/bookings/user
List bookings for the logged‑in user

PUT
/api/owners/bookings/:id/status
Update booking status (owners only)

# 🧪 Testing

( In either folder) if you add tests:
npm test

# 🚧 Known Issues

Booking-conflict checks are not real-time yet
Some UI components lack full mobile responsiveness

# 🤝 Contributing

Fork the repo
Create a feature branch (git checkout -b feature/XYZ)
Commit your changes (git commit -m 'Add XYZ')
Push to your branch (git push origin feature/XYZ)
Open a Pull Request
