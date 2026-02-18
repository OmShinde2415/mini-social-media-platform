const express = require("express");
const {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  likeUnlikePost,
  addCommentToPost
} = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getAllPosts);
router.post("/", protect, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.put("/:id/like", protect, likeUnlikePost);
router.post("/:id/comment", protect, addCommentToPost);

module.exports = router;
