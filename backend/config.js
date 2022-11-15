import dotenv from 'dotenv';

dotenv.config();

export default {
  PORT: process.env.PORT || 5000,
  MONGODB_URL: process.env.MONGODB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
  EMAIL_HOST:process.env.EMAIL_HOST,
  EMAIL_PORT:process.env.EMAIL_PORT,
  EMAIL_HOST_USERNAME:process.env.EMAIL_HOST_USERNAME,
  EMAIL_HOST_PASSWORD:process.env.EMAIL_HOST_PASSWORD
};
