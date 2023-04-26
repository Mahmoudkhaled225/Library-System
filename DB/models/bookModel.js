import mongoose from "mongoose"

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        required: true,
    },
    authur: {
        type: String,
        required: true,
    },
    borrowedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    status: {
        type: String,
        default: "available",
        enum: ["available", "borrowed"]
    },
    book_pic: {
        type: String
    },
}, {
    timestamps: true
})

export const bookModel = mongoose.model("Book",bookSchema)

