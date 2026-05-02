import jwt from "jsonwebtoken";
import crypto from "crypto";
import e from "express";

export const generateVerificationToken = () => {
    // 100000 ile 999999 arasında kesinlikle 6 haneli bir string döndürür
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit token
};

export const generateTokenExpiresAt = () => {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Set token to expire in 1 hour
    return expiresAt;

    // return Date.now() + 3600000; // Token expires in 1 hour
};

export const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d" // Token expires in 7 days
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Set secure flag in production
        sameSite: "strict", // Prevent CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie expires in 7 days
    });
    
    return token;
}

export const generatePasswordResetToken = () => {
    return crypto.randomBytes(20).toString("hex"); // Generate a secure password reset token
};