import { Router } from "express";
import  { getDepartments, saveDepartments, updateDepartments, deleteDepartments } from '../Controllers/DepartmentsController.js'
import { verify } from "../Middleware/Departments.js";

const rutas = Router()

rutas.get('/api/departments',verify, getDepartments)
rutas.get('/api/departments/:id',verify, getDepartments)
rutas.post('/api/departments',verify, saveDepartments)
rutas.put('/api/departments/:id',verify, updateDepartments)
rutas.delete('/api/departments/:id',verify, deleteDepartments)

export default rutas