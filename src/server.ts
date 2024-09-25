import express from 'express'
import dotenv from 'dotenv'
import cors from "cors";
import { connectDB } from './config/db';
import projectRoutes from './routes/projectRoutes'
import authRoutes from './routes/authRoutes'
import { corsConfig } from './config/cors';

dotenv.config(); // Obtiene las variables de entorno

connectDB(); // ejecutar conección

const app = express();

// Habilitar cors
app.use(cors(corsConfig))

// Pemitir que neustras apis puedan leer el tipo json
app.use(express.json())

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)

export default app;