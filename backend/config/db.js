const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('✅ MongoDB connected to database: ' + mongoose.connection.name);
        });
        
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB Connection Error:', err.message);
        });

        console.log('[DEBUG] Checking MONGODB_URI...');
        if (!process.env.MONGODB_URI) {
            console.error('❌ MONGODB_URI is UNDEFINED in process.env');
            console.log('[DEBUG] Available Environment Keys:', Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('PASS')));
        }

        // Strict connection options
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'test',
            serverSelectionTimeoutMS: 5000, 
        });
        
    } catch (error) {
        console.error('❌ MongoDB Initial Connection Failed:', error.message);
    }
};

module.exports = connectDB;
