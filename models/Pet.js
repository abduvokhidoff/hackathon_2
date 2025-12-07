import mongoose from 'mongoose'

const petSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		type: { type: String, required: true },
		age: { type: Number, required: true },
		owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		doctor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			default: null,
		},
		status: { type: String, default: 'available' },
		price: { type: Number, default: 0 },
		isDoctor: { type: Boolean, default: false },
		isOrphanage: { type: Boolean, default: false },
		images: [{ type: String }],
	},
	{ timestamps: true }
)


export default mongoose.model('Pet', petSchema)
