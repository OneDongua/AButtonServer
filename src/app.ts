import express from "express";
import userRoutes from "./routes/UserRoutes";
import path from "path";

const app = express();

app.use(express.json());

app.use("/api", userRoutes);

app.use('/static', express.static(path.join(__dirname, "../public")));

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
