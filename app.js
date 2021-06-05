const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground");

//Set up default mongoose connection
const mongoDB = "mongodb://127.0.0.1/onyxCamp";
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//middleware
// needed when we want to post a data
app.use(express.urlencoded({ extended: true }));

// creating new data or products
app.get("/", (req, res) => {
  res.render("home");
});

// create the index file route for the client side
app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

// create the render form file route for the client side
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// create the show file route for the client side
app.get("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/show", { campground });
});

app.post("/campgrounds", async (req, res) => {
  // res.send(req.body);
  const newCampground = new Campground(req.body.campground);
  await newCampground.save();
  res.redirect(`/campgrounds/${newCampground._id}`);
});

// localhost
app.listen(3005, () => {
  console.log("APP IS LISTENING ON PORT 3005");
});
