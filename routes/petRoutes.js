import express from 'express'
import { verifyToken, isAdmin, isDoctor } from '../middleware/auth.js'
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

// User creates pets
router.post('/', verifyToken, upload.array('images', 5), createPet)

// List all pets (anyone)
router.get('/', verifyToken, getAllPets)

// View single pet
router.get('/:id', verifyToken, getPet)

// Update/Delete: user can update own pet, admin can update/delete all
router.put('/:id', verifyToken, updatePet)
router.delete('/:id', verifyToken, deletePet)

// Pet actions: only doctor or admin can accept/review
router.put('/:id/action', verifyToken, isDoctor, petAction)
router.put('/:id/send-doctor', verifyToken, isAdmin, sendToDoctor)

export default router
