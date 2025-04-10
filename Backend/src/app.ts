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

const port = 4000;
const mongoURI = "mongodb://localhost:27017";
const stripeKey ="sk_test_51R14N81Dh3gX2Lfp0qhJ8hSQU2LjazKsjBYq0axUSlBjEvD0tEfYhWW3z8FhSJDL5ipgtZk3EbK6RV8fpmrKph5t009DxqQ0Rp";
const redisURI = "reddis://default:wuJY1dPhwfvbMDb9YOh8uwGTUT87ah8x@redis-14490.c83.us-east-1-2.ec2.redns.redis-cloud.com:14490";
const clientURL = "http://localhost:5173";
export const redisTTL = process.env.REDIS_TTL || 60 * 60 * 4;


connectDB(mongoURI);
export const redis = connectRedis(redisURI);

cloudinary.config({
  cloud_name: "dizjhnmdn",
  api_key: "753791538196129",
  api_secret: "iY8J1ZkZjhfZwR-J0u_ik44z9h8",
});
console.log(stripeKey)

export const stripe = new Stripe(stripeKey);

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: [clientURL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("API Working with /api/v1");
});

// Using Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", dashboardRoute);

app.use("/uploads", express.static("uploads"));
// app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Express is working on http://localhost:${port}`);
});
