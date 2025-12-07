// Taewon Hwang 261013091
import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
    name : {type: String, required: true},

    slots: {
      type: [String], // Each entry is an ISO timestamp
      default: [],

    },

    // can remove later
    times : [{
        date: { type: String, required: true },
        day: { type: Number, required: true },
        minTime: { type: String, required: true },
        maxTime: { type: String, required: true },
      },

    ],
});
export default participantSchema;