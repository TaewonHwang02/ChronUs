import admin from "../config/firebaseAdmin.js";

const verifyFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
      return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  try {
      const decodedToken = await admin.auth().verifyIdToken(token);


      if (!decodedToken.uid || !decodedToken.email) {
          console.error("Invalid token: Missing uid or email");
          return res.status(400).json({ message: "Invalid token: Missing uid or email" });
      }

      req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name || "Anonymous",
      };
      console.log("Decoded token:", req.user);
      next();
  } catch (error) {
      console.error("Firebase token verification failed:", error.message);
      return res.status(403).json({ message: "Unauthorized: Invalid token" });
  }
};

export default verifyFirebaseToken