import express from "express";
import User from "../models/User.js";
import verifyFirebaseToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register",verifyFirebaseToken, async(req,res) => {
    const {uid,email,name} = req.user;
    try {
       let user = await User.findOne({firebaseUID:uid})
       if (!user) {
        user = new User({
            firebaseUID: uid,
            email,
            name:name,
        });
        await user.save()
       }
       res.status(200).json({message:"User synced",user})

    }
    catch (error) {
        console.log("Error syncing user:", error.message)
        res.status(500).json({message:"server error"})
    }

})
export default router