import admin from "../config/firebaseAdmin.js";

const verifyFirebaseToken = async (req,res,next) => {
    const authHeader = req.headers.autherization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: Missing token" });
    }
    const token = authHeader.split(" ")[1];
    try{
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    }
    catch(error){
        console.log("Token verification failed")
        res.status(401).json({message:"Unauthorized: invalid token"})
    }
}
export default verifyFirebaseToken