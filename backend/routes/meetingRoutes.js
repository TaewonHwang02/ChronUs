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
      return res.status(400).json({ message: "Missing required fiaelds" });
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

router.post("/join-meeting", async (req, res) => {
  const { meetingLink, participantName, times } = req.body;

  if (!meetingLink || !participantName || !times) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const meeting = await Meeting.findOne({ meetingLink });

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    meeting.participants.push({
      name: participantName,
      times,
    });

    await meeting.save();

    res.status(200).json({
      message: "Participant added successfully",
      participants: meeting.participants,
    });
  } catch (error) {
    console.error("Error adding participant:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
router.get("/:meetingLink", async (req, res) => {
  const { meetingLink } = req.params;

  try {
    const meeting = await Meeting.findOne({ meetingLink });

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    res.status(200).json({
      meeting,
    });
  } catch (error) {
    console.error("Error retrieving meeting:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


export default router;
