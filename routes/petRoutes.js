import express from 'express'
import { verifyToken } from '../middleware/auth.js'
import {
	createPet,
	getAllPets,
	getPet,
	updatePet,
	deletePet,
	petAction,
	sendToDoctor,
} from '../controllers/petController.js'
import { upload } from '../config/uploads.js'

const router = express.Router()

// CREATE Pet (owner)
router.post('/', verifyToken, upload.array('images', 5), createPet)

// GET all pets
router.get('/', verifyToken, getAllPets)

// GET single pet
router.get('/:id', verifyToken, getPet)

// UPDATE / DELETE Pet (owner only)
router.put('/:id', verifyToken, updatePet)
router.delete('/:id', verifyToken, deletePet)

// Pet actions (owner only)
router.put('/:id/action', verifyToken, petAction)

// Send pet to doctor (owner only)
router.put('/:id/send-doctor', verifyToken, sendToDoctor)

export default router
