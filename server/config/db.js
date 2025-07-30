import mongoose from 'mongoose';
import { mongoUri } from './index.js';
export const connectToDatabase = async () => {
    try {
        console.log('Connecting to MongoDB.');
        await mongoose.connect(mongoUri);

        console.log('Connected to MongoDB successfully');

    } catch (err) {
        console.error('MongoDB connection error:', err.message);
    }
}
