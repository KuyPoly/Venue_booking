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
🗂️ Venue_booking/
📦 backend/ – Express.js API
config/ – DB & environment variable configuration

controllers/ – Route handler functions

database/ – Sequelize DB connection setup

middleware/ – Authentication, logging, error handling

migrations/ – Sequelize migration files

model/ – Sequelize data models

public/ – Static files served by backend

routes/ – API route definitions

seeders/ – Sample/test seed data

utils/ – Helper utilities

.env – Environment variables (not committed)

.env.example – Sample env variables

.sequelizerc – Sequelize CLI configuration

package.json – Backend dependencies and scripts

package-lock.json – Exact package versions

railway.toml – Railway deployment config

README.md – Project documentation (this file)

server.js – App entry point

💻 frontend/ – React Client
node_modules/ – Frontend dependencies

public/ – Static files (favicon, index.html)

src/ – React source code

assets/ – Images, icons, fonts

component/ – Single-purpose UI elements

components/ – Reusable components

config/ – Constants, API base URLs

context/ – React context providers

hooks/ – Custom React hooks

page/ – Page-level components

services/ – API calls and logic

App_backup.js – Backup of main App

App_debug.js – Debug version of App

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
