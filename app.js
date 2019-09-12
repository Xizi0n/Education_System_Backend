const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//Routes
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/courses");
const userRoutes = require("./routes/users");
const lessonRoutes = require("./routes/lesson");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/course", courseRoutes);
app.use("/user", userRoutes);
app.use("/lesson", lessonRoutes);

mongoose
  .connect(
    "mongodb+srv://adam:GKLCVf35uvgx3Bev@cluster0-p72yj.mongodb.net/tudastar"
  )
  .then(() => {
    app.listen(3333, () => {
      console.log("App runnning");
    });
  })
  .catch(err => {
    console.log(err);
  });
