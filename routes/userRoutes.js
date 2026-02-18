const express = require("express");
const {
  getUserProfile,
  followUnfollowUser,
  updateMyProfile
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:id", protect, getUserProfile);
router.put("/me/update", protect, updateMyProfile);
router.put("/:id/follow", protect, followUnfollowUser);

module.exports = router;
