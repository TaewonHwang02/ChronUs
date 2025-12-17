// Taewon Hwang 261013091
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import bodyPaser from "body-parser";
import cors from "cors";
import "./config/db.js";
import admin from "./config/firebaseAdmin.js";
import userRoutes from "./routes/userRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import mailingRoutes from "./routes/mailingRoutes.js";
//Testing mailing issue
import testMailerRoutes from "./routes/testMailer.js";


// production : render
// development : localhost
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: `.env.development` });
}
const app = express();
connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
//Testing mailing issue
app.use("/api/test-mailer", testMailerRoutes);
app.use(express.json()); //parse incoming json requests
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", userRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/email", mailingRoutes);
app.get("/", (req, res) => {
  res.send("Server is ready");
});

console.log("MONGO_URI:", process.env.MONGO_URI);

const PORT = process.env.PORT || 5002;
app.listen(5002, () => {
  connectDB();
  console.log("Server started at https://chronus-qrt1.onrender.com hello");
});
