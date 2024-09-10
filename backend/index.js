//server create 

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js"
import jobRoute from "./routes/job.route.js"
import applicationRoute from "./routes/application.route.js"

dotenv.config({});


const app=express();// Sets up a new Express application.

//middleware:process and check request before sending response
app.use(express.json());//his middleware allows your app to understand and process JSON data that comes in with requests.
app.use(express.urlencoded({extended:true}));//this middleware lets your app handle form data that comes in as application/x-www-form-urlencoded, which is the type of data sent by traditional HTML forms.
app.use(cookieParser());
//This middleware handles CORS (Cross-Origin Resource Sharing), which controls which websites can make requests to your server.
const corsOptions={
    origin:'http://localhost:5173',
    credentials:true,

}
app.use(cors(corsOptions));
const PORT=process.env.PORT||1024;

//api
app.use("/api/v1/user",userRoute);
app.use("/api/v1/company",companyRoute);
app.use("/api/v1/job",jobRoute);
app.use("/api/v1/application",applicationRoute);


app.listen(PORT,()=>

{
    connectDB();
    console.log(`Server running at port ${PORT}`);
})