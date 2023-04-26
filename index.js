process.on("uncaughtException",
    (err)=>{
        console.log("program bug",err,err.stack)
    });

import express from "express";
import connection from "./DB/connection.js";
import * as indexRouter from "./modules/indexRouter.js"
import morgan from "morgan";


const app = express();
app.use(express.json());
app.use(morgan("dev"));
connection();


app.use("/user", indexRouter.userRouter);
app.use("/book", indexRouter.bookRouter);
app.use("/issue", indexRouter.issueRouter)


app.all("*", (req, res) => {
    console.log(`In-valid Routing `+req.originalUrl);
    res.status(404).json({status: "Fail", message: `In-valid Routing `+req.originalUrl});
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
    console.log(`http://localhost:3000`);
});

process.on("unhandedRejection",
    (err)=>{
    console.log("error",err,err.stack)
});