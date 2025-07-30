import mongoose from 'mongoose';

const toolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['כלים חשמליים', 'כלים ידניים', 'כלי מדידה', 'כלים נטענים']
    },
    brand: {
        type: String,
        trim: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    notes: {
        type: String,
        trim: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    borrowedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    borrowedDate: {
        type: Date,
        default: null
    },
    

    status: {
        type: String,
        enum: ['available', 'pending_borrow', 'borrowed', 'pending_return', 'returned'],
        default: 'available'
    },
    borrowRequest: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        requestDate: {
            type: Date,
            default: null
        }
    },
    returnRequest: {
        requestDate: {
            type: Date,
            default: null
        }
    }
}, {
    timestamps: true
});


toolSchema.index({ owner: 1 });
toolSchema.index({ isAvailable: 1 });
toolSchema.index({ category: 1 });

export default mongoose.model('Tool', toolSchema);
