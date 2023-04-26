import joi from "joi";
import {generalFields} from "../../middleware/validation.js";


export const addBookValidation = joi.object({
    title: joi.string().min(2).max(32).required().alphanum(),
    tag: joi.string().min(2).max(32).required().alphanum(),
    authur: joi.string().min(2).max(32).required().alphanum(),
    file: generalFields.file,
});

export const searchBookByNameAllConditionsValidation = joi.object({
    title: joi.string().min(2).max(32).required(),
});