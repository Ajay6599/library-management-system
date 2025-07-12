require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { connection } = require('./Connection/config');
const { userRouter } = require('./Routes/stud-admin.routes');
const { bookRouter } = require('./Routes/book.routes');
const { borrowRouter } = require('./Routes/borrrowBook.routes');

const app = express();
const port = process.env.PORT || 8080;

const allowedOrigins = [
  'https://bookverselibrary.netlify.app',
  'http://localhost:3000',
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl or mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/users', userRouter);
app.use('/books', bookRouter);
app.use('/borrows', borrowRouter);

app.listen(port, async() => {
    try {
        await connection;
        console.log("Connected with Db");
        console.log(`Server has running at http://localhost:${port}`);
    } catch (error) {
        console.log("Error: ", error);
    }
});