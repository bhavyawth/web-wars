import { Router } from "express";
import {  
  signupHandler, 
  loginHandler, 
  logoutHandler, 
  updateProfileHandler, 
  checkAuthHandler
} from "../controllers/user.controller.js";
import { protectRoute, userOnly } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", signupHandler);

router.post("/login", loginHandler);

router.post("/logout", protectRoute, userOnly, logoutHandler);

router.put("/profile", protectRoute, userOnly, updateProfileHandler);

router.get("/check", protectRoute, userOnly, checkAuthHandler);


export default router;