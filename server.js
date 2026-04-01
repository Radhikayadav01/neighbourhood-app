const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// DB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

// Schema
const RequestSchema = new mongoose.Schema({
  title: String,
  location: String,
  urgency: String,
  status: { type: String, default: "Open" },
  votes: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
});

const Request = mongoose.model("Request", RequestSchema);

// ================= ROUTES =================

// GET all (sorted by votes)
app.get("/requests", async (req, res) => {
  const data = await Request.find().sort({ votes: -1 });
  res.json(data);
});

// ADD request
app.post("/requests", async (req, res) => {
  const newReq = new Request(req.body);
  await newReq.save();
  res.json(newReq);
});

// UPVOTE
app.put("/vote/:id", async (req, res) => {
  await Request.findByIdAndUpdate(req.params.id, {
    $inc: { votes: 1 }
  });
  res.send("Voted");
});

// DELETE request
app.delete("/delete/:id", async (req, res) => {
  await Request.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

// TOGGLE STATUS (Open ↔ Completed)
app.put("/status/:id", async (req, res) => {
  const item = await Request.findById(req.params.id);

  const newStatus =
    item.status === "Open" ? "Completed" : "Open";

  await Request.findByIdAndUpdate(req.params.id, {
    status: newStatus
  });

  res.send("Status Updated");
});

// ==========================================

// Start server
app.listen(5000, () =>
  console.log("Server running on 5000")
);