import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailtemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    // Implement the logic to send a verification email using the Mailtrap client
    const recipients = [
        {
            email: "cihanbas.api@gmail.com", // When we have a real domain and have a acount with mailtrap, we can replace this with the actual recipient's email address
        }
    ];

    const htmlContent = VERIFICATION_EMAIL_TEMPLATE
                            .replace("{verificationCode}", verificationToken)
                            .replace("{userEmail}", email);
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            subject: "Email Verification",
            html: htmlContent,
            category: "Verification Email",
        });
        console.log("Verification email sent successfully:", response);
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

export const sendWelcomeEmail = async (email, name) => {
    const recipients = [
        {
            email: "cihanbas.api@gmail.com", // When we have a real domain and have a acount with mailtrap, we can replace this with the actual recipient's email address
        }
    ];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            template_uuid: "ff959912-0769-4bb4-bac9-9ba1ebeaf617",
            template_variables: {
                "name": name,
            },
        });
        console.log("Welcome email sent successfully:", response);
    } catch (error) {
        console.error("Error sending welcome email:", error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

export const sendPasswordResetEmail = async (email, resetToken) => {
    const recipients = [
        {
            email: "cihanbas.api@gmail.com", // When we have a real domain and have a acount with mailtrap, we can replace this with the actual recipient's email address
        }
    ];
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`; // Replace with your actual frontend URL for password reset
    const htmlContent = PASSWORD_RESET_REQUEST_TEMPLATE
                            .replace("{userEmail}", email)
                            .replace("{resetURL}", resetURL);
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            subject: "Password Reset Request",
            html: htmlContent,
            category: "Password Reset",
        });
        console.log("Password reset email sent successfully:", response);
    } catch (error) {
        console.error("Error sending password reset email:", error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

export const sendPasswordResetSuccessEmail = async (email) => {
    const recipients = [
        {
            email: "cihanbas.api@gmail.com", // When we have a real domain and have a acount with mailtrap, we can replace this with the actual recipient's email address
        }
    ];
    const htmlContent = PASSWORD_RESET_SUCCESS_TEMPLATE
                            .replace("{userEmail}", email);
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            subject: "Password Reset Successful",
            html: htmlContent,
            category: "Password Reset",
        });
        console.log("Password reset success email sent successfully:", response);
    } catch (error) {
        console.error("Error sending password reset success email:", error);
        throw error; // Rethrow the error to be handled in the controller
    }
}