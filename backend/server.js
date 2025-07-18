const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const SECRET_KEY = 'your_secret_key'; // Keep it safe

app.use(cors());
app.use(express.json());

const users = []; // Simulated database

// Register
app.post('/register', async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password } = req.body;

  // Check if email already exists
  const exists = users.find(u => u.email === email);
  if (exists) return res.status(400).json({ error: 'Email already registered' });

  const hashed = await bcrypt.hash(password, 10);

  users.push({ firstName, lastName, email, phoneNumber, password: hashed });

  res.json({ message: 'User registered successfully' });
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ error: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// Protected route
app.get('/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    res.json({ message: `Hello ${user.email}` });
  });
});

// Test route
app.get('/', (req, res) => {
  res.send('Hello from the backend');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});