import multer from 'multer'
import path from 'path'

// Storage config
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/')
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname))
	},
})

// File filter (faqat rasm)
const fileFilter = (req, file, cb) => {
	const allowedTypes = /jpeg|jpg|png|gif/
	const extname = allowedTypes.test(
		path.extname(file.originalname).toLowerCase()
	)
	const mimetype = allowedTypes.test(file.mimetype)
	if (mimetype && extname) {
		return cb(null, true)
	} else {
		cb('Error: Images only!')
	}
}

export const upload = multer({
	storage,
	fileFilter,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
})
