import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.MAILTRAP_API_TOKEN;

export const  mailtrapClient = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Authentication Service",
};

// we just send email to this address because of mailtrap's free plan, you can add more recipients in your mailtrap inbox settings
/*
const recipients = [
  {
    email: "cihanbas.api@gmail.com",
  }
];
*/

// Test email sending
/*
mailtrapClient
  .send({
    from: sender,
    to: recipients,
    subject: "You are awesome!",
    text: "Congrats for sending test email with Mailtrap!",
    category: "Integration Test",
  })
  .then(console.log, console.error);
*/