import express from 'express'
import { verifyToken, isAdmin, isOwnerOrAdmin } from '../middleware/auth.js'
import {
	getUsers,
	getDoctors,
	getUser,
	updateUser,
	deleteUser,
} from '../controllers/userController.js'

const router = express.Router()

// Admin can see all users
router.get('/', verifyToken, isAdmin, getUsers)

// Any logged-in user can see doctors
router.get('/doctors', verifyToken, getDoctors)

// Owner or admin can view/edit profile
router.get('/:id', verifyToken, isOwnerOrAdmin, getUser)
router.put('/:id', verifyToken, isOwnerOrAdmin, updateUser)

// Only admin can delete users
router.delete('/:id', verifyToken, isAdmin, deleteUser)

export default router
