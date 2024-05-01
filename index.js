import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import router from "./routes/routes.js";

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
    process.exit(1);
  });

const app = express();
const port = 8000;

// Configure the CORS for whitelisted domains.
const allowedOrigins = process.env.WHITELISTED_DOMAINS;
const corsOptions = {
  origin: (origin, callback) => {
    // Check if the origin is allowed
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS -> " + origin));
    }
  },
  methods: "POST,GET",
  credentials: true, // Enable credentials (if needed)
  optionsSuccessStatus: 204, // Respond with a 204 status for preflight requests
};

// Apply CORS middleware globally to all routes
app.use((req, res, next) => {
  const excludeRoutes = ["/test"]; // You can include routes that don't use Whitelisted domains.
  if (excludeRoutes.includes(req.path)) {
    cors()(req, res, next);
  } else {
    cors(corsOptions)(req, res, next);
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/test", (req, res) => {
  res.send("Hello World!");
});
app.use("/", router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
