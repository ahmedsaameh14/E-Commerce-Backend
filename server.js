const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db.config');
const path = require('path')
const app = express();
const corsMiddleware = require('./middlewares/cors.middleware')
app.use(corsMiddleware);

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

connectDB();

app.use('/user', require('./routes/user.route'));       // Reg
app.use('/auth' ,require('./routes/auth.route'));       // Login
app.use('/products',require('./routes/product.route'))
app.use('/purchase',require('./routes/purchase.route'))
app.use('/subcategory',require('./routes/subcategory.route'))
app.use('/reports',require('./routes/reports.route'))


const PORT = process.env.PORT || 3000;
app.listen(PORT,()=> console.log(`🚀 Server Started at port ${PORT}`))
