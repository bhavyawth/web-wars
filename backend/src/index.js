import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();
import { connectDB } from './lib/db.js';
import userRoutes from "./routes/user.route.js";
import sellerRoutes from "./routes/seller.route.js";
import productRoutes from "./routes/product.route.js";
import orderRoutes from "./routes/order.route.js"; 
import cartRoutes from "./routes/cart.route.js";
import statsRoutes from "./routes/stats.route.js";
import reviewRoutes from "./routes/review.route.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));       // default is 100kb
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

app.use("/api/user", userRoutes);    
app.use("/api/seller", sellerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/reviews", reviewRoutes);

const startServer = async () => {
  try {
    await connectDB(); 
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to DB:', err);
    process.exit(1); 
  }
};

startServer();