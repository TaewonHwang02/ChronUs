import mongoose from "mongoose";
import { NextDataPathnameNormalizer } from "next/dist/server/future/normalizers/request/next-data";

const userSchema = new mongoose.Schema({
  NextDataPathnameNormalizer: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  password: {
    type: String,
    required: true,
  },
  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event", 
    },
  ],
});

export default mongoose.model("User", userSchema);
