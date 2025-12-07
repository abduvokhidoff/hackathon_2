import Pet from '../models/Pet.js'

// CRUD
export const createPet = async (req, res) => {
	try {
		const { name, type, age, price } = req.body
		const images = req.files ? req.files.map(file => file.path) : []

		const newPet = new Pet({
			name,
			type,
			age,
			price,
			owner: req.user.id,
			images,
		})
		await newPet.save()
		res.json(newPet)
	} catch (err) {
		res.status(500).json({ msg: 'Server error', error: err.message })
	}
}


export const getAllPets = async (req, res) => {
	try {
		const pets = await Pet.find()
			.populate('owner', 'name email')
			.populate('doctor', 'name email')
		res.json(pets)
	} catch (err) {
		res.status(500).json({ msg: 'Server error' })
	}
}

export const getPet = async (req, res) => {
	try {
		const pet = await Pet.findById(req.params.id)
			.populate('owner', 'name email')
			.populate('doctor', 'name email')
		if (!pet) return res.status(404).json({ msg: 'Pet not found' })
		res.json(pet)
	} catch (err) {
		res.status(500).json({ msg: 'Server error' })
	}
}

export const updatePet = async (req, res) => {
	try {
		const pet = await Pet.findById(req.params.id)
		if (!pet) return res.status(404).json({ msg: 'Pet not found' })
		if (pet.owner.toString() !== req.user.id)
			return res.status(401).json({ msg: 'Not authorized' })

		const updatedPet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		})
		res.json(updatedPet)
	} catch (err) {
		res.status(500).json({ msg: 'Server error' })
	}
}

export const deletePet = async (req, res) => {
	try {
		const pet = await Pet.findById(req.params.id)
		if (!pet) return res.status(404).json({ msg: 'Pet not found' })
		if (pet.owner.toString() !== req.user.id)
			return res.status(401).json({ msg: 'Not authorized' })

		await Pet.findByIdAndDelete(req.params.id)
		res.json({ msg: 'Pet deleted' })
	} catch (err) {
		res.status(500).json({ msg: 'Server error' })
	}
}

// Actions: sell, rent, orphanage, memory
export const petAction = async (req, res) => {
	try {
		const { action } = req.body
		const pet = await Pet.findById(req.params.id)
		if (!pet) return res.status(404).json({ msg: 'Pet not found' })

		if (pet.owner.toString() !== req.user.id && action !== 'memory')
			return res.status(401).json({ msg: 'Not authorized' })

		switch (action) {
			case 'sell':
				pet.status = 'sold'
				break
			case 'rent':
				pet.status = 'rented'
				break
			case 'orphanage':
				pet.isOrphanage = true
				break
			case 'memory':
				pet.status = 'memory'
				break
			default:
				return res.status(400).json({ msg: 'Invalid action' })
		}

		await pet.save()
		res.json(pet)
	} catch (err) {
		res.status(500).json({ msg: 'Server error' })
	}
}

// Send pet to doctor
export const sendToDoctor = async (req, res) => {
	try {
		const { doctorId } = req.body
		const pet = await Pet.findById(req.params.id)
		if (!pet) return res.status(404).json({ msg: 'Pet not found' })
		if (pet.owner.toString() !== req.user.id)
			return res.status(401).json({ msg: 'Not authorized' })

		pet.isDoctor = true
		pet.doctor = doctorId
		await pet.save()

		res.json(pet)
	} catch (err) {
		res.status(500).json({ msg: 'Server error' })
	}
}
