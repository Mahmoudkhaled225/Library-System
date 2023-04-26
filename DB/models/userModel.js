import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,
    //    unique: true
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 18
    },
    phone: {
        type: Number,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
        enum: [true, false]
    },
    confirmed: {
        type: Boolean,
        default: false,
        enum: [true, false]
    },
    profile_pic: {
        type: String
    }
}, {
    timestamps: true
})

export const userModel = mongoose.model("User",userSchema)