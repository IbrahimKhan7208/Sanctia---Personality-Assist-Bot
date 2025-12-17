import express from "express";
const app = express();
import cors from "cors";
import aiRoute from "./routes/ai.route.js";
import userRoute from "./routes/user.route.js";
import entryRoute from "./routes/entry.route.js";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";

app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:5173",
  "https://sanctia-personality-assist-bot.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like curl, health checks)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


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
