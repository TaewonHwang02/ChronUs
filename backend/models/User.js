import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    uid: {type: String, required: true, unique: true},
    email: {type:String, required: true, unique: true},
    name: {type: String,required: true },
    meetings: {type: mongoose.Schema.Types.ObjectId, ref:"Meeting"}
});

const User = mongoose.model("User", userSchema);
export default User;
