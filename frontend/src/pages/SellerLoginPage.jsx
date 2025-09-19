import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Store, Lock } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sellerLogin } from "../lib/api"; // Import API call
import { Link, useNavigate } from "react-router-dom";

export default function SellerLoginPage() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Orb motion
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const orbX = useTransform(mouseX, [0, typeof window !== "undefined" ? window.innerWidth : 1920], [-20, 20]);
  const orbY = useTransform(mouseY, [0, typeof window !== "undefined" ? window.innerHeight : 1080], [-15, 15]);

  useEffect(() => {
    setMounted(true);
    const handleMouse = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    document.addEventListener("mousemove", handleMouse);
    return () => document.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY]);

  // Mutation for login
  const { mutate: loginMutation, isPending, error } = useMutation({
    mutationFn: sellerLogin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/seller/dashboard");
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <motion.div
          className="text-white text-xl"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading seller login...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Orbs */}
      <motion.div className="absolute inset-0 opacity-30" style={{ x: orbX, y: orbY }}>
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-500/40 to-pink-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-purple-500/20 rounded-full blur-3xl"></div>
      </motion.div>

      {/* Left Section */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-center p-12 relative z-10">
        <motion.h1
          className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 leading-tight text-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Welcome Back, Seller
        </motion.h1>
        <p className="mt-6 text-white/70 max-w-md text-lg text-center">
          Manage your artisan store, track orders, and connect with your customers.
        </p>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <motion.div
          className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Seller Login</h2>
          {error && <p className="text-red-500 mb-4 text-center">{error.response?.data?.message || "Login failed. Try again."}</p>}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-white/80 text-sm mb-2">Email</label>
              <div className="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 py-3">
                <Store className="text-white/60 mr-3" size={18} />
                <input
                  type="email"
                  placeholder="seller@example.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="bg-transparent text-white w-full outline-none placeholder-white/40"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-white/80 text-sm mb-2">Password</label>
              <div className="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 py-3">
                <Lock className="text-white/60 mr-3" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="bg-transparent text-white w-full outline-none placeholder-white/40"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isPending}
              className="w-full py-4 mt-4 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-purple-500 to-pink-500 shadow-md hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              {isPending ? "Logging in..." : "Login"}
            </motion.button>
          </form>

          {/* Signup Link */}
          <p className="mt-6 text-center text-white/60">
            Don’t have an account?{" "}
            <Link to="/seller/signup" className="text-purple-400 hover:text-pink-400 font-semibold">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
