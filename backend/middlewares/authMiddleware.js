import admin from "../config/firebaseAdmin.js";

const verifyFirebaseToken = async (req, res, next) => {
    console.log("Headers:", req.headers); 
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Missing token" });
    }
  
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || "Anonymous", // Optional fallback
    };
    next();
    } catch (error) {
      res.status(403).json({ message: "Unauthorized: Invalid token" });
    }
  };
export default verifyFirebaseToken