const Comment = require("../models/commentModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const BlogPostModel = require("../models/blogModel");
const { default: mongoose } = require("mongoose");

// ******************************** GET ALL COMMENTS ********************************

const getAllComments = catchAsync(async (req, res, next) => {


  const comments = await Comment.find()
    .populate({
      path: "commentBy",
      select: "name -_id",
      strictPopulate: false,
    })
    .populate({
      path: "blog",
      select: "title",
      strictPopulate: false,
    });

  res.status(200).json({
    numberOfComments: comments.length,

    comments,
  });
});




// ****************************** CREATE COMMENT ****************************

const createComment = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const newComment = await Comment.create({
    content: req.body.content,
    blog: id,
    commentBy: req.user.id,
  });

  if (newComment) {
    res.status(201).json({
      comment: newComment,
    });
  } else {
    res.status(400).json({
      message: "comment not created",
    });
  }
});






module.exports = {
  getAllComments,
  createComment

};
