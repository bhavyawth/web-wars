import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const PrizeGrid = ({ onWin, onClose }) => {
  const prizes = [
    { type: "none", description: "Better Luck Next Time!" },
    { type: "shipping", description: "Free Shipping!" },
    { type: "percentage", value: 5, description: "Flat 5% Discount!" },
    { type: "none", description: "Oops! You missed your chance" }
  ];

  const [revealedIndex, setRevealedIndex] = useState(null);
  const [jumbledPrizes, setJumbledPrizes] = useState([]);

  useEffect(() => {
    // Shuffle prizes on mount
    setJumbledPrizes([...prizes].sort(() => Math.random() - 0.5));
  }, []);

  const handleClick = (index) => {
    if (revealedIndex !== null) return; // only allow one reveal
    setRevealedIndex(index);

    const prize = jumbledPrizes[index]; 
    if (prize.type !== "none") {
      onWin(prize); // notify parent about prize
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <motion.div
        className="bg-slate-900 rounded-3xl shadow-2xl p-8 w-full max-w-lg text-center border border-white/10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-purple-400">
          🎉 Click a box to reveal your prize! 🎉
        </h2>

        <div className="grid grid-cols-2 gap-4 justify-items-center items-center">
          {jumbledPrizes.map((prize, index) => (
            <motion.div
              key={index}
              onClick={() => handleClick(index)}
              className={`flex items-center justify-center aspect-square w-full rounded-2xl cursor-pointer
                transition-transform duration-500 transform text-center px-2 overflow-hidden
                ${
                  revealedIndex === index
                    ? "bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 text-white scale-110 shadow-xl"
                    : "bg-gradient-to-r from-purple-700 via-purple-800 to-purple-900 text-transparent hover:scale-105 hover:text-white"
                }
              `}
              whileHover={{ scale: revealedIndex === index ? 1.12 : 1.05 }}
              layout
            >
              {revealedIndex === index && (
                <span className="font-bold text-wrap">{prize.description}</span>
              )}
            </motion.div>
          ))}
        </div>


        {revealedIndex !== null && (
          <div className="mt-6 flex flex-col gap-4">
            <p className="text-lg font-semibold text-purple-400">
              🎊 You got: {jumbledPrizes[revealedIndex].description} 🎊
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-purple-500 rounded-xl font-semibold text-white hover:bg-purple-600 transition-all"
            >
              Close
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PrizeGrid;
