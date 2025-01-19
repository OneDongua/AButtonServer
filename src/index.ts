import express from "express";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
