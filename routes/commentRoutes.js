const express = require("express");
const blogController = require("../Controllers/blogController");
const authController = require("../Controllers/authController");
const commentController = require("../Controllers/commentController");
const IDvalidation = require("../Middleware/IDvalidation");

const router = express.Router();

router
  .route("/getAllComments")
  .get(authController.protect, commentController.getAllComments);



router
  .route("/:id?")
  .post(authController.protect, IDvalidation, commentController.createComment)


  ;

module.exports = router;
