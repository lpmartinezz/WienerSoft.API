import { config } from "dotenv";
config();
//Puerto de app
export const PORT = process.env.PORT;
//BD Mongo
export const DB_HOST = process.env.DB_HOST;
export const DB_NAME = process.env.DB_NAME;
export const DB_PORT = process.env.DB_PORT;
export const MONGODB_URI = process.env.MONGODB_URI;
//JWT
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES = process.env.JWT_EXPIRES;
//Email
export const EMAIL = process.env.EMAIL;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
