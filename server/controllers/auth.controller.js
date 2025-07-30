import { authService } from "../services/auth.service.js";




export const registerUser = async (req, res) => {
    const user = req.body
    const result = await authService.registerUser(user);
    console.log("User registration result:", result);
    
    if(result.success) {
        return result;
    } else {
        throw new Error(result.error || 'Registration failed');
    }
}
export const logUser = async (req, res) => {
    console.log("Logging in user with email:", req.body.email);
    
    const { email, password } = req.body
    const result = await authService.logUser(email, password);
    console.log("User login result:", result);
    
    if(result.success) {
        return result;
    } else {
        throw new Error(result.error || 'Login failed');
    }
}
