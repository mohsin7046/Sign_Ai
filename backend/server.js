import express from "express";
import exec from "child_process";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const port = 3000;

app.get("/start-video", (req, res) => {
  exec("python3 main.py", (err, stdout, stderr) => {
    if (err) {
      console.error(`Error: ${stderr}`);
      res.status(500).send("Error starting video");
      return;
    }
    res.send("Video started successfully");
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
