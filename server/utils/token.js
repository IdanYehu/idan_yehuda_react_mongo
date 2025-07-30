import  jwt from 'jsonwebtoken';
import {jwtSecret} from '../config/index.js';
import User from '../models/user.model.js';

export const createToken = async (payload, options) => {
    return await jwt.sign(payload, jwtSecret, options);
};

export const verifyToken = async (token) => {
    try {
        return await jwt.verify(token, jwtSecret);
    } catch (error) {
        throw error;
    }
};

// Auth middleware
export const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'אין טוקן, הגישה נדחתה' });
        }

        const decoded = await verifyToken(token);
        const userId = decoded.id || decoded.userId; // תמיכה בשני הפורמטים
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(401).json({ message: 'משתמש לא נמצא' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'טוקן לא תקין' });
    }
};
