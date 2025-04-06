import { Router } from "express";
import { getOptions, saveOptions, updateOptions, deleteOptions } from '../../Controllers/Securities/OptionsController.js'
import { verify } from "../../Middleware/Securities/Options.js";

const rutas = Router()

rutas.get('/api/options',verify, getOptions)
rutas.get('/api/options/:id',verify, getOptions)
rutas.post('/api/options',verify, saveOptions)
rutas.put('/api/options/:id',verify, updateOptions)
rutas.delete('/api/options/:id',verify, deleteOptions)

export default rutas