import React from 'react';
import { motion } from 'framer-motion';

export const BouncingDotsLoader = ({ text = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        {/* Three bouncing dots */}
        <div className="flex space-x-2 mb-4 justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
        
        <p className="text-white/80">{text}</p>
      </div>
    </div>
  );
};
