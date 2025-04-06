import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import mongoose from 'mongoose'
//import {DB_HOST, DB_NAME, DB_PORT} from './config'
//Masters
import rutasCountries from './Routes/Masters/Countries.Routes.js'
import rutasDepartments from './Routes/Masters/Departments.Routes.js'
import rutaProvinces from './Routes/Masters/Provinces.Routes.js'
import rutaDistricts from './Routes/Masters/Districts.Routes.js'
import rutaMasters from './Routes/Masters/Masters.Routes.js'


//Securities
import rutasOptions from './Routes/Securities/Options.Routes.js'
import rutasProfiles from './Routes/Securities/Profiles.Routes.js'
import rutasOptionsProfiles from './Routes/Securities/OptionsProfiles.Routes.js'
import rutasUsers from './Routes/Securities/Users.Routes.js'

//Stores
import rutaStores from './Routes/Stores/Stores.Routes.js'
import rutaProducts from './Routes/Stores/Products.Routes.js'

import { MONGODB_URI } from './config.js'
import { PORT } from './config.js'

//const conexion = "mongodb+srv://WienerSoftUser:Y5AMquw2K6K3m7og@clusterwienersoft.sajmzpl.mongodb.net/wienersoftDB?retryWrites=true&w=majority"
//mongoose.connect(conexion).then()

// mongodb connection
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas. Port:" + PORT))
  .catch((error) => console.error(error));

// server listening
//app.listen(port, () => console.log("Server listening to", port));

const app = express()
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.static('public'))
//app.get('/', (req, res) => {res.send('Hola Mundo')})
app.use(rutasUsers)
app.use(rutasProfiles)
app.use(rutasOptions)
app.use(rutasOptionsProfiles)
app.use(rutasCountries)
app.use(rutasDepartments)
app.use(rutaProvinces)
app.use(rutaDistricts)
app.use(rutaMasters)
app.use(rutaStores)

app.use( (req,res) => {
    res.status(400).json({status:false, errors: 'Not found'})
})

export default app