import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Star, 
  ShoppingBag, 
  MapPin, 
  Clock, 
  Palette, 
  Shield, 
  Truck, 
  ArrowLeft, 
  Share2, 
  ChevronLeft, 
  ChevronRight,
  Send,
  Trash2,
  MessageCircle,
  TrendingUp,
  Loader
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getProduct, 
  getProductReviews, 
  createReview, 
  deleteReview,
  getProductReviewsSummary,
  updateCartItem,
  generateProductDetails,
  generateCareGuide,
  addToCart
} from '../lib/api';
import { useNavigate, useParams } from 'react-router-dom';
import useAuthUser from "../hooks/useAuthUser.js";
import { axiosInstance } from '../lib/axios.js';

export default function ProductDetailPage() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('story');
  const [mounted, setMounted] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });
  
  const { isLoading: authUserLoading, authUser } = useAuthUser();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const backgroundX = useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1920], [-30, 30]);
  const backgroundY = useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 1080], [-20, 20]);
  
  const queryClient = useQueryClient();
  const { id } = useParams();
  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Fetch product data
  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  });

  // Fetch product reviews
  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ['productReviews', id],
    queryFn: () => getProductReviews(id),
    enabled: !!id,
  });

  // Fetch AI summary of reviews
  const { data: reviewsSummary } = useQuery({
    queryKey: ['productReviewsSummary', id],
    queryFn: () => getProductReviewsSummary(id),
    enabled: !!id && reviewsData && reviewsData.length > 0,
  });

  // Generate AI product details
  const { data: aiDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ['productDetails', id],
    queryFn: () => generateProductDetails(data),
    enabled: !!data && activeTab === 'details',
    staleTime: 24 * 60 * 60 * 1000, // Cache for 24 hours
  });

  // Generate AI care guide
  const { data: aiCareGuide, isLoading: careGuideLoading } = useQuery({
    queryKey: ['productCareGuide', id],
    queryFn: () => generateCareGuide(data),
    enabled: !!data && activeTab === 'care',
    staleTime: 24 * 60 * 60 * 1000, // Cache for 24 hours
  });
  let change=true
  const [quantityCart,setQC]=useState("-")
  useEffect(()=>{
    const getQuantity=async ()=>{
      let temp=0;
      const res = await axiosInstance.get("/cart")
      const prodArr=res.data.products;
      prodArr.map((item)=>{
        temp+=item?.quantity
      })
      console.log(temp)
      setQC(temp)
    }
    getQuantity()
  },[change])
  // Create review mutation
  const createReviewMutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries(['productReviews', id]);
      queryClient.invalidateQueries(['product', id]);
      setShowReviewForm(false);
      setReviewForm({ rating: 5, comment: '' });
    },
    onError: (error) => {
      alert(error.message);
    }
  });

  // Delete review mutation
  const deleteReviewMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries(['productReviews', id]);
      queryClient.invalidateQueries(['product', id]);
    },
    onError: (error) => {
      alert(error.message);
    }
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: ({ productId, quantity }) => addToCart({productId, quantity}),
    onSuccess: () => {
      alert('Product added to cart successfully!');
      queryClient.invalidateQueries(['cart']);
    },
    onError: (error) => {
      alert(error.message || 'Failed to add product to cart');
    }
  });

  // Normalize fetched data to match expected structure
  const product = data ? {
    id: data._id,
    name: data.title?.replace(/"/g, '').trim() || 'Untitled Product',
    price: data.price || 0,
    originalPrice: null,
    rating: data.rating || 0,
    totalReviews: data.totalReviews || 0,
    inStock: data.quantity || 0,
    images: data.images && data.images.length > 0 ? data.images : ['https://via.placeholder.com/800x800'],
    category: data.category?.replace(/"/g, '').trim() || 'Uncategorized',
    artisan: {
      name: data.seller?.businessName?.trim() || 'Unknown Artisan',
      avatar: '🛍️',
      location: 'Global',
      experience: '',
      speciality: data.tags ? data.tags.join(', ') : '',
      story: data.description?.replace(/"/g, '').trim() || 'No story available',
      totalProducts: 0,
      followers: 0,
      rating: data.rating || 0
    },
    description: data.description?.replace(/"/g, '').trim() || 'No description available',
    story: data.description?.replace(/"/g, '').trim() || 'No story available',
    details: aiDetails || {
      material: data.tags ? data.tags.join(', ') : 'Various materials',
      dimensions: 'Standard size',
      weight: 'Lightweight',
      careInstructions: 'Handle with care, store in cool dry place',
      origin: 'Handcrafted',
      craftTime: 'Made to order',
      uniqueFeatures: data.tags || []
    },
    sustainability: {
      ecofriendly: data.isActive,
      fairTrade: data.seller?.verified || false,
      carbonNeutral: false,
      packaging: aiDetails?.packaging || 'Eco-friendly packaging'
    }
  } : null;

  const reviews = reviewsData || [];

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewForm.rating) {
      alert('Please select a rating');
      return;
    }
    
    createReviewMutation.mutate({
      productId: id,
      rating: reviewForm.rating,
      comment: reviewForm.comment
    });
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReviewMutation.mutate(reviewId);
    }
  };

  const handleAddToCart = () => {
    if (!authUser) {
      alert('Please login to add items to cart');
      return;
    }
    
    addToCartMutation.mutate({
      productId: id,
      quantity: quantity
    });
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };
  const navigate=useNavigate()
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
                onClick={() => window.history.back()}
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
                onClick={()=>{navigate("/cart")}}
              >
                <ShoppingBag size={20} className="text-white" />
                <span className="absolute -top-1 -right-1 bg-white text-purple-600 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{quantityCart}</span>
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
              {product.images.length > 1 && (
                <>
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
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white text-sm">{selectedImageIndex + 1} / {product.images.length}</span>
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
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
            )}
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
                {product.inStock > 0 ? `Only ${product.inStock} left in stock` : 'Out of stock'}
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
                  <span className="text-white/80 ml-2">{product.rating.toFixed(1)}</span>
                </div>
                <span className="text-white/60">({product.totalReviews} reviews)</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-white">${product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-2xl text-white/50 line-through">${product.originalPrice}</span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                    Save ${product.originalPrice - product.price}
                  </span>
                </>
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
                    onClick={() => setQuantity(Math.min(product.inStock, quantity + 1))}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
                    disabled={quantity >= product.inStock}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <motion.button
                  onClick={handleAddToCart}
                  disabled={product.inStock === 0 || addToCartMutation.isLoading}
                  className={`flex-1 font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
                    product.inStock > 0 && !addToCartMutation.isLoading
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600' 
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                  whileHover={product.inStock > 0 && !addToCartMutation.isLoading ? { scale: 1.02, y: -1 } : {}}
                  whileTap={product.inStock > 0 && !addToCartMutation.isLoading ? { scale: 0.98 } : {}}
                >
                  {addToCartMutation.isLoading ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Adding...
                    </>
                  ) : product.inStock > 0 ? (
                    `Add to Cart - $${(product.price * quantity).toFixed(2)}`
                  ) : (
                    'Out of Stock'
                  )}
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

        {/* Artisan Profile - keeping existing code */}
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
                    <span className="text-white/80">{product.artisan.rating.toFixed(1)}</span>
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
                      <p className="text-white font-semibold">{product.artisan.experience || 'Experienced craftsperson'}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Specialty</p>
                      <p className="text-white font-semibold">{product.artisan.speciality || 'Quality crafts'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Product Details Tabs with AI Generation */}
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
                  {((tab.id === 'details' && detailsLoading) || (tab.id === 'care' && careGuideLoading)) && (
                    <Loader className="animate-spin ml-1" size={14} />
                  )}
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
                    {product.details.uniqueFeatures && product.details.uniqueFeatures.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        {product.details.uniqueFeatures.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 p-3 bg-white/5 rounded-xl">
                            <span className="text-purple-400">✨</span>
                            <span className="text-white/80">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}
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
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      Product Specifications
                      {detailsLoading && <Loader className="animate-spin" size={20} />}
                    </h3>
                    
                    {detailsLoading ? (
                      <div className="text-white/60">Generating detailed specifications...</div>
                    ) : (
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
                    )}
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
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      Care Instructions
                      {careGuideLoading && <Loader className="animate-spin" size={20} />}
                    </h3>
                    
                    {careGuideLoading ? (
                      <div className="text-white/60">Generating care instructions...</div>
                    ) : aiCareGuide ? (
                      <>
                        <p className="text-white/80">{aiCareGuide.generalCare}</p>
                        <div className="space-y-3 mt-6">
                          <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
                            <span className="text-2xl">💧</span>
                            <div>
                              <h4 className="text-white font-medium">{aiCareGuide.cleaning.title}</h4>
                              <p className="text-white/70 text-sm">{aiCareGuide.cleaning.description}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
                            <span className="text-2xl">📦</span>
                            <div>
                              <h4 className="text-white font-medium">{aiCareGuide.storage.title}</h4>
                              <p className="text-white/70 text-sm">{aiCareGuide.storage.description}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
                            <span className="text-2xl">🔧</span>
                            <div>
                              <h4 className="text-white font-medium">{aiCareGuide.maintenance.title}</h4>
                              <p className="text-white/70 text-sm">{aiCareGuide.maintenance.description}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                            <span className="text-2xl">⚠️</span>
                            <div>
                              <h4 className="text-red-400 font-medium">{aiCareGuide.warnings.title}</h4>
                              <p className="text-red-300/80 text-sm">{aiCareGuide.warnings.description}</p>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-3 mt-6">
                        <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
                          <span className="text-2xl">💧</span>
                          <div>
                            <h4 className="text-white font-medium">Gentle Cleaning</h4>
                            <p className="text-white/70 text-sm">Use mild detergents and avoid harsh chemicals</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
                          <span className="text-2xl">🌡️</span>
                          <div>
                            <h4 className="text-white font-medium">Temperature Care</h4>
                            <p className="text-white/70 text-sm">Store in moderate temperature, avoid extreme conditions</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
                          <span className="text-2xl">📦</span>
                          <div>
                            <h4 className="text-white font-medium">Storage</h4>
                            <p className="text-white/70 text-sm">Keep in original packaging when not in use</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.section>

        {/* Reviews Section - keeping existing reviews code */}
        <motion.section 
          className="mb-16"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <MessageCircle className="text-purple-400" size={28} />
                Customer Reviews ({reviews.length})
              </h2>
              {authUser && (
                <motion.button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-2 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Write Review
                </motion.button>
              )}
            </div>

            {/* AI Summary */}
            {reviewsSummary && (
              <motion.div 
                className="mb-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="text-purple-400" size={20} />
                  <h3 className="text-white font-semibold">AI Review Summary</h3>
                </div>
                <p className="text-white/80">{reviewsSummary.summary}</p>
              </motion.div>
            )}

            {/* Review Form */}
            <AnimatePresence>
              {showReviewForm && authUser && (
                <motion.form
                  onSubmit={handleSubmitReview}
                  className="mb-8 p-6 bg-white/5 rounded-xl border border-white/10"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <h3 className="text-white font-semibold mb-4">Write Your Review</h3>
                  
                  {/* Rating */}
                  <div className="mb-4">
                    <label className="text-white/80 text-sm font-medium mb-2 block">Rating *</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                          className="p-1"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Star
                            size={24}
                            className={`${
                              star <= reviewForm.rating 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-white/30 hover:text-yellow-400'
                            } transition-colors`}
                          />
                        </motion.button>
                      ))}
                      <span className="ml-2 text-white/80 self-center">
                        {reviewForm.rating} star{reviewForm.rating !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="mb-4">
                    <label className="text-white/80 text-sm font-medium mb-2 block">Comment (Optional)</label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                      placeholder="Share your thoughts about this product..."
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all resize-none"
                      rows={4}
                    />
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      type="submit"
                      disabled={createReviewMutation.isLoading}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Send size={16} />
                      {createReviewMutation.isLoading ? 'Submitting...' : 'Submit Review'}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="bg-white/10 text-white font-semibold px-6 py-2 rounded-lg hover:bg-white/20 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Reviews List */}
            {reviewsLoading ? (
              <div className="text-center py-8">
                <motion.div 
                  className="text-white/60"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Loading reviews...
                </motion.div>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-white text-xl mb-2">No reviews yet</h3>
                <p className="text-white/60">Be the first to share your experience with this product!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <motion.div
                    key={review._id}
                    className="p-6 bg-white/5 rounded-2xl border border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {review.user?.fullName ? review.user.fullName[0].toUpperCase() : '?'}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <h4 className="text-white font-semibold">
                              {review.user?.fullName || 'Anonymous User'}
                            </h4>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/30'}
                                />
                              ))}
                              <span className="ml-2 text-white/60 text-sm">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          
                          {/* Delete button for user's own reviews */}
                          {review.user?._id === authUser?._id && (
                            <motion.button
                              onClick={() => handleDeleteReview(review._id)}
                              className="p-2 text-white/40 hover:text-red-400 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Delete review"
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          )}
                        </div>
                        
                        {review.comment && (
                          <p className="text-white/80 leading-relaxed">{review.comment}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
