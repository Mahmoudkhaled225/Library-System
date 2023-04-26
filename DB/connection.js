import mongoose from "mongoose";

const connection= async ()=>{
    return await mongoose
    .connect("mongodb://127.0.0.1:27017/library")
    .then(()=>console.log("DB connected"))
    .catch((err)=>console.log(err));
};


mongoose.set("strictQuery",true);
export default connection;