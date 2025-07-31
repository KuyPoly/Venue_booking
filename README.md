# � Venue Booking System

 The venue booking system is a middleman system between hall owner and customers. It allows owners to showcase their venues, making them easily accessible to a wider audience. This system eliminates the hassle of traditional booking processes, reducing the time and effort typically required for event planning and making the entire experience more user-friendly and transparent.  
 Built with React.js frontend and Node.js/Express backend with MySQL database.

## 🌟 Features

### For Customers
- **🔍 Advanced Search**: Search venues by location, capacity, budget, and categories
- **🗺️ Google Maps Integration**: Interactive maps with location picker and geocoding
- **❤️ Favorites**: Save and manage favorite venues
- **📅 Booking Management**: View booking history and manage reservations
- **� Multiple Payment Options**: ABA Pay QR code integration
- **📧 Email Notifications**: Automated booking confirmations via EmailJS

### For Venue Owners
- **🏢 Venue Management**: Add, edit, and manage venue listings
- **� Dashboard**: Overview of bookings, earnings, and statistics
- **💰 Wallet System**: Track earnings and manage payouts
- **� Analytics**: Booking statistics and revenue tracking
- **🖼️ Image Management**: Upload and manage venue photos via Cloudinary
- **⚙️ Settings**: Manage profile and venue preferences

### For Administrators
- **� User Management**: Manage customer and owner accounts
- **📋 Booking Oversight**: Monitor and manage all bookings
- **💼 System Administration**: Platform settings and configurations

## �️ Tech Stack

### Frontend
- **React 18.2** - UI framework
- **React Router Dom 6.8.1** - Client-side routing
- **Google Maps API** - Maps and location services
- **EmailJS** - Email notification service
- **React Icons** - Icon library
- **Axios** - HTTP client

### Backend
- **Node.js** with **Express 4.18** - Server framework
- **MySQL** with **Sequelize 6.32** - Database and ORM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image storage and management
- **Multer** - File upload handling
- **Nodemailer** - Email services

## 📁 Project Structure

```
venue_booking/
├── frontend/                   # React frontend application
│   ├── public/                 # Static files
│   ├── src/
│   │   ├── component/          # Reusable components
│   │   │   ├── auth/           # Authentication components
│   │   │   ├── maps/           # Google Maps components
│   │   │   ├── payment/        # Payment components (ABA Pay)
│   │   │   ├── wallet/         # Wallet management components
│   │   │   └── ...
│   │   ├── page/               # Page components
│   │   │   ├── Dashboard/      # Owner dashboard
│   │   │   ├── Wallet/         # Wallet management
│   │   │   ├── VenueSearch/    # Venue search and filters
│   │   │   └── ...
│   │   ├── services/           # API services
│   │   ├── context/            # React contexts
│   │   └── config/             # Configuration files
│   └── package.json
├── backend/                    # Node.js backend API
│   ├── controllers/            # Route controllers
│   ├── models/                 # Database models
│   ├── routes/                 # API routes
│   ├── middleware/             # Custom middleware
│   ├── migrations/             # Database migrations
│   ├── config/                 # Database and service configs
│   ├── uploads/                # File upload directory
│   └── server.js               # Entry point
└── README.md
```

## � Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Environment Variables

Create `.env` files in both frontend and backend directories:

#### Backend `.env`
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=venue_booking
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_password
```

#### Frontend `.env`
```env
# Google Maps
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# EmailJS
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id  
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key

# API
REACT_APP_API_URL=http://localhost:5000/api
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KuyPoly/Venue_booking.git
   cd venue_booking
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Setup Database**
   ```bash
   cd ../backend
   # Run migrations
   npx sequelize-cli db:create
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

5. **Start the applications**
   
   **Backend (Terminal 1):**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
## 📡 API Endpoints

All API endpoints are prefixed with `/api` and require appropriate authentication where noted.

### 🔐 Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register a new user account | ❌ |
| `POST` | `/api/auth/login` | Authenticate user and get JWT token | ❌ |
| `GET` | `/api/auth/profile` | Get current user profile | ✅ |
| `PUT` | `/api/auth/profile` | Update user profile | ✅ |

### 🏢 Listing Management Routes (`/api/listing`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/listing` | Get all venue listings (with filters) | ❌ |
| `GET` | `/api/listing/:id` | Get specific venue details | ❌ |
| `POST` | `/api/listing` | Create new venue listing | ✅ (Owner) |
| `PUT` | `/api/listing/:id` | Update venue listing | ✅ (Owner) |
| `DELETE` | `/api/listing/:id` | Delete venue listing | ✅ (Owner) |
| `GET` | `/api/listing/owner/:ownerId` | Get all listings by owner | ✅ |

