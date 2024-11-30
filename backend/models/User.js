import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    firebaseUID: {type: String, required: true, unique: true},
    email: {type:String, required: true, unique: true},
    name: {type: String}
});

export default mongoose.model("User", userSchema);
