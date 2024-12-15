import mongoose from "mongoose";
const { Schema } = mongoose;

const meetingSchema  = new Schema(
    {
    meetingID: { type: String, required: true },
    userID: { type: String, required: true }, 
    scheduleMode: { type:  String, enum: ["common_time", "common_date"], required: true }, // Scheduling a common time, or a common date
    emailOption: { type: Boolean, default: false },
    timeZone: { type: String, required: true },
    begTimeFrame: { type: Date, required: true },
    endTimeFrame: { type: Date, required: true },
    minimumTimeSlot: Number,
    startdate: { type: Date, required: true }, 
    enddate: { type: Date, required: true },
    deadline: { type: Date, required: true },
    participants: [{ type: String }],
    }, 
    { timestamps: true }
); 

const Meeting = mongoose.model("Meeting", meetingSchema);

export default Meeting;

