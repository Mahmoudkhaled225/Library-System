import joi from "joi";
import {generalFields} from "../../middleware/validation.js";


export const signUpValidation = joi.object({
    name: joi.string().min(2).max(32).required().alphanum(),
    email: generalFields.email,
    password: generalFields.password,
    confirmtionPassword: generalFields.confirmationPassword,
    age: joi.number().min(18).required(),
    phone: generalFields.phone,
    file: generalFields.file,
});

export const logInValidation = joi.object({
    email: generalFields.email,
    password: generalFields.password,
});

export const changePasswordValidation = joi.object({
    newpass: generalFields.password,
    cpass: generalFields.password,
});

export const deleteUserValidation =joi.object({
    _id :generalFields.id,
});

export const softDeleteUserValidation =joi.object({
    _id :generalFields.id,
});

export const updateUserValidation =joi.object({
    name: joi.string().min(2).max(32).required().alphanum(),
    phone: generalFields.phone,
});