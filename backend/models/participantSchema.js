import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
    name : {type: String, required: true},
    times : { type:[String], required:true}
})
export default participantSchema;