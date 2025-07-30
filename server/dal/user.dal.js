
import User from "../models/user.model.js";

export const userDal = {
    getUsers: async (queries) => {
        try {
            const filters = {};
            if (queries.age) {
                filters.age = { $gte: parseInt(queries.age) };
            }
            if (queries.city) {
                filters.city = { $regex: new RegExp(queries.city, 'i') };
            }

            return await User.find(filters);

        } catch (e) {
            throw e
        }
    },
    getUserById: async (userId) => {
        try {
            return await User.findById(userId);
        } catch (e) {
            throw e
        }
    },
    getUserByEmail: async (email, isFromLogin = false) => {
        try {
            console.log('DAL: Fetching user by email', email);
            if (isFromLogin)
                return await User.findOne({ email: email }).select('+password').lean();
            return await User.findOne({ email: email }).lean();
        } catch (e) {
            throw e
        }
    },
    updateUserById: async (userId, dataToUpdate) => {
        try {
            console.log('DAL: Started updating user', userId, dataToUpdate);
            return await User.findByIdAndUpdate(
                userId,
                dataToUpdate,
                { new: true }
            );
        } catch (e) {
            throw e
        }
    },
    deleteUserById: async (userId) => {
        try {
            return await User.findByIdAndDelete(userId);
        } catch (e) {
            throw e
        }
    },

}

