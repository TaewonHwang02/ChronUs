import express from "express";
import User from "../models/User.js";
import verifyFirebaseToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", verifyFirebaseToken, async (req, res) => {
    console.log("Request body:", req.body); // Log name and email 
    console.log("User data from Firebase token:", req.user); // Log uid and email
    const { uid, email } = req.user; // Extracted from Firebase token
    const { name } = req.body; // Sent from the frontend

  
    try {
        let user = await User.findOne({ uid }); // Look for an existing user
        if (!user) {
        user = new User({ uid, email, name }); // Create new user
        await user.save();
        }
        res.status(200).json({ message: "User synced", user });
    } catch (error) {
        console.error("Error syncing user:", error.message);
        res.status(500).json({ message: "Failed to sync user with MongoDB" });
    }
    });

export default router;
