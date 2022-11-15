// const express = require("express");
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import conectarDB from './config/db.js';
import usuarioRoutes from './routes/usuarioRoutes.js'
import proyectoRoutes from './routes/proyectoRoutes.js'
import tareaRoutes from './routes/tareaRoutes.js'

const app = express();
app.use(express.json()) //necesario para procesar el body del json

dotenv.config();

conectarDB()

// configurar cors
const whitelist = [process.env.FRONTEND_URL]
const corsOptions = {
    origin: function(origin, callback) {
        // console.log(origin)
        if(whitelist.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Error de cors'))
        }
    }
}
app.use(cors(corsOptions))

// Routing
// use hace todos
app.use('/api/usuarios', usuarioRoutes)
app.use('/api/proyectos', proyectoRoutes)
app.use('/api/tareas', tareaRoutes)


const PORT = process.env.PORT || 4000;

const servidor = app.listen(PORT, () => {
    console.log(`servidor corriendo en el puerto ${PORT}`)
})

// socket.io





