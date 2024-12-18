import express from "express";
import Meeting from "../models/meetingSchema.js";
import { v4 as uuidv4 } from "uuid";
import verifyFirebaseToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create-meeting", verifyFirebaseToken, async (req, res) => {
  try {
    const {
      userID,
      scheduleMode,
      timeZone,
      begTimeFrame,
      endTimeFrame,
      startdate,
      enddate,
      deadline,
      participants,
    } = req.body;

    // Validate required fields
    if (!userID || !scheduleMode || !timeZone || !begTimeFrame || !endTimeFrame || !startdate || !enddate || !deadline) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate userID as a non-empty string (Firebase UID)
    if (typeof userID !== "string" || userID.trim() === "") {
      return res.status(400).json({ message: "Invalid userID format. Must be a non-empty string." });
    }

    // Create the meeting
    const meeting = new Meeting({
      userID, // Use the Firebase UID directly
      scheduleMode,
      timeZone,
      begTimeFrame,
      endTimeFrame,
      startdate,
      enddate,
      deadline,
      participants,
      meetingLink: uuidv4(),
    });

    // Save the meeting
    const savedMeeting = await meeting.save();

    res.status(201).json({
      message: "Meeting created successfully",
      meeting: savedMeeting._id,
      meetingLink: savedMeeting.meetingLink,
    });
  } catch (error) {
    console.error("Error creating meeting:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
