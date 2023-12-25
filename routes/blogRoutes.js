const express = require("express");
const blogController = require("../Controllers/blogController");
const authController = require("../Controllers/authController");
const blogDetailValidation = require("../Middleware/blogDetailValidation");
const IDvalidation = require("../Middleware/IDvalidation");

const router = express.Router();
// ***********************GET MOST RECENT BLOGPOST***********************

router.get(
  "/getMostRecentBlog",
  authController.protect,
  blogController.getMostRecentBlogPost
);

// *************************GET MOST LIKED POSTS**************************

router.get(
  "/mostLiked",
  authController.protect,
  blogController.getMostLikedBlog
);


// **********************************CREATE A NEW BLOG********************
router.post(
  "/create",
  authController.protect,
  blogDetailValidation,
  blogController.createBlogPost
);



module.exports = router;
