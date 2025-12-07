import mongoose from 'mongoose'

export const connectDB = async () => {
	try {
		// Mongoose 7+ da options kerak emas
		await mongoose.connect(process.env.MONGO_URI)
		console.log('MongoDB connected')
	} catch (err) {
		console.error('MongoDB connection error:', err.message)
		process.exit(1)
	}
}
