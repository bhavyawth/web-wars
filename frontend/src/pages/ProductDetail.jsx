import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Heart, Star, ShoppingBag, MapPin, Clock, Palette, Shield, Truck, ArrowLeft, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProduct } from '../lib/api';
import { useParams } from 'react-router-dom';

export default function ProductDetailPage({ productId }) {  // Assuming productId is passed as prop (e.g., from route)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('story');
  const [mounted, setMounted] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const backgroundX = useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1920], [-30, 30]);
  const backgroundY = useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 1080], [-20, 20]);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const {id}=useParams()
  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),  // 👈 return the promise
    enabled: !!id,                  // only run when id is available
  });

  // Normalize fetched data to match expected structure, with placeholders for missing fields
  const product = data ? {
    id: data._id,
    name: data.title?.replace(/"/g, '').trim() || 'Untitled Product',
    price: data.price || 0,
    originalPrice: null,  // Not in data, can add logic if needed
    rating: data.rating || 0,
    totalReviews: data.totalReviews || 0,
    inStock: data.quantity || 0,
    images: data.images && data.images.length > 0 ? data.images : ['https://via.placeholder.com/800x800'],
    category: data.category?.replace(/"/g, '').trim() || 'Uncategorized',
    artisan: {
      name: data.seller?.businessName?.trim() || 'Unknown Artisan',
      avatar: '🛍️',  // Placeholder
      location: 'Global',  // Placeholder, not in data
      experience: '',  // Placeholder
      speciality: data.tags ? data.tags.join(', ') : '',  // Use tags as speciality
      story: data.description?.replace(/"/g, '').trim() || 'No story available',
      totalProducts: 0,  // Placeholder
      followers: 0,  // Placeholder
      rating: data.rating || 0
    },
    description: data.description?.replace(/"/g, '').trim() || 'No description available',
    story: data.description?.replace(/"/g, '').trim() || 'No story available',
    details: {
      material: data.tags ? data.tags.join(', ') : 'Various materials',
      dimensions: '',  // Not in data
      weight: '',  // Not in data
      careInstructions: '',  // Not in data
      origin: '',  // Not in data
      craftTime: '',  // Not in data
      uniqueFeatures: data.tags || []  // Use tags as features
    },
    sustainability: {
      ecofriendly: data.isActive,  // Arbitrary mapping, adjust as needed
      fairTrade: data.seller?.verified || false,
      carbonNeutral: false,  // Placeholder
      packaging: ''  // Placeholder
    }
  } : null;

  // Keep dummy reviews and relatedProducts as they are not part of fetched data
  const reviews = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: '👩🏼',
      rating: 5,
      date: '2 weeks ago',
      verified: true,
      comment: 'Absolutely breathtaking! The quality is incredible and you can feel the love and care that went into making this. Maya\'s craftsmanship is truly exceptional.',
      images: ['https://images.unsplash.com/photo-1590736969955-71cc94901144?w=200&h=200&fit=crop']
    },
    {
      id: 2,
      name: 'Elena Martinez',
      avatar: '👩🏽',
      rating: 5,
      date: '1 month ago',
      verified: true,
      comment: 'This scarf is pure art. The colors are even more beautiful in person, and the story behind it makes it so much more meaningful. Worth every penny!',
      images: []
    },
    {
      id: 3,
      name: 'James Wilson',
      avatar: '👨🏻',
      rating: 4,
      date: '2 months ago',
      verified: true,
      comment: 'Bought this as a gift for my wife\'s birthday. The packaging was beautiful and the scarf exceeded all expectations. The craftsmanship is outstanding.',
      images: []
    }
  ];

  const relatedProducts = [
    { id: 2, name: 'Desert Rose Shawl', price: 145, image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=200&h=200&fit=crop' },
    { id: 3, name: 'Sunrise Silk Wrap', price: 98, image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=200&h=200&fit=crop' },
    { id: 4, name: 'Royal Blue Scarf', price: 112, image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=200&h=200&fit=crop' }
  ];

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div 
          className="text-white text-xl"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading artisan details...
        </motion.div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center text-white text-xl">
        Error loading product: {error?.message || 'Product not found'}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Dynamic Background */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        style={{ x: backgroundX, y: backgroundY }}
      >
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-3xl"></div>
      </motion.div>
      {/* Header */}
      <motion.header 
        className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-white/10"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowLeft className="text-white" size={20} />
              </motion.button>
              <div>
                <h1 className="text-xl font-bold text-white">Artisan Connect</h1>
                <p className="text-white/50 text-sm">Product Details</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Share2 className="text-white" size={20} />
              </motion.button>
              <motion.button
                className="relative p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ShoppingBag size={20} className="text-white" />
                <span className="absolute -top-1 -right-1 bg-white text-purple-600 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">3</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <motion.div 
            className="space-y-4"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Main Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10">
              <motion.img
                key={selectedImageIndex}
                src={product.images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              
              {/* Image Navigation */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
              >
                <ChevronLeft className="text-white" size={20} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
              >
                <ChevronRight className="text-white" size={20} />
              </button>
              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-white text-sm">{selectedImageIndex + 1} / {product.images.length}</span>
              </div>
            </div>
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index 
                      ? 'border-purple-400 ring-2 ring-purple-400/50' 
                      : 'border-white/20 hover:border-white/40'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
          </motion.div>
          {/* Product Info */}
          <motion.div 
            className="space-y-6"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Category & Availability */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-purple-300 text-sm border border-purple-500/30">
                {product.category}
              </span>
              <span className="text-green-400 text-sm flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Only {product.inStock} left in stock
              </span>
            </div>
            {/* Product Name & Rating */}
            <div>
              <h1 className="text-4xl font-bold text-white mb-3">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={`${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-white/30'}`}
                    />
                  ))}
                  <span className="text-white/80 ml-2">{product.rating}</span>
                </div>
                <span className="text-white/60">({product.totalReviews} reviews)</span>
              </div>
            </div>
            {/* Pricing */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-white">${product.price}</span>
              {product.originalPrice && (
                <span className="text-2xl text-white/50 line-through">${product.originalPrice}</span>
              )}
              {product.originalPrice && (
                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                  Save ${product.originalPrice - product.price}
                </span>
              )}
            </div>
            {/* Description */}
            <p className="text-white/80 text-lg leading-relaxed">
              {product.description}
            </p>
            {/* Key Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                <Clock className="text-purple-400" size={20} />
                <div>
                  <p className="text-white/60 text-sm">Craft Time</p>
                  <p className="text-white font-semibold">{product.details.craftTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                <Palette className="text-pink-400" size={20} />
                <div>
                  <p className="text-white/60 text-sm">Material</p>
                  <p className="text-white font-semibold">{product.details.material}</p>
                </div>
              </div>
            </div>
            {/* Sustainability Badges */}
            <div className="flex gap-3">
              {product.sustainability.ecofriendly && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full border border-green-500/30">
                  <span className="text-green-400 text-xs">🌱</span>
                  <span className="text-green-400 text-sm">Eco-Friendly</span>
                </div>
              )}
              {product.sustainability.fairTrade && (
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/30">
                  <span className="text-blue-400 text-xs">🤝</span>
                  <span className="text-blue-400 text-sm">Fair Trade</span>
                </div>
              )}
            </div>
            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-white font-medium">Quantity:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-white font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex gap-4">
                <motion.button
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Add to Collection - ${product.price * quantity}
                </motion.button>
                <motion.button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isFavorite 
                      ? 'bg-pink-500/20 border-pink-500 text-pink-400' 
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart size={24} className={isFavorite ? 'fill-current' : ''} />
                </motion.button>
              </div>
            </div>
            {/* Trust Badges */}
            <div className="flex items-center gap-6 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-white/80">
                <Shield size={20} className="text-green-400" />
                <span className="text-sm">Authenticity Guaranteed</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Truck size={20} className="text-blue-400" />
                <span className="text-sm">Free Worldwide Shipping</span>
              </div>
            </div>
          </motion.div>
        </div>
        {/* Artisan Profile */}
        <motion.section 
          className="mb-16"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Meet the Artisan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className="text-center">
                  <div className="w-24 h-24 text-6xl mb-4 mx-auto">{product.artisan.avatar}</div>
                  <h3 className="text-xl font-bold text-white mb-1">{product.artisan.name}</h3>
                  <p className="text-white/60 flex items-center justify-center gap-1 mb-2">
                    <MapPin size={14} />
                    {product.artisan.location}
                  </p>
                  <div className="flex items-center justify-center gap-1 mb-4">
                    <Star className="fill-yellow-400 text-yellow-400" size={14} />
                    <span className="text-white/80">{product.artisan.rating}</span>
                    <span className="text-white/60">• {product.artisan.followers} followers</span>
                  </div>
                  <motion.button
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Follow Artisan
                  </motion.button>
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Artisan Story</h4>
                    <p className="text-white/80 leading-relaxed">{product.artisan.story}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/60 text-sm">Experience</p>
                      <p className="text-white font-semibold">{product.artisan.experience}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Specialty</p>
                      <p className="text-white font-semibold">{product.artisan.speciality}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Total Products</p>
                      <p className="text-white font-semibold">{product.artisan.totalProducts}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
        {/* Product Details Tabs */}
        <motion.section 
          className="mb-16"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden">
            {/* Tab Headers */}
            <div className="flex border-b border-white/10">
              {[
                { id: 'story', label: 'Craft Story', icon: '📖' },
                { id: 'details', label: 'Details', icon: '📏' },
                { id: 'care', label: 'Care Guide', icon: '🧼' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 font-medium transition-all ${
                    activeTab === tab.id 
                      ? 'bg-white/10 text-white border-b-2 border-purple-400' 
                      : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
            {/* Tab Content */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                {activeTab === 'story' && (
                  <motion.div
                    key="story"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-bold text-white mb-4">The Story Behind This Piece</h3>
                    <p className="text-white/80 leading-relaxed text-lg">{product.story}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      {product.details.uniqueFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-white/5 rounded-xl">
                          <span className="text-purple-400">✨</span>
                          <span className="text-white/80">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
                {activeTab === 'details' && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-bold text-white mb-4">Product Specifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-white/60">Material:</span>
                          <span className="text-white">{product.details.material}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Dimensions:</span>
                          <span className="text-white">{product.details.dimensions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Weight:</span>
                          <span className="text-white">{product.details.weight}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-white/60">Origin:</span>
                          <span className="text-white">{product.details.origin}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Craft Time:</span>
                          <span className="text-white">{product.details.craftTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Packaging:</span>
                          <span className="text-white">{product.sustainability.packaging}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                {activeTab === 'care' && (
                  <motion.div
                    key="care"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-bold text-white mb-4">Care Instructions</h3>
                    <p className="text-white/80">{product.details.careInstructions}</p>
                    <div className="space-y-3 mt-6">
                      <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
                        <span className="text-2xl">💧</span>
                        <div>
                          <h4 className="text-white font-medium">Gentle Cleaning</h4>
                          <p className="text-white/70 text-sm">Use only mild, silk-specific detergents</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
                        <span className="text-2xl">🌡️</span>
                        <div>
                          <h4 className="text-white font-medium">Temperature Care</h4>
                          <p className="text-white/70 text-sm">Avoid direct sunlight and extreme temperatures</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
                        <span className="text-2xl">📦</span>
                        <div>
                          <h4 className="text-white font-medium">Storage</h4>
                          <p className="text-white/70 text-sm">Store in a cool, dry place with tissue paper</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.section>
        {/* Reviews Section */}
        <motion.section 
          className="mb-16"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Customer Reviews</h2>
          <div className="space-y-6">
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                className="p-6 bg-white/5 rounded-2xl border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{review.avatar}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="text-white font-semibold">{review.name}</h4>
                      <span className="text-white/50 text-sm">{review.date}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/30'}
                        />
                      ))}
                      {review.verified && <span className="ml-2 text-xs text-green-400">Verified Buyer</span>}
                    </div>
                    <p className="text-white/80 mb-3">{review.comment}</p>
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2">
                        {review.images.map((img, idx) => (
                          <img key={idx} src={img} alt="review" className="w-16 h-16 rounded-lg object-cover" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
        {/* Related Products */}
        <motion.section 
          className="mb-24"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {relatedProducts.map((item) => (
              <motion.div
                key={item.id}
                className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:bg-white/10 transition-all"
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <img src={item.image} alt={item.name} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="text-white font-medium">{item.name}</h3>
                  <p className="text-white/70">${item.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
