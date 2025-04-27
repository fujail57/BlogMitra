require("dotenv").config();
const { configDotenv } = require("dotenv");
const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");

// local module
const userRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/auth");
const { validateToken } = require("./services/authentication");
const blogRouter = require("./routes/blogRoutes");
const blogDb = require("./models/blog");

// port
const PORT = process.env.PORT || 8000;

// connection
mongoose
  // .connect("mongodb://127.0.0.1:27017/blogify")
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Mongoose connected"))
  .catch((err) => console.log("Mongoose error ", err));

// ejs
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// middlewear
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve("./public")));
// auth middleware
app.use(checkForAuthenticationCookie("token"));

// routes
app.get("/", async (req, res) => {
  const allBlogs = await blogDb.find({}).populate("createdBy");
  res.render("home", {
    blogs: allBlogs,
    user: req.user,
  });
});

app.use("/user", userRoutes);
app.use("/blog", blogRouter);

app.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
