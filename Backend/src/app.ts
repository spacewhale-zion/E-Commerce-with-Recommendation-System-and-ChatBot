import express from "express";
import { connectDB, connectRedis } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import { config } from "dotenv";
import morgan from "morgan";
import Stripe from "stripe";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

// Importing Routes
import userRoute from "./routes/user.js";
import productRoute from "./routes/products.js";
import orderRoute from "./routes/order.js";
import paymentRoute from "./routes/payment.js";
import dashboardRoute from "./routes/stats.js";

config({
  path: "./.env",
});

// Environment variables
const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI;
const stripeKey = process.env.STRIPE_KEY;
const redisURI = process.env.REDIS_URI;
const clientURL = process.env.CLIENT_URI;
const cloudName = process.env.CLOUD_NAME;
const cloudApiKey = process.env.CLOUD_API_KEY;
const cloudApiSecret = process.env.CLOUD_API_SECRET;

// A simple check to ensure all required environment variables are loaded
if (!mongoURI || !stripeKey || !redisURI || !clientURL || !cloudName || !cloudApiKey || !cloudApiSecret) {
  console.error("Error: Missing one or more required environment variables. Please check your .env file.");
  process.exit(1); // Exit the application if essential configuration is missing
}

export const redisTTL = process.env.REDIS_TTL || 60 * 60 * 4;

// Service connections
connectDB(mongoURI);
export const redis = connectRedis(redisURI);
export const stripe = new Stripe(stripeKey);

cloudinary.config({
  cloud_name: cloudName,
  api_key: cloudApiKey,
  api_secret: cloudApiSecret,
});

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: [clientURL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Health check route
app.get("/", (req, res) => {
  res.send("API Working with /api/v1");
});

// Using Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", dashboardRoute);

// Static files and error handling
app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Express is working on http://localhost:${port}`);
});
