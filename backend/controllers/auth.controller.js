import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateVerificationToken, generateTokenExpiresAt, generateTokenAndSetCookie, generatePasswordResetToken } from "../utils/generateToken.js";
import { sendPasswordResetEmail, sendPasswordResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";

export const checkAuth = async (req,res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if(!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Error checking authentication:", error);
        res.status(500).json({ success: false, message: "Error occurred while checking authentication" });
    }
}

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if(!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Name, email, and password are required" });
        }
        const userAlreadyExists = await User.findOne({ email });
        if(userAlreadyExists) {
            return res.status(400).json({ success: false, message: "User with this email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = generateVerificationToken(); // Implement this function to generate a unique verification token
        const verificationTokenExpiresAt = generateTokenExpiresAt(); // Implement this function to set an expiration time for the token
        const user = new User({
            name,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt
        });
        await user.save();

        // jwt token generation and email sending logic can be added here
        generateTokenAndSetCookie(res, user._id); // Implement this function to generate a JWT token and set it in the response cookie

        await sendVerificationEmail(user.email, verificationToken); // Implement this function to send a verification email to the user with the token

        res.status(201).json({ success: true, message: "User created successfully", user: { ...user._doc, password: undefined } });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error occurred while signing up" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if(!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        generateTokenAndSetCookie(res, user._id); // Implement this function to generate a JWT token and set it in the response cookie

        user.lastLogin = Date.now();
        await user.save();

        res.status(200).json({ success: true, message: "Logged in successfully", user: { ...user._doc, password: undefined } });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error occurred while logging in" });
    }
};

export const logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
}

export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        if(!code) {
            return res.status(400).json({ success: false, message: "Verification code is required" });
        }
        const user = await User.findOne({ verificationToken: code, verificationTokenExpiresAt: { $gt: Date.now() } });
        if(!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name); // Implement this function to send a welcome email to the user after successful verification

        res.status(200).json({ success: true, message: "Email verified successfully", user: { ...user._doc, password: undefined } });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error occurred while verifying email" });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        if(!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        const user = await User.findOne({email });
        if(!user) {
            return res.status(400).json({ success: false, message: "User with this email does not exist" });
        }

        const passwordResetToken = generatePasswordResetToken(); // Implement this function to generate a secure password reset token
        const passwordResetTokenExpiresAt = generateTokenExpiresAt(); // Implement this function to set an expiration time for the token

        // bu kısım yerine Atomic Update Yapacağız
        // user.resetPasswordToken = passwordResetToken;
        // user.resetPasswordExpiresAt = passwordResetTokenExpiresAt;
        // await user.save();

        await User.findByIdAndUpdate(user._id, {
            resetPasswordToken: passwordResetToken,
            resetPasswordExpiresAt: passwordResetTokenExpiresAt,
        })

        // Implement sendPasswordResetEmail function to send an email to the user with the password reset token
        await sendPasswordResetEmail(user.email, passwordResetToken);

        res.status(200).json({ success: true, message: "Password reset email sent successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error occurred while processing forgot password request" });
    }
};

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    
    try {
        if(!token || !newPassword) {
            return res.status(400).json({ success: false, message: "Token and new password are required" });
        }
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpiresAt: { $gt: Date.now() } });
        if(!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired password reset token" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendPasswordResetSuccessEmail(user.email); // Implement this function to send a confirmation email to the user after successful password reset
        res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error occurred while resetting password" });
    }
}