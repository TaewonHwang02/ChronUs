import express from "express";
import Meeting from "../models/meetingSchema.js";

const router = express.Router();

// API to create a new meeting
router.post("/create-meeting", async (req, res) => {
  try {
    const newMeeting = new Meeting(req.body); 
    await newMeeting.save();
    res.status(201).json({ message: "Meeting created successfully", meeting: newMeeting });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
