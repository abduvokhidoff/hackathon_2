import User from '../models/User.js'
import bcrypt from 'bcryptjs'

// Get all users (admin only)
export const getUsers = async (req, res) => {
	try {
		const users = await User.find().select('-password')
		res.json(users)
	} catch (err) {
		res.status(500).json({ msg: err.message })
	}
}

// Get all doctors
export const getDoctors = async (req, res) => {
	try {
		const doctors = await User.find({ role: 'doctor' }).select('-password')
		res.json(doctors)
	} catch (err) {
		res.status(500).json({ msg: err.message })
	}
}

// Get user by ID
export const getUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id).select('-password')
		if (!user) return res.status(404).json({ msg: 'User not found' })
		res.json(user)
	} catch (err) {
		res.status(500).json({ msg: err.message })
	}
}

// Update user
export const updateUser = async (req, res) => {
	try {
		const { name, email, password, role, phone } = req.body
		const user = await User.findById(req.params.id)
		if (!user) return res.status(404).json({ msg: 'User not found' })

		user.name = name || user.name
		user.email = email || user.email
		user.role = role || user.role
		user.phone = phone || user.phone

		if (password) {
			const salt = await bcrypt.genSalt(10)
			user.password = await bcrypt.hash(password, salt)
		}

		await user.save()
		res.json(user)
	} catch (err) {
		res.status(500).json({ msg: err.message })
	}
}

// Delete user
export const deleteUser = async (req, res) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id)
		if (!user) return res.status(404).json({ msg: 'User not found' })
		res.json({ msg: 'User deleted successfully' })
	} catch (err) {
		res.status(500).json({ msg: err.message })
	}
}
