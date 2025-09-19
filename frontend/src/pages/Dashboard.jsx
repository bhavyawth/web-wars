import React, { useState } from "react";
import { motion } from "framer-motion";
import { Pie, Bar } from "react-chartjs-2";
import { toast } from "react-hot-toast";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, LogOut } from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";
import { sendVerificationEmail } from "../lib/api"; // Ensure this function exists in your api.js

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function SellerDashboard() {
  const { authUser } = useAuthUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSending, setIsSending] = useState(false);

  // logout mutation
  const { mutate: logoutMutation } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/");
    },
  });

  const handleLogout = () => {
    logoutMutation("seller");
  };

  // Dummy data
  const topCategories = [
    { category: "Handicrafts", totalSales: 1200 },
    { category: "Jewelry", totalSales: 950 },
    { category: "Apparel", totalSales: 800 },
    { category: "Home Decor", totalSales: 700 },
    { category: "Art Supplies", totalSales: 500 },
  ];

  const topSellers = [
    { seller: "Crafty Co.", totalSales: 1500 },
    { seller: "Artisan Hub", totalSales: 1300 },
    { seller: "Handmade Wonders", totalSales: 1100 },
    { seller: "Creative Souls", totalSales: 900 },
    { seller: "Unique Crafts", totalSales: 800 },
  ];

  const pieData = {
    labels: topCategories.map((c) => c.category),
    datasets: [
      {
        label: "Total Sales",
        data: topCategories.map((c) => c.totalSales),
        backgroundColor: ["#9333EA", "#EC4899", "#FBBF24", "#3B82F6", "#10B981"],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: topSellers.map((s) => s.seller),
    datasets: [
      {
        label: "Total Sales ($)",
        data: topSellers.map((s) => s.totalSales),
        backgroundColor: "#F472B6",
      },
    ],
  };

  const handleSendVerification = async () => {
    setIsSending(true);
    try {
      const res = await sendVerificationEmail(); // make sure to import this
      toast.success(res.message || "Verification email sent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send verification email");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br  from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Seller Navigation */}
      <motion.nav
        className="sticky top-0 left-0 right-0 bg-gradient-to-r from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-md border-t border-white/10 z-50"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-white flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
            >
              <ShoppingBag size={16} className="text-white" />
            </motion.div>
            Artisan Connect
          </Link>

          {/* Right Side: Dashboard + Logout */}
          <div className="flex items-center gap-6 text-white font-medium">
            <Link to="/seller/dashboard" className="hover:text-purple-400 transition">
              Dashboard
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Verify Now Row */}
      {/* Verify Now Row */}
      {!authUser?.verified && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-6 py-4 mt-4 bg-white/10 backdrop-blur-md rounded-xl flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-white text-lg">
            Verify your email to unlock full seller features and get your verified badge.
          </p>
          <button
            onClick={async () => {
              setIsSending(true);
              try {
                const res = await sendVerificationEmail();
                toast.success(res.message || "Verification email sent!");
                queryClient.invalidateQueries({ queryKey: ["authUser"] }); // <- ensures the row disappears after sending
              } catch (err) {
                toast.error(err.response?.data?.message || "Failed to send verification email");
              } finally {
                setIsSending(false);
              }
            }}
            disabled={isSending}
            className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full hover:from-yellow-500 hover:to-orange-600 transition-all"
          >
            {isSending ? "Sending..." : "Verify Now"}
          </button>
        </motion.div>
      )}


      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-8 mt-12 ">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Top 5 Categories</h2>
          <Pie data={pieData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Highest Sellers</h2>
          <Bar data={barData} />
        </motion.div>
      </div>
    </div>
  );
}
