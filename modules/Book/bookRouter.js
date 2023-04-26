import {myMulter} from "../../services/multer.js";
import {asyncHandler} from "../../middleware/asyncHandler.js";
import * as bookController from "./bookController.js";
import {Router} from "express";
import validation from "../../middleware/validation.js";
import  * as validators from "./bookValidation.js";
const bookRouter = Router();

bookRouter.post("/admin/add",
    myMulter({customPath:"book"})
        .single("img"),
    validation(validators.addBookValidation),
    asyncHandler(bookController.addBook));

bookRouter.get("/admin/allavalibe", asyncHandler(bookController.getAllAvaliabeBooks));
bookRouter.get("/admin/allborrowed",asyncHandler(bookController.getAllBorrowedBooks));

bookRouter.get("/admin/search/:title",
    validation(validators.searchBookByNameAllConditionsValidation),
    asyncHandler(bookController.searchBookByNameAllConditions));

export default bookRouter;