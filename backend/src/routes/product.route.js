import { Router } from "express";
import { 
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/product.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { protectRoute, sellerOnly } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getProducts);          
router.get("/:id", getProductById);   

//(Seller only)
router.post("/", protectRoute, sellerOnly, upload.array("images", 5), createProduct);  
router.put("/:id", protectRoute, sellerOnly, updateProduct); 
router.delete("/:id", protectRoute, sellerOnly, deleteProduct);

export default router;