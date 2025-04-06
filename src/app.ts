import express from "express";
import userRoutes from "./routes/UserRoutes";
import path from "path";
import NotificationRoutes from "./routes/NotificationRoutes";
import PostRoutes from "./routes/PostRoutes";
import cors from 'cors';
import ChatRoutes from "./routes/ChatRoutes";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", userRoutes);
app.use("/api", NotificationRoutes)
app.use("/api", PostRoutes)
app.use('/api', ChatRoutes);

app.use("/static", express.static(path.join(__dirname, "../public")));

let rootMessage = "Hello, TypeScript and Express!";

app.get("/", (req, res) => {
  res.send(rootMessage);
});

app.post("/upload", (req, res) => {
  console.log(req.body);
  if (req.body.msg) {
    rootMessage = req.body.msg;
    res.status(200).send("Upload success.");
  } else {
    res.status(400).send("Bad request: 'msg' parameter is required.");
  }
});

export default app;
