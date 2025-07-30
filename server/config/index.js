import 'dotenv/config';



export const port = process.env.PORT || 5002;
export const mongoUri = process.env.MONGODB_URI || "mongodb://localhost";
export const jwtSecret = process.env.JWT_SECRET