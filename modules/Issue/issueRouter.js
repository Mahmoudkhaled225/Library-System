import {asyncHandler} from "../../middleware/asyncHandler.js";
import * as issueController from "./issueController.js";
import {Router} from "express";
import {auth} from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import * as validators from "./issueValidation.js";
const issueRouter = Router();

issueRouter.post("/admin/borrow/:bookId",
    asyncHandler(auth()),
    validation(validators.borrowBookValidation),
    asyncHandler(issueController.borrowBook));

issueRouter.get("/admin/allIssuesOfUser"
    ,asyncHandler(auth())
    ,asyncHandler(issueController.allIssuesOfUser));

issueRouter.get("/admin/returnbook/:issueId",
    asyncHandler(auth()),
    validation(validators.returnBookValidation),
    asyncHandler(issueController.returnBook));

export default issueRouter;
