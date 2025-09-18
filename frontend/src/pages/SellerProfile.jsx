import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Heart, ShoppingBag, Star, MapPin, Users, Share2, Camera, Calendar, Globe, Instagram, Twitter } from 'lucide-react';

export default function SellerProfilePage() {
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
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const user = {
    name: "Amara Williams",
    avatar: "👩🏾‍🎨",
    location: "Cape Town, South Africa",
    joined: "Joined March 2021",
    bio: "Painter. Dreamer. Storyteller. Each canvas tells a piece of my journey through light, color, and soul.",
    followers: 3400,
    following: 180,
    rating: 4.9,
    social: {
      instagram: "amarapaints",
      twitter: "amara_art"
    },
    skills: ["Painting", "Mixed Media", "Abstract Art", "Color Theory"],
    featuredWorks: [
      {
        id: 1,
        name: "Golden Horizon",
        image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=600&fit=crop",
        price: 349
      },
      {
        id: 2,
        name: "Whispers of the Sea",
        image: "https://images.unsplash.com/photo-1542039364853-a64f9c9fb467?w=600&h=600&fit=crop",
        price: 499
      },
      {
        id: 3,
        name: "Shadows & Light",
        image: "https://images.unsplash.com/photo-1550948390-6f1a9f2d5c72?w=600&h=600&fit=crop",
        price: 275
      }
    ]
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
      {/* Animated Orb Background */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        style={{ x: orbX, y: orbY }}
      >
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-500/30 to-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-purple-500/20 rounded-full blur-3xl"></div>
      </motion.div>

      {/* Profile Header */}
      <motion.header 
        className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-white/10"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white tracking-wide">Artisan Connect</h1>
          <div className="flex items-center gap-3">
            <motion.button
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="text-white" size={20} />
            </motion.button>
            <motion.button
              className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag size={20} className="text-white" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* User Profile Card */}
        <motion.div 
          className="bg-white/5 rounded-3xl border border-white/10 p-8 backdrop-blur-sm"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="text-8xl">{user.avatar}</div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-white">{user.name}</h2>
              <p className="text-white/70 flex items-center justify-center lg:justify-start gap-2">
                <MapPin size={16} /> {user.location}
              </p>
              <p className="text-white/60 flex items-center justify-center lg:justify-start gap-2">
                <Calendar size={16} /> {user.joined}
              </p>
              <p className="text-white/80 max-w-xl">{user.bio}</p>
              <div className="flex items-center justify-center lg:justify-start gap-6">
                <div className="flex items-center gap-2 text-white/80">
                  <Users size={18} /><span>{user.followers} followers</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Heart size={18} /><span>{user.following} following</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Star className="fill-yellow-400 text-yellow-400" size={18} /><span>{user.rating} rating</span>
                </div>
              </div>

              {/* Socials */}
              <div className="flex gap-4 mt-4 justify-center lg:justify-start">
                <a href={`https://instagram.com/${user.social.instagram}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-pink-400 hover:text-pink-300">
                  <Instagram size={18} /> @{user.social.instagram}
                </a>
                <a href={`https://twitter.com/${user.social.twitter}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sky-400 hover:text-sky-300">
                  <Twitter size={18} /> @{user.social.twitter}
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Skills Tags */}
        <motion.div 
          className="flex flex-wrap gap-3 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {user.skills.map((skill, i) => (
            <span key={i} className="px-4 py-2 bg-white/10 border border-white/20 text-white/80 rounded-full text-sm shadow-sm">
              {skill}
            </span>
          ))}
        </motion.div>

        {/* Featured Works */}
        <motion.section 
          className="mt-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-white mb-6">Featured Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {user.featuredWorks.map((art, index) => (
              <motion.div 
                key={art.id}
                className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden hover:bg-white/10 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <img src={art.image} alt={art.name} className="w-full h-56 object-cover" />
                <div className="p-4">
                  <h4 className="text-white font-semibold">{art.name}</h4>
                  <p className="text-white/70">${art.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
