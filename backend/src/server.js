import "./config.js";
import express from "express";
import cors from "cors";
import connectDB from "./database/connection.js";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
const app = express();

app.use(
  cors({
   origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/", router);

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
