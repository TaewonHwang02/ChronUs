    import express from 'express';
    import dotenv from 'dotenv';
    import {connectDB} from './config/db.js';
    import bodyPaser from "body-parser";
    import cors from "cors";
    import "./config/db.js";
    import admin from "./config/firebaseAdmin.js";
    import userRoutes from "./routes/userRoutes.js";



    dotenv.config();
    const app = express();

    app.use(cors());
    app.use(express.json()); //parse incoming json requests
    app.use(express.urlencoded({extended:true}))
    app.use("/api/users", userRoutes);
    app.get("/",(req,res) => {
        res.send("Server is ready")
    })


    console.log("MONGO_URI:", process.env.MONGO_URI);



    app.listen(5001,() => {
        connectDB()
        console.log("Server started at http://localhost:5001 hello")
    })