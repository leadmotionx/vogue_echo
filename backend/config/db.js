const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('✅ MongoDB connected to database: ' + mongoose.connection.name);
        });
        
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB Connection Error:', err.message);
        });

        // Strict connection options
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'test',
            serverSelectionTimeoutMS: 5000, // 5 seconds timeout
        });
        
    } catch (error) {
        console.error('❌ MongoDB Initial Connection Failed:', error.message);
    }
};

module.exports = connectDB;
