import mongoose from "mongoose"

const issueSchema = mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    book: {
        type: mongoose.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    issueDate: {
        type: Date,
        default: Date.now
    },
    returnDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

export const issueModel = mongoose.model("Issue", issueSchema)