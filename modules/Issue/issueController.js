import {bookModel} from "../../DB/models/bookModel.js";
import {issueModel} from "../../DB/models/issueModel.js";
import moment from "moment";

/**
 * @desc      user requset to borrow a book
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @returns   { JSON } - A JSON object representing the type, message
 * @route   POST /admin/borrow/:bookId

 */
export const borrowBook = async (req, res) => {
    const {_id} = req.user;
    const {bookId} = req.params;
    const {description,day} = req.body;
    (!_id && !bookId) && new Error("you should send the book id and the user id");
    const book = await bookModel.findOne({_id: bookId});
    (!book) && new Error("no book with this id is found");
    (book.status==="borrowed") && new Error("this book is already borrowed");
    const returnDate = moment().add(day, "days").format("YYYY-MM-DD");
    book.status = "borrowed";
    await book.updateOne({status: "borrowed"})
    const newIssue = await issueModel.create({description, book:bookId, user: _id, returnDate});
    res.status(200).json({message:"book borrowed successfully", newIssue, book});
};

/**
 * @desc      get all issues of a user
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @returns   { JSON } - A JSON object representing the type, message
 * @route   GET /admin/allIssuesOfUser

 */
export const allIssuesOfUser = async (req, res) => {
    const {_id} = req.user;
    const issues = await issueModel.find({user: _id}).populate("book");
    res.status(200).json({issues});
    (!issues) && new Error("no issues found for this user");
};

/**
 * @desc      user request to return a book
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @returns   { JSON } - A JSON object representing the type, message
 * @route   GET /admin/returnbook/:issueId

 */
export const returnBook = async (req,res) => {
    const {issueId} = req.params;
    const issue = await issueModel.findOne({_id: issueId})
    const checkout =  moment(issue.issueDate); // assuming this is a valid Moment object
    const returned =  moment(issue.returnDate); // assuming this is a valid Moment object
    const diff = returned.diff(checkout, "days");
    const currentDate = moment();
    (diff>0 && currentDate.diff(returned, "days")>0)
        ? res.json({msg:`you are late ${diff} days so you should pay a fine of ${diff*10}$ for this book`})
        : res.json({msg:"you returned the book on time so you don't have to pay any fine"});
};