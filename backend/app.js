import express from "express";
const app = express();
import cors from "cors";
import aiRoute from "./routes/ai.route.js";
import userRoute from "./routes/user.route.js";
import entryRoute from "./routes/entry.route.js";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";

app.set("trust proxy", 1);

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

console.log("CORS ORIGIN:", process.env.CLIENT_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT;

app.use("/entries", entryRoute);
app.post("/analyze", aiRoute);
app.use("/user", userRoute);

app.get("/health", (_, res) => {
  res.status(200).send("OK")
})

app.listen(port, (req, res) => {
  connectDB();
  console.log("Running Port on ", port);
});
