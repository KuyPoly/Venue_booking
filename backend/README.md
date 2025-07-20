# Venue Booking Backend

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in the backend directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=venue_booking
DB_PORT=3306

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Server Configuration
PORT=5000
```

### 2. Database Setup
1. Make sure your MySQL database is running
2. Create a database named `hall_booking` (or update DB_NAME in .env)
3. The application will automatically create tables when it starts

### 3. Install Dependencies
```bash
npm install
```

### 4. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will run on **http://localhost:5000**

## API Endpoints

### Authentication
- `POST /register` - Register a new user
- `POST /login` - Login user
- `GET /profile` - Get user profile (requires authentication)

### Request/Response Examples

#### Register User
```json
POST /register
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phoneNumber": "1234567890",
  "password": "password123",
  "dob": "1990-01-01",
  "address": "123 Main St, City, State",
  "gender": "male"
}
```

#### Login User
```json
POST /login
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile (requires Authorization header)
```json
GET /profile
Authorization: Bearer <jwt_token>
```

## Features
- User registration with all required fields
- Secure password hashing with bcrypt
- JWT-based authentication
- Database integration with Sequelize ORM
- Input validation and error handling 