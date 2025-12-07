import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDB } from './config/db.js'

// Routes
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import petRoutes from './routes/petRoutes.js'

dotenv.config()

// MongoDB ga ulanish
connectDB()

const app = express()

// Middleware
app.use(cors()) // Frontend bilan ishlash uchun
app.use(express.json()) // JSON body parser
app.use(express.urlencoded({ extended: true })) // Form data parser

// Static files (rasmlar uchun)
app.use('/uploads', express.static('uploads'))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/pets', petRoutes)

// Test route
app.get('/', (req, res) => {
	res.send('Pet Tashkent API is running...')
})

// Port
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