### 📅 Booking Routes (`/api/booking`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/booking` | Get owner's venue bookings | ✅ (Owner) |
| `GET` | `/api/booking/stats` | Get booking statistics | ✅ (Owner) |
| `GET` | `/api/booking/requests` | Get pending booking requests | ✅ (Owner) |
| `GET` | `/api/booking/:id` | Get specific booking details | ✅ |
| `POST` | `/api/booking` | Create new booking | ✅ (Customer) |
| `PUT` | `/api/booking/:id/status` | Update booking status | ✅ (Owner) |

### 📊 Dashboard Routes (`/api/dashboard`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/dashboard/stats` | Get owner dashboard statistics | ✅ (Owner) |

### 💰 Wallet Routes (`/api/wallet`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/wallet` | Get wallet balance and info | ✅ (Owner) |
| `GET` | `/api/wallet/stats` | Get wallet statistics | ✅ (Owner) |
| `GET` | `/api/wallet/transactions` | Get transaction history | ✅ (Owner) |
| `POST` | `/api/wallet/credit` | Credit wallet (booking payment) | ✅ (System) |
| `POST` | `/api/wallet/withdraw` | Request wallet withdrawal | ✅ (Owner) |

### 🔧 Booking Management Routes (`/api/booking-management`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/booking-management/availability` | Check hall availability | ✅ |
| `GET` | `/api/booking-management/status-summary` | Get booking status summary | ✅ (Owner) |
| `GET` | `/api/booking-management/pending` | Get pending bookings | ✅ (Owner) |
| `GET` | `/api/booking-management/debug` | Debug booking and wallet data | ✅ (Admin) |

### 📂 Categories Routes (`/api/categories`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/categories` | Get all venue categories | ❌ |

### 💳 Payment Routes (`/api/payments`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/payments/process` | Process ABA Pay payment | ✅ |
| `GET` | `/api/payments/history` | Get payment history | ✅ |

### 🔍 Venue Search Routes (`/api/venuesearch`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/venuesearch` | Advanced venue search with filters | ❌ |
| `GET` | `/api/venuesearch/nearby` | Find venues near location | ❌ |

### 📈 Activity Routes (`/api/activities`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/activities` | Get recent activities log | ✅ (Owner) |

### 💵 Earnings Routes (`/api/earnings`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/earnings` | Get earnings overview | ✅ (Owner) |
| `GET` | `/api/earnings/weekly` | Get weekly earnings data | ✅ (Owner) |
| `GET` | `/api/earnings/monthly` | Get monthly earnings data | ✅ (Owner) |

### 💸 Payouts Routes (`/api/payouts`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/payouts` | Get payout history | ✅ (Owner) |
| `POST` | `/api/payouts/request` | Request new payout | ✅ (Owner) |

### 📝 Query Parameters

#### Venue Search (`/api/listing`, `/api/venuesearch`)
```
?location=phnom+penh          # Filter by location
&category=1,2,3               # Filter by category IDs
&minCapacity=50               # Minimum capacity
&maxCapacity=200              # Maximum capacity
&minPrice=100                 # Minimum price
&maxPrice=500                 # Maximum price
&sortBy=price                 # Sort by: price, capacity, name
&sortOrder=asc                # Sort order: asc, desc
&page=1                       # Pagination page
&limit=10                     # Items per page
```

#### Booking Filters (`/api/booking`)
```
?status=pending               # Filter by status: pending, confirmed, cancelled
&startDate=2024-01-01         # Filter by start date
&endDate=2024-12-31           # Filter by end date
&page=1                       # Pagination page
&limit=10                     # Items per page
```

#### Transaction History (`/api/wallet/transactions`)
```
?type=earning                 # Filter by type: earning, withdrawal, refund
&startDate=2024-01-01         # Filter by date range
&endDate=2024-12-31
&page=1                       # Pagination page
&limit=20                     # Items per page
```

### 🔒 Authentication Headers

For protected routes, include the JWT token in the request header:
```http
Authorization: Bearer <your_jwt_token>
```

### 📥 Request Examples

#### Create a Booking
```javascript
POST /api/booking
Content-Type: application/json
Authorization: Bearer <token>

{
  "hall_id": 1,
  "booking_date": "2024-12-25",
  "start_time": "14:00:00",
  "end_time": "18:00:00",
  "guest_count": 100,
  "total_amount": 500.00,
  "notes": "Wedding reception"
}
```

#### Search Venues
```javascript
GET /api/venuesearch?location=phnom+penh&category=1&minCapacity=50&maxCapacity=200
```

#### Update Booking Status
```javascript
PUT /api/booking/123/status
Content-Type: application/json
Authorization: Bearer <token>

{
  "status": "confirmed",
  "owner_notes": "Booking confirmed. Please arrive 30 minutes early."
}
```

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


## 👥 Team

- **KuyPoly** - [GitHub Profile](https://github.com/KuyPoly)

## 🙏 Acknowledgments

- Google Maps API for location services
- Cloudinary for image management
- EmailJS for email notifications
- React community for amazing components
- Express.js for robust backend framework

---

⭐ **Star this repository if you found it helpful!**
