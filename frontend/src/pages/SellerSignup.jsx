import React, { useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { User, Mail, Lock, Store, Layers, Briefcase, FileCheck } from "lucide-react";

export default function SellerSignupPage() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const orbX = useTransform(mouseX, [0, typeof window !== "undefined" ? window.innerWidth : 1920], [-20, 20]);
  const orbY = useTransform(mouseY, [0, typeof window !== "undefined" ? window.innerHeight : 1080], [-15, 15]);

  useEffect(() => {
    const handleMouse = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    document.addEventListener("mousemove", handleMouse);
    return () => document.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY]);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Orbs Background */}
      <motion.div className="absolute inset-0 opacity-30" style={{ x: orbX, y: orbY }}>
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-pink-500/30 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-[28rem] h-[28rem] bg-gradient-to-r from-purple-500/30 to-blue-500/20 rounded-full blur-3xl"></div>
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto px-10 py-12 flex items-center gap-12">
        {/* Left Tagline */}
        <div className="hidden lg:flex w-1/2 flex-col justify-center">
          <motion.h1
            className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 leading-tight"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            Start Selling <br /> Your Creations
          </motion.h1>
          <p className="mt-6 text-white/70 max-w-md text-lg">
            Showcase your craftsmanship to buyers worldwide with Artisan Connect.
          </p>
        </div>

        {/* Right Form */}
        <motion.div
          className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-10 shadow-xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold text-white mb-8">Seller Signup</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Full Name */}
            <div>
              <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
                <User size={16} /> Full Name
              </label>
              <input
                type="text"
                placeholder="Amara Williams"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-pink-400 focus:ring-2 focus:ring-pink-500/40 placeholder-white/40"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
                <Mail size={16} /> Email
              </label>
              <input
                type="email"
                placeholder="you@crafts.com"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-pink-400 focus:ring-2 focus:ring-pink-500/40 placeholder-white/40"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
                <Lock size={16} /> Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-pink-400 focus:ring-2 focus:ring-pink-500/40 placeholder-white/40"
              />
            </div>

            {/* Shop Name */}
            <div>
              <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
                <Store size={16} /> Shop Name
              </label>
              <input
                type="text"
                placeholder="Maya’s Silk Studio"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-pink-400 focus:ring-2 focus:ring-pink-500/40 placeholder-white/40"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
                <Layers size={16} /> Craft Category
              </label>
              <select className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-pink-400 focus:ring-2 focus:ring-pink-500/40">
                <option value="">Select</option>
                <option>Jewelry</option>
                <option>Pottery</option>
                <option>Textiles</option>
                <option>Woodwork</option>
                <option>Art & Paintings</option>
                <option>Home Decor</option>
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
                <Briefcase size={16} /> Experience (Years)
              </label>
              <input
                type="number"
                placeholder="e.g. 5"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-pink-400 focus:ring-2 focus:ring-pink-500/40 placeholder-white/40"
              />
            </div>

            {/* GST / License */}
            <div>
              <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
                <FileCheck size={16} /> Tax ID / License
              </label>
              <input
                type="text"
                placeholder="Optional"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-pink-400 focus:ring-2 focus:ring-pink-500/40 placeholder-white/40"
              />
            </div>
          </form>

          {/* Signup Button */}
          <motion.button
            type="submit"
            className="w-full mt-8 py-4 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg hover:from-pink-600 hover:to-purple-600"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            Create Seller Account
          </motion.button>

          <p className="mt-6 text-center text-white/60">
            Already selling?{" "}
            <a href="/login" className="text-pink-400 hover:text-purple-400 font-semibold">
              Login
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
