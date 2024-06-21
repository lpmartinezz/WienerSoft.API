import { config } from "dotenv";
config();
//Puerto de app
export const PORT = process.env.PORT;
//BD Mongo
export const DB_HOST = process.env.DB_HOST;
export const DB_NAME = process.env.DB_NAME;
export const DB_PORT = process.env.DB_PORT;
export const MONGODB_URI = process.env.MONGODB_URI;