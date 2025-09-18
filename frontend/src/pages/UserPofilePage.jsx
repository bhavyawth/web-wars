import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { MapPin, ShoppingBag, Calendar, CheckCircle, Clock, Truck } from "lucide-react";

export default function UserProfilePage() {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const orbX = useTransform(mouseX, [0, typeof window !== "undefined" ? window.innerWidth : 1920], [-30, 30]);
  const orbY = useTransform(mouseY, [0, typeof window !== "undefined" ? window.innerHeight : 1080], [-20, 20]);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const user = {
    name: "Alex Johnson",
    avatar: "👨🏻",
    location: "New York, USA",
    address: "123 Artisan Street, Brooklyn, NY 11215",
    joined: "Joined August 2022",
    orders: [
      {
        id: 1,
        product: "Handwoven Silk Scarf",
        date: "Sep 12, 2025",
        status: "Delivered",
        price: 89,
        image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=200&h=200&fit=crop",
      },
      {
        id: 2,
        product: "Ceramic Tea Set",
        date: "Aug 25, 2025",
        status: "Shipped",
        price: 156,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop",
      },
      {
        id: 3,
        product: "Abstract Canvas Art",
        date: "Jul 30, 2025",
        status: "Processing",
        price: 245,
        image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&h=200&fit=crop",
      },
    ],
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          className="text-white text-xl"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading profile...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <motion.div className="absolute inset-0 opacity-30" style={{ x: orbX, y: orbY }}>
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-500/30 to-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-purple-500/20 rounded-full blur-3xl"></div>
      </motion.div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* User Info Card */}
        <motion.div
          className="bg-white/5 rounded-3xl border border-white/10 p-8 backdrop-blur-sm flex flex-col lg:flex-row gap-8 items-center lg:items-start"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Avatar */}
          <div className="text-7xl">{user.avatar}</div>

          {/* User Info */}
          <div className="flex-1 space-y-4 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white">{user.name}</h2>
            <p className="text-white/70 flex items-center justify-center lg:justify-start gap-2">
              <MapPin size={16} /> {user.location}
            </p>
            <p className="text-white/60 flex items-center justify-center lg:justify-start gap-2">
              <Calendar size={16} /> {user.joined}
            </p>
            <p className="text-white/80">{user.address}</p>
          </div>
        </motion.div>

        {/* Order History */}
        <motion.section
          className="mt-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-white mb-6">Order History</h3>
          <div className="space-y-6">
            {user.orders.map((order, index) => (
              <motion.div
                key={order.id}
                className="bg-white/5 rounded-2xl border border-white/10 p-6 flex items-center gap-6 hover:bg-white/10 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <img src={order.image} alt={order.product} className="w-20 h-20 object-cover rounded-xl" />
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-lg">{order.product}</h4>
                  <p className="text-white/60 text-sm">{order.date}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm">
                    {order.status === "Delivered" && <CheckCircle size={16} className="text-green-400" />}
                    {order.status === "Shipped" && <Truck size={16} className="text-blue-400" />}
                    {order.status === "Processing" && <Clock size={16} className="text-yellow-400" />}
                    <span className="text-white/70">{order.status}</span>
                  </div>
                </div>
                <div className="text-white font-bold text-lg">${order.price}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
