    // Taewon Hwang 261013091
    import express from 'express';
    import dotenv from 'dotenv';
    import {connectDB} from './config/db.js';
    import bodyPaser from "body-parser";
    import cors from "cors";
    import "./config/db.js";
    import admin from "./config/firebaseAdmin.js";
    import userRoutes from "./routes/userRoutes.js";
    import meetingRoutes from "./routes/meetingRoutes.js";
    import mailingRoutes from "./routes/mailingRoutes.js";




    dotenv.config();
    const app = express();
    connectDB();

    app.use(cors({
        origin: ["https://chronus.blog"], // Ensure your frontend is allowed
        credentials: true,
      }));
    app.use(express.json()); // Parse JSON bodies
    app.use(express.json()); //parse incoming json requests
    app.use(express.urlencoded({extended:true}))
    app.use("/api/users", userRoutes);
    app.use("/api/meetings", meetingRoutes);
    app.use("/api/email", mailingRoutes);
    app.get("/",(req,res) => {
        res.send("Server is ready")
    })


    console.log("MONGO_URI:", process.env.MONGO_URI);



    app.listen(5001,() => {
        connectDB()
        console.log("Server started at https://chronus.onrender.com hello")
    })