import { Router } from "express";
import { protectRoute, userOnly, sellerOnly } from "../middlewares/auth.middleware.js";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getAllOrders,
} from "../controllers/order.controller.js";

const router = Router();

//for users
router.post("/", protectRoute, userOnly, createOrder);
router.get("/", protectRoute, userOnly, getUserOrders);
router.get("/:id", protectRoute, userOnly, getOrderById);

//for thee sellers
router.put("/:id/status", protectRoute, sellerOnly, updateOrderStatus);
router.delete("/:id", protectRoute, sellerOnly, deleteOrder);
router.get("/all", protectRoute, sellerOnly, getAllOrders);

export default router;
