import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function ArtisanLanding() {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Transform mouse position for parallax effect
  const orb1X = useTransform(mouseX, [0, window?.innerWidth || 1920], [0, 30]);
  const orb1Y = useTransform(mouseY, [0, window?.innerHeight || 1080], [0, 30]);
  const orb2X = useTransform(mouseX, [0, window?.innerWidth || 1920], [0, -20]);
  const orb2Y = useTransform(mouseY, [0, window?.innerHeight || 1080], [0, -20]);

  const navigate=useNavigate()

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.02,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.98 }
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Clean animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Subtle floating orbs with mouse parallax */}
        <motion.div 
          className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          style={{
            top: '10%',
            left: '10%',
            x: orb1X,
            y: orb1Y
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute w-96 h-96 bg-blue-500/15 rounded-full blur-3xl"
          style={{
            top: '60%',
            right: '10%',
            x: orb2X,
            y: orb2Y
          }}
          animate={{
            scale: [1, 0.9, 1],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Subtle grid pattern */}
      <motion.div 
        className="absolute inset-0 opacity-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 2, delay: 1 }}
      >
        <div className="h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </motion.div>

      {/* Main content */}
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* Clean logo */}
        <motion.div 
          className="mb-16 text-white/90 text-xl font-medium tracking-wider"
          variants={itemVariants}
        >
          Artisan Connect
        </motion.div>

        {/* Main heading */}
        <motion.h1 
          className="mb-6 text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight"
          variants={itemVariants}
        >
          Where Authenticity
          <br />
          <motion.span 
            className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundSize: "200% 200%"
            }}
          >
            Meets the World
          </motion.span>
        </motion.h1>

        {/* Tagline */}
        <motion.p 
          className="mb-12 text-lg md:text-xl text-white/70 font-light max-w-2xl leading-relaxed"
          variants={itemVariants}
        >
          Connecting passionate creators with global audiences through trust, quality, and seamless discovery
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 mb-16"
          variants={itemVariants}
        >
          <motion.button 
            className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl text-lg shadow-xl"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
             onClick={()=>{navigate("/user/signup")}}
          >
            <motion.div 
              className="flex items-center justify-center gap-3"
              whileHover={{ gap: "16px" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.span 
                className="text-xl"
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                🛍️
              </motion.span>
              <span>Shop Authentic</span>
            </motion.div>
          </motion.button>
          
          <motion.button 
            className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl text-lg"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={()=>{navigate("/seller/signup")}}
          >
            <motion.div 
              className="flex items-center justify-center gap-3"
              whileHover={{ gap: "16px" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.span 
                className="text-xl"
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                ✨
              </motion.span>
              <span>List as Seller</span>
            </motion.div>
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-8 text-white/60 text-sm"
          variants={itemVariants}
        >
          {[
            { number: "10k+", label: "Artisans" },
            { number: "50+", label: "Countries" },
            { number: "100k+", label: "Happy Customers" }
          ].map((stat, index) => (
            <motion.div 
              key={stat.label}
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="text-2xl font-bold text-white mb-1"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.5
                }}
              >
                {stat.number}
              </motion.div>
              <div className="tracking-wide">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 text-white/40"
        style={{ x: "-50%" }}
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="text-xl">↓</div>
      </motion.div>
    </div>
  );
}