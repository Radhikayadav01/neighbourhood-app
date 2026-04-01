const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// In-memory data
let requests = [];

// TEST
app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

// GET all requests
app.get("/requests", (req, res) => {
  res.json(requests);
});

// ADD request
app.post("/request", (req, res) => {
  const newRequest = {
    id: Date.now(),
    title: req.body.title,
    location: req.body.location,
    urgency: req.body.urgency,
    votes: 0,
    status: "Open"
  };

  requests.push(newRequest);
  res.json(newRequest);
});

// VOTE
app.put("/vote/:id", (req, res) => {
  const item = requests.find(r => r.id == req.params.id);
  if (item) item.votes++;
  res.json(item);
});

// CHANGE STATUS
app.put("/status/:id", (req, res) => {
  const item = requests.find(r => r.id == req.params.id);
  if (item) {
    item.status = item.status === "Open" ? "Closed" : "Open";
  }
  res.json(item);
});

// DELETE
app.delete("/delete/:id", (req, res) => {
  requests = requests.filter(r => r.id != req.params.id);
  res.json({ success: true });
});

// 🔥 IMPORTANT: serve frontend (fix tera issue)
app.use(express.static(path.join(__dirname, "client")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

// START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});