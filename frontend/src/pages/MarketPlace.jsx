import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Search, Heart, Star, ShoppingBag, MapPin, Sparkles, Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAllProducts } from '../lib/api';

export default function ArtisanMarketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState(new Set());
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const backgroundX = useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1920], [-50, 50]);
  const backgroundY = useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 1080], [-30, 30]);

  // Fetch products using TanStack Query
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts,
  });

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Get unique categories from products data
  const getCategories = () => {
    const uniqueCategories = [...new Set(products.map(product => product.category))];
    const categoryEmojis = {
      'electronics': '📱',
      'jewelry': '💎',
      'pottery': '🏺',
      'textiles': '🧵',
      'art': '🎨',
      'wood': '🌳',
      'clothing': '👕',
      'books': '📚',
      'home': '🏠',
      'sports': '⚽'
    };
    
    const categoryColors = {
      'electronics': 'from-blue-500 to-cyan-500',
      'jewelry': 'from-yellow-500 to-orange-500',
      'pottery': 'from-amber-500 to-red-500',
      'textiles': 'from-purple-500 to-pink-500',
      'art': 'from-green-500 to-teal-500',
      'wood': 'from-amber-600 to-yellow-600',
      'clothing': 'from-pink-500 to-rose-500',
      'books': 'from-indigo-500 to-purple-500',
      'home': 'from-slate-500 to-gray-500',
      'sports': 'from-emerald-500 to-green-500'
    };

    return [
      { id: 'all', name: 'All Products', emoji: '✨', color: 'from-purple-500 to-pink-500' },
      ...uniqueCategories.map(category => ({
        id: category,
        name: category.charAt(0).toUpperCase() + category.slice(1),
        emoji: categoryEmojis[category] || '🛍️',
        color: categoryColors[category] || 'from-gray-500 to-slate-500'
      }))
    ];
  };

  const categories = getCategories();

  const filteredProducts = products.filter(product => {
    if (!product.isActive) return false;
    
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.seller.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div 
          className="text-white text-xl"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {isLoading ? 'Loading products...' : 'Curating artisan treasures...'}
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">
          Error loading products. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Dynamic Background */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        style={{ x: backgroundX, y: backgroundY }}
      >
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-pink-500/10 to-yellow-500/10 rounded-full blur-2xl"></div>
      </motion.div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 12}%`
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen">
        {/* Unique Header */}
        <motion.header 
          className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-slate-900/80 via-purple-900/80 to-slate-900/80 border-b border-white/10"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, type: "spring", damping: 20 }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <motion.div 
                className="flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Artisan Connect</h1>
                  <p className="text-white/50 text-xs">Where stories become treasures</p>
                </div>
              </motion.div>
              
              <div className="flex items-center gap-4">
                <motion.button
                  className="relative p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart size={20} className="text-white" />
                  {favorites.size > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {favorites.size}
                    </span>
                  )}
                </motion.button>
                
                <motion.button
                  className="relative p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ShoppingBag size={20} className="text-white" />
                  <span className="absolute -top-1 -right-1 bg-white text-purple-600 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    3
                  </span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.header>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Hero Search Section */}
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Discover
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                {" "}Authentic{" "}
              </span>
              Crafts
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Every piece has a story. Every artisan has a dream. Find treasures that connect you to their journey.
            </p>

            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" size={20} />
              <input
                type="text"
                placeholder="Search by product, seller, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all text-lg"
              />
            </div>
          </motion.div>

          {/* Category Selector */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`group relative px-6 py-3 rounded-2xl font-medium text-white backdrop-blur-sm border transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r ' + category.color + ' border-transparent shadow-lg scale-105'
                    : 'bg-white/10 border-white/20 hover:bg-white/20 hover:scale-105'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <span className="text-xl mr-2">{category.emoji}</span>
                {category.name}
                {selectedCategory === category.id && (
                  <motion.div
                    className="absolute inset-0 bg-white/20 rounded-2xl"
                    layoutId="activeCategory"
                  />
                )}
              </motion.button>
            ))}
          </motion.div>

          {/* Results */}
          <motion.p 
            className="text-center text-white/60 mb-8 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {filteredProducts.length} products available
          </motion.p>

          {/* Product Grid */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ scale: 0.8, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: -50 }}
                  transition={{ 
                    delay: index * 0.1,
                    type: "spring",
                    damping: 20,
                    stiffness: 100
                  }}
                  className="group relative"
                  onHoverStart={() => setHoveredProduct(product._id)}
                  onHoverEnd={() => setHoveredProduct(null)}
                >
                  <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2">
                    
                    {/* Product Image */}
                    <div className="relative h-80 overflow-hidden">
                      <motion.img 
                        src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop'} 
                        alt={product.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      />
                      
                      {/* Stock indicator */}
                      {product.quantity === 0 && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Out of Stock
                        </div>
                      )}
                      
                      {/* Floating Action Buttons */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <motion.button
                          onClick={() => toggleFavorite(product._id)}
                          className="p-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/20"
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          whileTap={{ scale: 0.8 }}
                        >
                          <Heart 
                            size={16} 
                            className={`${favorites.has(product._id) ? 'fill-pink-500 text-pink-500' : 'text-white'}`}
                          />
                        </motion.button>
                      </div>

                      {/* Product Info Overlay on Hover */}
                      <AnimatePresence>
                        {hoveredProduct === product._id && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6"
                          >
                            <div className="text-white">
                              <p className="text-sm mb-2 opacity-90">{product.description}</p>
                              <div className="flex items-center gap-4 text-xs">
                                <span>📦 Stock: {product.quantity}</span>
                                {product.tags.length > 0 && (
                                  <span>🏷️ {product.tags.slice(0, 2).join(', ')}</span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-white font-bold text-xl mb-1 group-hover:text-purple-300 transition-colors">
                            {product.title}
                          </h3>
                          <div className="flex items-center gap-2 text-white/60">
                            <span className="text-lg">🏪</span>
                            <div>
                              <p className="text-sm">{product.seller.businessName}</p>
                              <div className="flex items-center gap-1">
                                {product.seller.verified && (
                                  <span className="text-green-400 text-xs">✓ Verified</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">${product.price}</div>
                          <div className="flex items-center gap-1">
                            <Star className="fill-yellow-400 text-yellow-400" size={14} />
                            <span className="text-white/60 text-sm">
                              {product.rating > 0 ? product.rating : 'New'}
                            </span>
                            {product.totalReviews > 0 && (
                              <span className="text-white/40 text-xs">({product.totalReviews})</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      {product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {product.tags.slice(0, 3).map((tag, idx) => (
                            <span 
                              key={idx}
                              className="bg-white/10 text-white/70 px-2 py-1 rounded-lg text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <motion.button
                        className={`w-full font-semibold py-3 rounded-xl transition-all shadow-lg ${
                          product.quantity > 0 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600' 
                            : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                        }`}
                        whileHover={product.quantity > 0 ? { scale: 1.02, y: -1 } : {}}
                        whileTap={product.quantity > 0 ? { scale: 0.98 } : {}}
                        disabled={product.quantity === 0}
                      >
                        {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* No products message */}
          {filteredProducts.length === 0 && (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-white text-xl mb-2">No products found</h3>
              <p className="text-white/60">Try adjusting your search or category filters</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
