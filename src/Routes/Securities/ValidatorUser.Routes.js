import { Router } from "express";
import  { sendCodeToEmail } from '../../Controllers/Securities/ValidatorUserController.js'
import { verify } from "../Middleware/Securities/ValidatorUser.js";

const rutas = Router()

rutas.post('/api/validatoruser/:email', emailUser)