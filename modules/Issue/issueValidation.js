import joi from "joi";
import {generalFields} from "../../middleware/validation.js";


export const borrowBookValidation = joi.object({
    bookId: generalFields.id.required(),
    description: joi.string().min(2).max(32).required(),
    day: joi.required(),
});

export const returnBookValidation = joi.object({
    issueId: generalFields.id.required(),
});