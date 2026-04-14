import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {    
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },

}, { timestamps: true });


userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

// Method to compare password for login
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
};

export const User = mongoose.model('User', userSchema);
