import { Router } from "express";
import { getCountries, saveCountries, updateCountries, deleteCountries } from '../../Controllers/Masters/CountriesController.js'
import { verify } from "../../Middleware/Masters/Countries.js";

const rutas = Router()

rutas.get('/api/countries',verify, getCountries)
rutas.get('/api/countries/:id',verify, getCountries)
rutas.post('/api/countries',verify, saveCountries)
rutas.put('/api/countries/:id',verify, updateCountries)
rutas.delete('/api/countries/:id',verify, deleteCountries)

export default rutas