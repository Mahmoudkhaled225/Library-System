import {bookModel} from "../../DB/models/bookModel.js";

/**
 * @desc      add book
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @returns   { JSON } - A JSON object representing the type, message
 * @route   POST /book/admin/add

 */
export const addBook = async (req, res) => {
    (!req.file) && new Error("you should upload a book image");
    const {title, tag, authur} = req.body;
    const newBook = new bookModel({title, tag, authur,book_pic: req.file.path});
    await newBook.save();
    res.status(201).json({message: "book added"});
};

/**
 * @desc      get all books that are avaliable
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @returns   { JSON } - A JSON object representing the type, message
 * @route   GET /book/admin/allavalibe

 */
export const getAllAvaliabeBooks = async (req, res) => {
    const books = await bookModel.find({status: "available"});
    (!books) && new Error("no avaliable books found");
    res.status(200).json({message: "books", books})

};

/**
 * @desc      get all books that are borrowed
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @returns   { JSON } - A JSON object representing the type, message
 * @route   GET /book/admin/allborrowed

 */
export const getAllBorrowedBooks = async (req, res) => {
    const books = await bookModel.find({status: "borrowed"});
    (!books) && new Error("no borrowed books found");
    res.status(200).json({message: "books", books});
};

/**
 * @desc      search book by name in all conditions
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @returns   { JSON } - A JSON object representing the type, message
 * @route   GET /book/admin/search/:title

 */
export const searchBookByNameAllConditions = async (req, res) => {
    const {title}= req.params;
    const book = await bookModel.findOne({title});
    (!book) && new Error("no book with this name is found");
    res.status(200).json({message: "book", book});
};


//all the above function are for admin but cause this is a small project I will not make a middleware for authorization
//so any can access them

