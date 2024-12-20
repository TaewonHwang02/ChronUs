import express from "express";
import Meeting from "../models/meetingSchema.js";
import { v4 as uuidv4 } from "uuid";
import verifyFirebaseToken from "../middlewares/authMiddleware.js";
import User from "../models/User.js"

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
    const user = await User.findOne({ uid: userID });
    if (user) {
      user.meetings.push(savedMeeting._id);
      await user.save();
    }

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
router.get("/user-meetings/:userID", verifyFirebaseToken, async (req, res) => {
  const { userID } = req.params;

  try {
    const user = await User.findOne({ uid: userID }).populate("meetings");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ meetings: user.meetings });
  } catch (error) {
    console.error("Error fetching user meetings:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// Update an existing meeting
router.put("/update-meeting/:meetingID", verifyFirebaseToken, async (req, res) => {
  const { meetingID } = req.params; // Meeting ID from the URL
  const updateFields = req.body; // Fields to update from the request body

  try {
    // Find the meeting by ID and update it with the provided fields
    const updatedMeeting = await Meeting.findByIdAndUpdate(
      meetingID,
      { $set: updateFields },
      { new: true, runValidators: true } // Return the updated document and enforce validation
    );

    if (!updatedMeeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    res.status(200).json({
      message: "Meeting updated successfully",
      meeting: updatedMeeting,
    });
  } catch (error) {
    console.error("Error updating meeting:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
router.get("/scheduling/:meetingLink", async (req, res) => {
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
    console.error("Error retrieving meeting for scheduling:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
router.post('/:meetingLink/select-time', async (req, res) => {
  const { meetingLink } = req.params;
  const { participantName, selectedTimeSlots } = req.body;

  // Validate request body
  if (!participantName || !selectedTimeSlots || !Array.isArray(selectedTimeSlots)) {
      return res.status(400).json({ message: 'Missing or invalid data' });
  }

  try {
      // Find the meeting by its link
      const meeting = await Meeting.findOne({ meetingLink });

      if (!meeting) {
          return res.status(404).json({ message: 'Meeting not found' });
      }

      // Add or update the participant's time slots
      const participantIndex = meeting.participants.findIndex(
          (p) => p.name === participantName
      );

      if (participantIndex > -1) {
          // Update existing participant's time slots
          meeting.participants[participantIndex].times = selectedTimeSlots;
      } else {
          // Add new participant
          meeting.participants.push({ name: participantName, times: selectedTimeSlots });
      }

      // Save changes to the database
      await meeting.save();

      res.status(200).json({ message: 'Time slots submitted successfully', meeting });
  } catch (error) {
      console.error('Error updating time slots:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});



export default router;
