import mongoose from "mongoose";
const { Schema, model } = mongoose;

const urlSchema = new Schema(
  {
    original_url: {
      type: String,
      required: true,
    },
    short_url: {
      type: String,
      required: true,
      unique: true,
    },
    visit_history: [{ timeStamp: { type: Number } }],
  },
  { timestamps: true }
);

const Url = model("Url", urlSchema);

export default Url;
