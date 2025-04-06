import { Router } from "express";
import  { getStores, saveStores, updateStores, deleteStores } from '../../Controllers/Stores/StoresController.js'
import { verify } from "../../Middleware/Stores/Stores.js";

const rutas = Router()

rutas.get('/api/stores',verify, getStores)
rutas.get('/api/stores/:id',verify, getStores)
rutas.post('/api/stores',verify, saveStores)
rutas.put('/api/stores/:id',verify, saveStores)
rutas.delete('/api/stores/:id',verify, deleteStores)

export default rutas