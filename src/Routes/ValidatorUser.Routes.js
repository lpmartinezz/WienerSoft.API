import { Router } from "express";
import  { sendCodeToEmail } from '../Controllers/ValidatorUserController.js'
import { verify } from "../Middleware/ValidatorUser.js";

const rutas = Router()

rutas.post('/api/validatoruser/:email', emailUser)