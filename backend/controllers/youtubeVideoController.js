import YoutubeVideo from "../models/YoutubeVideo.js";

// Get all active YouTube videos
export const getYoutubeVideos = async (req, res) => {
  try {
    const videos = await YoutubeVideo.find({ isActive: true })
      .sort({ displayOrder: 1, createdAt: -1 });
    res.json({ success: true, videos });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all videos for admin
export const getAllVideos = async (req, res) => {
  try {
    const videos = await YoutubeVideo.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json({ success: true, videos });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Add new YouTube video
export const addYoutubeVideo = async (req, res) => {
  try {
    const { title, videoId, description, displayOrder } = req.body;
    
    // Extract video ID from URL if full URL is provided
    let finalVideoId = videoId;
    if (videoId.includes('youtube.com') || videoId.includes('youtu.be')) {
      finalVideoId = extractYouTubeId(videoId);
    }
    
    const thumbnail = `https://img.youtube.com/vi/${finalVideoId}/hqdefault.jpg`;
    
    const video = new YoutubeVideo({
      title,
      videoId: finalVideoId,
      description,
      thumbnail,
      displayOrder: displayOrder || 0
    });
    
    await video.save();
    res.status(201).json({ success: true, video });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Update YouTube video
export const updateYoutubeVideo = async (req, res) => {
  try {
    const { title, videoId, description, isActive, displayOrder } = req.body;
    
    let updateData = { title, description, isActive, displayOrder, updatedAt: new Date() };
    
    if (videoId) {
      let finalVideoId = videoId;
      if (videoId.includes('youtube.com') || videoId.includes('youtu.be')) {
        finalVideoId = extractYouTubeId(videoId);
      }
      updateData.videoId = finalVideoId;
      updateData.thumbnail = `https://img.youtube.com/vi/${finalVideoId}/hqdefault.jpg`;
    }
    
    const video = await YoutubeVideo.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!video) {
      return res.status(404).json({ success: false, error: "Video not found" });
    }
    
    res.json({ success: true, video });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Delete YouTube video
export const deleteYoutubeVideo = async (req, res) => {
  try {
    await YoutubeVideo.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Video deleted successfully" });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Helper function to extract YouTube ID from URL
function extractYouTubeId(url) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : url;
}