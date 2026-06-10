const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db.config');
const path = require('path')
const helmet = require('helmet');
const app = express();
const corsMiddleware = require('./middlewares/cors.middleware')
const globalErrorHandler = require('./middlewares/globalError.middleware');
const AppError = require('./utils/app-error.util');

app.use(corsMiddleware);

app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, './uploads')));
app.use(helmet());

connectDB();

app.use('/user', require('./routes/user.route'));       // Reg
app.use('/auth' ,require('./routes/auth.route'));       // Login
app.use('/products',require('./routes/product.route'))
app.use('/purchase',require('./routes/purchase.route'))
app.use('/subcategory',require('./routes/subcategory.route'))
app.use('/cart' , require('./routes/cart.route'))
app.use('/orders', require('./routes/order.route'))
app.use('/reports',require('./routes/reports.route'))

// Handle 404 - Route not found
app.use(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler Middleware (MUST be last)
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=> console.log(`🚀 Server Started at port ${PORT}`))
