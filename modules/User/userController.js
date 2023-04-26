import {userModel} from "../../DB/models/userModel.js";
import {hashFunction} from "../../utiles/generateHash.js";
import {sendEmail} from "../../services/sendMail.js";
import {tokenFunction} from "../../utiles/createToken.js";
import {compareFuncion} from "../../utiles/compareHash.js";
import {alter} from "../../utiles/alter.js";

/**
 * @desc      user register
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @returns   { JSON } - A JSON object representing the type, message
 * @route   POST /user/signup
 * @access  Public
 *
 */
export const signUp = async (req, res) => {
    (!req.file) && new Error("you should upload a user image");
    const {name, email, password, confirmtionPassword, age, phone } = req.body;
    (!await userModel.findOne({email:req.email,confirmed:true}))? new Error("User already exist and loged ")
        :new Error("User already exist and not loged and need to be confirmed by clicking on the link in the mail which i dont know how to send it to you so i will ask anas about it");

    const hashedPass = hashFunction({payload: req.body.password});
    const newUser = new userModel({name:req.body.name, email:req.body.email, password: hashedPass, age:req.body.age, phone:req.body.phone, profile_pic: req.file.path});
    const token = tokenFunction({id: newUser._id}, "tokenGeneration", 60 * 60);
    const confirmationLink = `${req.protocol}://${req.headers.host}/user/confirmEmail/${token}`;
    await sendEmail({
        to: newUser.email,
        message: `<a href=${confirmationLink}>Click to confirm</a>`,
        subject: "Confirmation Password"
    });
    if (sendEmail) {
        await newUser.save();
        return res.status(201).json({message: "check your inbox and click link to activate "})
    }
    //else
    new Error("sign up fail");
    //res.json({ message: "sign up fail" })

};

/**
 * @desc      confirm mail to finish user registeration
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
د * @returns   { JSON } - A JSON object representing the type, message
 * @route   GET /user/confirmEmail/:token
 * @access  Public

 */
export const confirmEmail = async (req, res, next) => {
        const {token} = req.params;
        const decode = tokenFunction(token, "tokenGeneration");

            (decode?.id && !await userModel.findOneAndUpdate(
                {_id: decode.id, confirmed: false},
                {confirmed: true}
            ))
            &&res.status(200).json({message: "Already confirmed"});

        return res.status(200).json({message: "Confirmation success , please try to login"});

        new Error("sign up fail try again");
};


/**
 * @desc      user login
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @returns   { JSON } - A JSON object representing the type, message
 * @route   POST /user/login
 * @access  Public

 */
export const logIn = async (req, res) => {
        const{email,password} = req.body;
        const checkUser = await userModel.findOne({email,confirmed:true});
        (!checkUser) && res.json({ message: "in-valid data1" });
        const isPasswordValid = compareFuncion({
                payload: password,
                referenceData: checkUser.password
            });
        (!isPasswordValid) && res.json({ message: "in-valid data2" });
        const token = tokenFunction({email: checkUser.email, id: checkUser._id},"tokenGeneration",60*60)
        res.json({ message: "login success", checkUser ,token});
};


/**
 * @desc      update profile Img
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @returns   { JSON } - A JSON object representing the type, message
 * @route   PATCH /pinterest/v1/user/login
 * @access  Public

 */
export const uploadProfilePicture = async (req, res, next) => {
    (!req.file) && new Error("please select you pictures");
    const { _id } = req.user;
    const user = await userModel.findByIdAndUpdate(_id, {
        profile_pic: req.file.path
    });
    (!user) && new Error("please try to login again");
    res.status(200).json({ message: "Done" });
};


/**
 * @desc      user forget password
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @returns   { JSON } - A JSON object representing the type, message
 * @access  Public

 */
//has no route it just send email to the user to reset the password
export const forgetPassword = async (req, res, next) => {
    const {email} = req.params;
    const user = await userModel.findOne({email, confirmed: true});
    const pass= Math.floor(100000 + Math.random() * 900000);
    const hashedPass = hashFunction({payload: String(pass)});
    await userModel.findOneAndUpdate({email, confirmed: true},{password:hashedPass});
    const resetPassword = `${req.protocol}://${req.headers.host}/user/resetpass/${email}`;
    await sendEmail({
        to: user.email,
        message: `<a href=${resetPassword}>Click to confirm that will genrate password from 6 number and the new password is ${pass}</a>`,
        subject: "Reseting Password"
    });

    if (sendEmail) return res.status(200).json({message: "check your inbox and click link to change password"})

    new Error("operation failed try again");
};


/**
 * @desc      user reset password
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @returns   { JSON } - A JSON object representing the type, message
 * @route   GET /user/resetpass/:email

 */
export const resetPassword = async (req, res) => {
    const {email} = req.params;
    return res.status(200).json({message: "password changed"});
    new Error("operation failed try again");
};



/**
 * @desc      user change your password
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @returns   { JSON } - A JSON object representing the type, message
 * @route   PATCH //user/changepass
 * @access  Private Users

 */
export const changePassword = async (req, res) => {
        const {newpass,cpass} = req.body;
        const {token} = req.headers;
        const decoded = tokenFunction(token,"tokenGeneration");
        const hashedPass = hashFunction({ payload: cpass });
        const checkUser = await userModel.findOneAndUpdate({_id:decoded.id,confirmed:true},{password:hashedPass});
        (!checkUser)&&res.json({ message: "email is not registered sign up plz" });
        res.json({ message: "password changed", checkUser });
};


/**
 * @desc      delete user from database
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @returns   { JSON } - A JSON object representing the type, message
 * @route   DELETE /user/delete
 * @access  Private

 */
export const deleteUser = async (req, res) => {
        const { _id } = req.user;
        const user = await userModel.findByIdAndDelete(_id);
        (user)&& res.json({ message: "Done" });
        res.json({ message: "fail" });
};


/**
 * @desc      deactivate user account but it still in database
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @returns   { JSON } - A JSON object representing the type, message
 * @route   DELETE /user/softdelete
 * @access  Private

 */
export const softDeleteUser = async (req, res) => {
    const { _id } = req.user;
    const user = await userModel.findByIdAndUpdate(_id, {isDeleted: true});
    (user)&& res.json({ message: "Done" });
    res.json({ message: "fail" });
};


/**
 * @desc      user change your Name and Age
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @returns   { JSON } - A JSON object representing the type, message
 * @route   PATCH /user/update
 * @access  Private

 */
export const updateUserNameAndPhone = async (req, res) => {
    const {name,phone} = req.body;
    const { _id } = req.user;
    const user = await userModel.findByIdAndUpdate(_id, {name,phone});
    (user)&& res.json({ message: "Done" });
    res.json({ message: "fail" });
};

export const logOut = async (req, res) => {
    let { token } = req.headers;
    const decoded = tokenFunction(token,"tokenGeneration");
    (!decoded||!decoded.id)&& res.json({ message: "decoded fail" });
    req.headers.token = alter(token);
    console.log(req.headers.token)
    res.json({msg:"in-valied token you loged out",});
};



