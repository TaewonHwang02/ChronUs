import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({

    eventName: {
        type: String,
        required:true
    },
    participants: [
        {
            name: {
                type: String,
                required: true
            },
            availability: [
                {
                  day: { type: String },
                  times: [{ type: String }],
                },
              ],
           
            
        },
    ],
    eventLink: {
        type:String,
        required:true,
        unique:true

    }
});

const Event = mongoose.model('Event', eventSchema);