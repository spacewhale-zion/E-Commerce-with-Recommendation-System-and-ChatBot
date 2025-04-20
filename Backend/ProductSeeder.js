// productSeeder.js
import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import { Product } from "./dist/models/product.js"; // Adjust path if needed

dotenv.config();

const MONGO_URI = "mongodb://localhost:27017/Ecommerce_24";

const seedProducts = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");

    // Fetch products from fake store API
    const { data: products } = await axios.get("https://fakestoreapi.com/products");

    // Reformat and save each product
    for (const item of products) {
      const product = new Product({
        name: item.title,
        price: item.price,
        description: item.description,
        stock: item.rating.count || 10, // Using rating count as stock
        category: item.category,
        photos: [
          {
            public_id: `fake_${item.id}`, // Dummy public_id
            url: item.image, // From API
          },
        ],
        ratings: item.rating.rate || 0,
        numOfReviews: item.rating.count || 0,
      });

      await product.save();
      console.log(`✅ Saved: ${item.title}`);
    }

    console.log("🌱 Seeding Complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding Error:", err);
    process.exit(1);
  }
};

seedProducts();
