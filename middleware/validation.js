import joi from 'joi'
import {Types} from 'mongoose'

const validateObjectId = (value, helper) => {
    return Types.ObjectId.isValid(value) ? true : helper.message('In-valid objectId');
};

//we dont use generalFields here
//we use in models.validation.js where we write each api shcema
export const generalFields = {
    email: joi.string().email({
        minDomainSegments: 2,
        maxDomainSegments: 4,
        tlds: { allow: ['com', 'net',] }
    }).required(),
    password: joi.string()/*.pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/))*/.required(),
    confirmationPassword: joi.string().valid(joi.ref('password')).required(),
    id: joi.string().custom(validateObjectId).required(),
    optionalId: joi.string().custom(validateObjectId),
    // phone:joi.array().items(
    //     joi.string().regex(/^(002|\+20)01?[0125][0-9]{8}$/)
    // ),
    phone: joi.string()/*.regex(/^(002|\+20)01?[0125][0-9]{8}$/)*/.required(),
    file: joi.object({
        size: joi.number().positive().required(),
        path: joi.string().required(),
        filename: joi.string().required(),
        destination: joi.string().required(),
        mimetype: joi.string().required(),
        encoding: joi.string().required(),
        originalname: joi.string().required(),
        fieldname: joi.string().required(),
    }).required(),
};

export const validation = (schema) => {
    return (req, res, next) => {
        const inputs = {...req.body, ...req.query, ...req.params};
        // if (req.user){
        //     inputs.userID = req.user._id ;
        //     inputs.useRole = req.user.role;
        // };

        if (req.file || req.files)
            inputs.file = req.file || req.files;

        let {error} = schema.validate(inputs, { abortEarly: false });

        if (error) {
            let validationResult = error.details.map(detail => detail.message)
            return res.status(400).json({message: "Validation Error",Errors: validationResult})
        }
        else {
            return next();
        }
    };
};
export default validation;