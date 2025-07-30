
// Import DAL (Data Access Layer) modules
import { authDal } from "../dal/auth.dal.js";
import { userDal } from "../dal/user.dal.js";

// Import utility functions
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import { createToken } from "../utils/token.js";

/**
 * Authentication Service
 * Handles user registration and login functionality
 */
export const authService = {
    /**
     * Register a new user and generate authentication token
     * @param {Object} user - User data for registration
     * @returns {Object} Registration result with token
     */
    registerUser: async (userData) => {
        try {
 
            // Hash the password before storing
            delete userData.confirmPassword;
            const registerUserData = {
                ...userData,
                password: await hashPassword(userData.password),
            };

            // Register the user in the database
            const user = await authDal.registerUser(registerUserData);

            console.log('Service: User registered successfully', user);
            console.log('Service: Creating Token');

            // Generate authentication token
            const token = await createToken({
                id: user._id, // שונה מ-userId ל-id
                email: user.email,
            }, { expiresIn: '1d' });

            console.log('Service: Token created successfully', token);


            const registeredUser = user.toObject();
            delete registeredUser.password;

            return {
                success: true,
                user: registeredUser,
                token: token,
            };
        } catch (e) {
            throw e;
        }
    },

    /**
     * Authenticate a user by email and password
     * @param {string} email - User's email
     * @param {string} password - User's password
     * @returns {Object} Login result with user data and token
     */
    logUser: async (email, password) => {
        try {
            console.log('Service: Started logging in user', email);

            // Get user by email
            const user = await userDal.getUserByEmail(email, true);

            console.log('Service: User fetched from database', user);

            // Validate user exists and password is provided
            if (!user || !password) {
                const error = new Error('Invalid email or password');
                error.status = 401; // Unauthorized
                throw error;
            }

            // Verify password matches
            const isPasswordValid = await comparePassword(password, user.password);
          
            if (!isPasswordValid) {
                console.log('Service: Invalid password for user', email);
                const error = new Error('Invalid email or password');
                error.status = 401; // Unauthorized
                throw error;
            }

            // Generate authentication token
            const token = await createToken(
                { id: user._id, email: user.email }, // שונה מ-userId ל-id
                { expiresIn: '1d' }
            );
            console.log('Service: Token generated successfully', token);

            // Convert user to plain object and remove password

            delete user.password; 

            console.log('User found', user);
            // Return successful login response
            return {
                success: true,
                token: token,
                user: user, 
                
            };
        } catch (e) {
            throw e;
        }
    }
};


