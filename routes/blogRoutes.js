const express = require("express");
const blogDb = require("../models/blog");
const blogRouter = express.Router();
const multer = require("multer");
const path = require("path");
const commentDb = require("../models/comments");

// create storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, path.resolve(`public/uploads/`));
    cb(null, `public/uploads/`);
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

// get add blog
blogRouter.get("/add-blog", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

// post add blog
blogRouter.post("/", upload.single("coverImageUrl"), async (req, res) => {
  const { title, body } = req.body;
  const blog = await blogDb.create({
    title,
    body,
    createdBy: req.user.id,
    coverImageUrl: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${blog.id}`);
});

// fetch all blog
blogRouter.get("/all-blog", async (req, res) => {
  const body = req.body;
  const allBlogs = await blogDb.find({});
  return res.render("allBlog", {
    blog: allBlogs,
    user: req.user,
  });
});

// get blog by id
blogRouter.get("/:id", async (req, res) => {
  const blog = await blogDb.findById(req.params.id).populate("createdBy");
  const comments = await commentDb
    .find({ blogId: req.params.id })
    .populate("createdBy");
  // console.log("comments:::: ", comments);
  return res.render("viewBlog", {
    user: req.user,
    blog,
    comments,
  });
});

//  add comments ::::::::::::  do it later
blogRouter.post("/comment/:blogId", async (req, res) => {
  await commentDb.create({
    comment: req.body.comment,
    blogId: req.params.blogId,
    createdBy: req.user.id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

// exports
module.exports = blogRouter;
