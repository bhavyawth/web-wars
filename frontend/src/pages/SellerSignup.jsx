import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { User, Mail, Lock, Building, FileText } from "lucide-react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sellerSignup } from '../lib/api'; // Add this function to your api.js

export default function SellerSignupPage() {
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    password: '',
    businessName: '',
    description: ''
  });

  const queryClient = useQueryClient();
  const { mutate: signupMutation, isPending, error } = useMutation({
    mutationFn: sellerSignup,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['authUser'] }), // Refetch auth user
  });

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

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
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-500/40 to-pink-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-purple-500/20 rounded-full blur-3xl"></div>
      </motion.div>
      {/* Left Side - Big Signup Text */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-center p-12 relative z-10">
        <motion.h1
          className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 leading-tight"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Start Your <br /> Artisan Business
        </motion.h1>
        <p className="mt-6 text-white/70 max-w-md text-lg">
          Showcase your crafts to the world. Connect with buyers and grow your artisan business.
        </p>
      </div>
      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <motion.div
          className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6">Seller Signup</h2>
          {error && <p className="text-red-500 mb-4">{error.response?.data?.message || 'Signup failed. Try again.'}</p>}
          <form className="space-y-5" onSubmit={handleSignup}>
            {/* Full Name */}
            <div>
              <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
                <User size={16} /> Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm text-white placeholder-white/40 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 transition-all"
                value={signupData.fullName}
                onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                required
              />
            </div>
            {/* Email */}
            <div>
              <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
                <Mail size={16} /> Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm text-white placeholder-white/40 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 transition-all"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                required
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
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm text-white placeholder-white/40 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 transition-all"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                required
              />
            </div>
            {/* Business Name */}
            <div>
              <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
                <Building size={16} /> Business Name
              </label>
              <input
                type="text"
                placeholder="Artisan Crafts Co."
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm text-white placeholder-white/40 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 transition-all"
                value={signupData.businessName}
                onChange={(e) => setSignupData({ ...signupData, businessName: e.target.value })}
                required
              />
            </div>
            {/* Description */}
            <div>
              <label className="text-white/70 text-sm mb-2 flex items-center gap-2">
                <FileText size={16} /> Description (Optional)
              </label>
              <textarea
                placeholder="Tell us about your business..."
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm text-white placeholder-white/40 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 transition-all"
                value={signupData.description}
                onChange={(e) => setSignupData({ ...signupData, description: e.target.value })}
                rows={3}
              />
            </div>
            {/* Signup Button */}
            <motion.button
              type="submit"
              className="w-full py-4 mt-4 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-purple-500 to-pink-500 shadow-md hover:from-purple-600 hover:to-pink-600 relative overflow-hidden"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.97 }}
              disabled={isPending}
            >
              {isPending ? 'Signing Up...' : 'Signup as Seller'}
            </motion.button>
          </form>
          <p className="mt-6 text-center text-white/60">
            Already have an account?{" "}
            <a href="/login" className="text-purple-400 hover:text-pink-400 font-semibold">
              Login
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
