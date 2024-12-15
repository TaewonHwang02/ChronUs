import express from "express";
import User from "../models/User.js";
import verifyFirebaseToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", verifyFirebaseToken, async (req, res) => {
    const { uid, email } = req.user;
    const { name } = req.body;

    // Validate required fields
    if (!uid || !email || !name) {
        console.error("Missing required fields: uid, email, or name");
        return res.status(400).json({ message: "Missing required fields: uid, email, or name" });
    }

    try {
        let user = await User.findOne({ uid });
        if (!user) {
            console.log("Creating new user:", { uid, email, name });
            user = new User({ uid, email, name });
            await user.save();
        } else {

            return res.status(409).json({ message: "User already exists" });
        }
        res.status(200).json({ message: "User synced", user });
    } catch (error) {

        res.status(500).json({ message: "Failed to sync user with MongoDB" });
    }
});

router.post("/login", verifyFirebaseToken, async (req, res) => {
    const { uid, email } = req.user; // Extract uid and email from token

    if (!uid || !email) {
        console.error("Missing required fields: uid or email");
        return res.status(400).json({ message: "Missing required fields: uid or email" });
    }

    try {
        const user = await User.findOne({ uid });

        if (!user) {
            console.error("User not found with the given uid");
            return res.status(404).json({ message: "User not found" });
        }

        console.log("User logged in successfully:", user);
        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        console.error("Error during login:", error.message);
        res.status(500).json({ message: "Failed to login" });
    }
});



export default router;
