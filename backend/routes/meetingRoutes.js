// Taewon Hwang 261013091
import express from "express";
import Meeting from "../models/meetingSchema.js";
import { v4 as uuidv4 } from "uuid";
import verifyFirebaseToken from "../middlewares/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/create-meeting", async (req, res) => {
  console.log("Received request data:", req.body);
  try {
    const {
      meetingID, // optional: if present, update existing meeting
      scheduleMode,
      timeZone,
      begTimeFrame,
      endTimeFrame,
      startdate,
      enddate,
      deadline,
      participants,
      minimumTimeSlots,
      email,
      emailDate,
      meetingName,
    } = req.body;

    // Validate required fields
    if (
      !scheduleMode ||
      !timeZone ||
      !begTimeFrame ||
      !endTimeFrame ||
      !startdate ||
      !enddate ||
      !deadline ||
      !meetingName
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let meeting;
    let meetingLink;

    if (meetingID) {
      // Update existing meeting
      meeting = await Meeting.findByIdAndUpdate(
        meetingID,
        {
          scheduleMode,
          timeZone,
          begTimeFrame,
          endTimeFrame,
          startdate,
          enddate,
          deadline,
          participants,
          minimumTimeSlots: minimumTimeSlots || 0,
          email,
          emailDate,
          meetingName,
        },
        { new: true, runValidators: true }
      );

      if (!meeting) {
        return res.status(404).json({ message: "Meeting not found" });
      }

      meetingLink = meeting.meetingLink;
      console.log("Meeting updated successfully:", meetingLink);
    } else {
      // Create a new meeting
      meeting = new Meeting({
        scheduleMode,
        timeZone,
        begTimeFrame,
        endTimeFrame,
        startdate,
        enddate,
        deadline,
        participants,
        minimumTimeSlots: minimumTimeSlots || 0,
        email,
        emailDate,
        meetingName,
        meetingLink: uuidv4(),
      });

      const savedMeeting = await meeting.save();
      meetingLink = savedMeeting.meetingLink;
      console.log("Meeting created successfully:", meetingLink);
    }

    res.status(200).json({
      message: meetingID
        ? "Meeting updated successfully"
        : "Meeting created successfully",
      meeting: meeting._id,
      meetingLink,
    });
  } catch (error) {
    console.error("Error creating/updating meeting:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post("/join-meeting", async (req, res) => {
  const { meetingLink, participantName, times } = req.body;

  if (!meetingLink || !participantName) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const meeting = await Meeting.findOne({ meetingLink });

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    meeting.participants.push({
      name: participantName,
      slots: [],      // used later by TimeSelector
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
// router.get("/user-meetings/:userID", verifyFirebaseToken, async (req, res) => {
//   const { userID } = req.params;

//   try {
//     const user = await User.findOne({ uid: userID }).populate("meetings");
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({ meetings: user.meetings });
//   } catch (error) {
//     console.error("Error fetching user meetings:", error.message);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });
// Update an existing meeting
router.put(
  "/update-meeting/:meetingID",
  verifyFirebaseToken,
  async (req, res) => {
    const { meetingID } = req.params; // Meeting ID from the URL
    const updateFields = req.body; // Fields to update from the request body

    try {
      // Find the meeting by ID and update
      const updatedMeeting = await Meeting.findByIdAndUpdate(
        meetingID,
        { $set: updateFields },
        { new: true, runValidators: true }
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
  }
);
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
});router.post("/:meetingLink/select-time", async (req, res) => {
  const { meetingLink } = req.params;

  // TimeSelector will send: { participantName, slots, slotMinutes }
  const { participantName, slots, slotMinutes } = req.body;

  console.log("select-time body:", req.body); // debug

  // Validate request body
  if (!participantName || !Array.isArray(slots)) {
    return res.status(400).json({ message: "Missing or invalid data" });
  }

  try {
    // Find the meeting by its link
    const meeting = await Meeting.findOne({ meetingLink });

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    // Minimum time check (using slot count instead of ranges)
    const minMinutesRequired = meeting.minimumTimeSlots || 0;
    const slotLen = Number(slotMinutes) || 30; // default 30 minutes
    const totalSelectedMinutes = slots.length * slotLen;

    if (minMinutesRequired > 0 && totalSelectedMinutes < minMinutesRequired) {
      return res.status(400).json({
        message: `You must select at least ${minMinutesRequired} minutes. You selected ${totalSelectedMinutes} minutes.`,
      });
    }

    // Find or create participant
    const participant = meeting.participants.find(
      (p) => p.name === participantName
    );

    if (participant) {
      participant.slots = slots;
    } else {
      meeting.participants.push({
        name: participantName,
        slots,

      });
    }

    await meeting.save();

    res
      .status(200)
      .json({ message: "Time slots submitted successfully", meeting });
  } catch (error) {
    console.error("Error updating time slots:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
