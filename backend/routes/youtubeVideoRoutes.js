import express from "express";
import {
  getYoutubeVideos,
  getAllVideos,
  addYoutubeVideo,
  updateYoutubeVideo,
  deleteYoutubeVideo
} from "../controllers/youtubeVideoController.js";

const router = express.Router();

// Public route - get active videos for homepage
router.get("/", getYoutubeVideos);

// Admin routes
router.get("/admin/all", getAllVideos);
router.post("/admin/add", addYoutubeVideo);
router.put("/admin/update/:id", updateYoutubeVideo);
router.delete("/admin/delete/:id", deleteYoutubeVideo);

export default router;