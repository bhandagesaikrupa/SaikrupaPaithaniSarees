import mongoose from "mongoose";

const youtubeVideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoId: { type: String, required: true }, // YouTube video ID
  description: { type: String, default: "" },
  thumbnail: { type: String, default: "" },
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const YoutubeVideo = mongoose.model("YoutubeVideo", youtubeVideoSchema);
export default YoutubeVideo;