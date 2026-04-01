const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ MongoDB connect
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("DB Connected"))
.catch(err => console.log(err));

// ✅ Schema
const RequestSchema = new mongoose.Schema({
  title: String,
  location: String,
  urgency: String,
  status: { type: String, default: "Open" },
  created_at: { type: Date, default: Date.now },
  votes: { type: Number, default: 0 }
});

const Request = mongoose.model("Request", RequestSchema);

// ✅ API routes
app.get("/requests", async (req, res) => {
  const data = await Request.find().sort({ votes: -1 });
  res.json(data);
});

app.post("/requests", async (req, res) => {
  const newReq = new Request(req.body);
  await newReq.save();
  res.json(newReq);
});

app.put("/vote/:id", async (req, res) => {
  await Request.findByIdAndUpdate(req.params.id, { $inc: { votes: 1 } });
  res.send("Voted");
});

// ✅ IMPORTANT (FRONTEND SERVE)
app.use(express.static(path.join(__dirname, "client")));

// 👉 ROOT route fix
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

// ✅ start server
app.listen(5000, () => console.log("Server running on 5000"));