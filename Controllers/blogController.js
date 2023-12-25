const mongooseDelete = require("mongoose-delete");
const BlogPostModel = require("../models/blogModel");
const mongoose = require("mongoose");
const catchAsync = require("express-async-handler");
const AppError = require("../utils/appError");
const TopicModel = require("../models/topicModel");
const Comment = require("../models/commentModel");
const LikeDislike = require("../models/likeDislikeModel");

//******************************CREATE A NEW BLOGPOST******************************

const createBlogPost = catchAsync(
  async (req, res, next) => {
    const { title, author, content, blogTopic } = req.body;

    const topic = await TopicModel.findById(blogTopic);

    const topicName = topic.name;

    const blogPost = await BlogPostModel.create({
      title,
      author: req.user.name,
      blogTopic,
      content,
      user: req.user.id,
    });

    res.status(201).json({
      _id: blogPost._id,
      title,
      author,
      blogTopicID: topic._id,
      blogTopic: topicName,
      content,
      user: req.user.id,
    });
  },
  (error) => {
    res.status(500).json({ error: "Failed to create blog post" });
  }
);





//************************** GET MOST RECENT BLOGPOST **************************

const getMostRecentBlogPost = catchAsync(async (req, res, next) => {
  let query = req.query.limit || null; // for query
  if (query && isNaN(query))
    return next(new AppError("Query must be a Number"));

  const queryOptions = {};

  if (query) {
    const blogCount = await BlogPostModel.countDocuments();
    if (+query > blogCount) {
      return next(
        new AppError(
          "Limit exceeds number of available recent blog posts.",
          400
        )
      );
    }

    queryOptions.limit = +query;
  }

  const mostRecentBlog = await BlogPostModel.find()
    .sort({ createdAt: -1 })
    .populate("blogTopic", "name")
    .lean()
    .setOptions(queryOptions);

  if (mostRecentBlog.length === 0) {
    return next(new AppError("Blog Not Found", 400));
  }

  res.status(200).json(mostRecentBlog);
});

// ************************ GET LIKED BLOGS *************************

const getMostLikedBlog = catchAsync(async (req, res, next) => {
  const temp = await LikeDislike.aggregate([
    {
      $match: {
        like: true,
      },
    },
    {
      $group: {
        _id: "$blog",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $lookup: {
        from: "blogposts",
        localField: "_id",
        foreignField: "_id",
        as: "blog",
      },
    },
    {
      $unwind: "$blog",
    },
    {
      $project: {
        _id: "$blog._id",
        total_likes: "$count",
        title: "$blog.title",
        content: "$blog.content",
      },
    },
  ]);
  //console.log(temp);
  if (temp.length === 0) {
    return next(new AppError("No liked blog posts yet", 404));
  }



  res.json({
    output: temp[0],
  });
});

module.exports = {
  createBlogPost,
  getMostLikedBlog,
  getMostRecentBlogPost,
};
