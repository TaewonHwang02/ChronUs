import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({

    eventName: {
        type: String,
        required: true
    },
    eventDate: {
        type: [String],
        required: true
    },
    eventTimeSlots: {
        type: [String],
        required: true
    }
});

const Event = mongoose.model('Event', eventSchema);
export default Event