const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.config');
const path = require('path')
const app = express();
const corsMiddleware = require('./middlewares/cors.middleware')
app.use(corsMiddleware);

dotenv.config();
app.use(express.json());
app.use('/img', express.static(path.join(__dirname, './uploads')));

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=> console.log(`server running on port: ${PORT}`))
