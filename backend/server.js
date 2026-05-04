const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const adminRouter = require('./routes/adminRoute');
const userRouter = require('./routes/userRoute');
const productRouter = require('./routes/productRoute');
const orderRouter = require('./routes/orderRoute');
const collectionRouter = require('./routes/collectionRoute');
const subscriberRouter = require('./routes/subscriberRoute');
const promoRouter = require('./routes/promoRoute');
const dashboardRouter = require('./routes/dashboardRoute');

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Database connection
connectDB();

// API routes
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/order', orderRouter);
app.use('/api/collection', collectionRouter);
app.use('/api/subscriber', subscriberRouter);
app.use('/api/promo', promoRouter);
app.use('/api/dashboard', dashboardRouter);

app.get('/', (req, res) => {
    res.send('Vogue Echo API is running...');
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
