const express = require("express");
const authController = require("../Controllers/authController");
const likeDislikeController = require("../Controllers/likeDislikeController");
const IDvalidation = require("../Middleware/IDvalidation");

const router = express.Router();
//**************************GET ALL LIKES*********************************

router.get("/likes", authController.protect, likeDislikeController.getAllLikes);

//***************************GET ALL DISLIKES******************************

router.get(
  "/dislikes",
  authController.protect,
  likeDislikeController.getAllDislikes
);

/*like a particular blog*/
router.route("/:id?/like")
  .post(authController.protect, IDvalidation, likeDislikeController.likeBlog)

/*dislike a particular blog*/
router.route("/:id?/dislike")
  .post(authController.protect, IDvalidation, likeDislikeController.dislikeBlog)

module.exports = router;
