import {Router} from "express";
import * as userController from "./userController.js"
import {asyncHandler} from "../../middleware/asyncHandler.js";
import {validation} from "../../middleware/validation.js";
import * as validators from "./userValidation.js";
import {auth} from "../../middleware/auth.js";
import {myMulter, validationObject} from "../../services/multer.js";
const userRouter = Router();


//asyncAPIS calls
userRouter.post("/signup",
                myMulter({customPath:"user"})
                .single("img"),
                validation(validators.signUpValidation),
                asyncHandler(userController.signUp));

userRouter.get("/confirmEmail/:token", asyncHandler(userController.confirmEmail));

userRouter.post("/login",
    validation(validators.logInValidation),
    asyncHandler(userController.logIn));


userRouter.post("/changepass",
                asyncHandler(auth()),
                validation(validators.changePasswordValidation),
                asyncHandler(userController.changePassword));

userRouter.patch(
    "/updateimg",
    auth(),
    myMulter({
        cutsomPath: "user",
        customValidation: validationObject.image
    }).single("img"),
    asyncHandler(userController.uploadProfilePicture)
);

//validation(deleteUserValidation) reduntednt
userRouter.delete("/delete",
    asyncHandler(auth()),
    validation(validators.deleteUserValidation),
    asyncHandler(userController.deleteUser));


userRouter.delete("/softdelete",
    asyncHandler(auth()),
    validation(validators.softDeleteUserValidation),
    asyncHandler(userController.softDeleteUser));


userRouter.patch("/update",
    asyncHandler(auth()),
    validation(validators.updateUserValidation),
    asyncHandler(userController.updateUserNameAndPhone));

userRouter.get("/forgetpass/:email",asyncHandler(userController.forgetPassword));
userRouter.get("/resetpass/:email",asyncHandler(userController.resetPassword));
userRouter.get("/logout",asyncHandler(auth()),asyncHandler(userController.logOut));



//syncAPIS calls


export default userRouter;