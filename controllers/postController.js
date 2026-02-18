const Post = require("../models/Post");

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username profilePicture")
      .populate("comments.author", "username profilePicture")
      .sort({ createdAt: -1 });

    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createPost = async (req, res) => {
  try {
    const { content, imageUrl } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Post content is required" });
    }

    const post = await Post.create({
      author: req.userId,
      content,
      imageUrl: imageUrl || ""
    });

    const populatedPost = await Post.findById(post._id).populate(
      "author",
      "username profilePicture"
    );

    return res.status(201).json(populatedPost);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const { content, imageUrl } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only edit your own posts" });
    }

    if (typeof content === "string") post.content = content;
    if (typeof imageUrl === "string") post.imageUrl = imageUrl;

    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate("author", "username profilePicture")
      .populate("comments.author", "username profilePicture");

    return res.json(populatedPost);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    await post.deleteOne();
    return res.json({ message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const likeUnlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLiked = post.likes.some((id) => id.toString() === req.userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== req.userId);
      await post.save();
      return res.json({ message: "Post unliked" });
    }

    post.likes.push(req.userId);
    await post.save();
    return res.json({ message: "Post liked" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const addCommentToPost = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({ author: req.userId, text });
    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate("author", "username profilePicture")
      .populate("comments.author", "username profilePicture");

    return res.json(populatedPost);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  likeUnlikePost,
  addCommentToPost
};
