import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        default: "admin",
        enum: ["admin", "super-admin"] 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    lastLogin: { 
        type: Date 
    },
    otp: { 
        type: String 
    },
    otpExpires: { 
        type: Date 
    }
}, { 
    collection: "admins",
    timestamps: true 
});

export default mongoose.model("Admin", adminSchema);