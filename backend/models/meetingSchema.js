import mongoose from "mongoose";
import participantSchema from "./participantSchema.js";

const meetingSchema = new mongoose.Schema({
  userID: { type: String, required: true }, // Firebase UID as a string
  scheduleMode: { type: String, enum: ["common_time", "common_date"], required: true },
  timeZone: { type: String, required: true },
  begTimeFrame: { type: Number, required: true },
  endTimeFrame: { type: Number, required: true },
  startdate: { type: Date, required: true },
  enddate: { type: Date, required: true },
  deadline: { type: Date, required: true },
  participants: [participantSchema],
  meetingLink: { type: String, unique: true, required: true },
  meetingName: {type:String, required: false}
});

export default mongoose.model("Meeting", meetingSchema);
