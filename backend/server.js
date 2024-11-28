
    import express from 'express';
    import dotenv from 'dotenv';
    import {connectDB} from './config/db.js'

    dotenv.config()
    const app = express();

    app.get("/",(req,res) => {
        res.send("Server is ready")
    })


    console.log("MONGO_URI:", process.env.MONGO_URI);



    app.listen(5001,() => {
        connectDB()
        console.log("Server started at http://localhost:5001 hello")
    })