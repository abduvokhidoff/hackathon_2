import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Verify JWT token
export const verifyToken = async (req, res, next) => {
	const token = req.header('x-auth-token')
	if (!token)
		return res.status(401).json({ msg: 'No token, authorization denied' })

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		req.user = decoded

		const user = await User.findById(decoded.id)
		if (!user) return res.status(401).json({ msg: 'User not found' })

		req.user.role = user.role
		req.user.id = user._id.toString()
		next()
	} catch (err) {
		res.status(401).json({ msg: 'Token is not valid' })
	}
}

// Admin only
export const isAdmin = (req, res, next) => {
	if (req.user.role !== 'admin')
		return res.status(403).json({ msg: 'Access denied' })
	next()
}

// Doctor only
export const isDoctor = (req, res, next) => {
	if (req.user.role !== 'doctor' && req.user.role !== 'admin')
		return res.status(403).json({ msg: 'Access denied' })
	next()
}

// Owner (pet owner) or Admin
export const isOwnerOrAdmin = (req, res, next) => {
	if (req.user.role === 'admin' || req.user.id === req.params.id) return next()
	return res.status(403).json({ msg: 'Access denied' })
}
