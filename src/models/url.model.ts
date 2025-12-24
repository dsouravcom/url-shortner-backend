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
    {
        timestamps: true,
        // Performance optimization: return plain JavaScript objects instead of Mongoose documents
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes for faster queries
urlSchema.index({ original_url: 1 }); // Index for searching by original URL
urlSchema.index({ createdAt: -1 }); // Index for sorting by creation date

const Url = model("Url", urlSchema);

export default Url;
