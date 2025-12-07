import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { isEmailValid, isPasswordValid } from '../utils/validators.js'

export const register = async (req, res) => {
	try {
		const { name, email, password, role, phone } = req.body
		const existingUser = await User.findOne({ email })
		if (existingUser)
			return res.status(400).json({ msg: 'User already exists' })

		const hashedPassword = await bcrypt.hash(password, 10)

		const newUser = new User({
			name,
			email,
			password: hashedPassword,
			role,
			phone, // <-- store phone
		})

		await newUser.save()

		const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
			expiresIn: '7d',
		})
		res.json({ token, user: newUser })
	} catch (err) {
		res.status(500).json({ msg: 'Server error', error: err.message })
	}
}


export const login = async (req, res) => {
	try {
		const { email, password } = req.body
		const user = await User.findOne({ email })
		if (!user) return res.status(400).json({ msg: 'User does not exist' })

		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' })

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: '1h',
		})
		res.json({
			token,
			user: { id: user._id, name: user.name, email, role: user.role },
		})
	} catch (err) {
		res.status(500).json({ msg: 'Server error' })
	}
}
