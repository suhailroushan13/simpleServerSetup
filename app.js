import express from "express";
import config from "config";
const app = express();

const PORT = config.get("PORT") || 5000;

import "./dbConnect.js";

import userRouter from "./controllers/users/index.js";

app.get("/", (req, res) => {
  res.status(200).send("Hello Server Running");
});

app.use(express.json());

app.use("/api/users", userRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Invalid Route" });
});

app.listen(PORT, () => {
  console.log(`Server Listening At Port Number ${PORT}`);
});
