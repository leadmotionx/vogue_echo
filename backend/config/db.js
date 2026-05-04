const mongoose = require('mongoose');

// Cache the connection to reuse across serverless function calls
let cachedConnection = null;

const connectDB = async () => {
    if (cachedConnection) {
        console.log('✅ Using cached MongoDB connection');
        return cachedConnection;
    }

    try {
        console.log('[DEBUG] Connecting to MongoDB...');
        
        // Disable mongoose buffering to prevent "buffering timed out" errors
        // It's better to fail fast than wait indefinitely
        mongoose.set('bufferCommands', false);

        const connection = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'test',
            serverSelectionTimeoutMS: 20000, // Wait up to 20s for initial connection
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });

        cachedConnection = connection;
        console.log('✅ MongoDB connected successfully');
        
        return cachedConnection;
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        // Don't throw, let the app handle the failure gracefully
    }
};

// Monitor connection events
mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB Event Error:', err.message);
    cachedConnection = null; // Clear cache on error so we try to reconnect
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
    cachedConnection = null;
});

module.exports = connectDB;
