import mongoose from 'mongoose';
import validator from 'validator';


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
            lowercase: true,
            trim: true,
            match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address"],
        },
        city: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            set: value => value.replace(/\s+/g, '') 
        },
        age: {
            type: Number,
            required: true,
            min: [18, "Age must be more then 18"],
            max: [120, "Age must be less than 120"],
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: [6, "Password must be at least 6 characters long"],
            select: false, 
        },
    }, {
    strict: true,
    timestamps: true,
}
)

export default mongoose.model('User', userSchema, 'users'); 


