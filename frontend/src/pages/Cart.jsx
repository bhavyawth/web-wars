import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Add this import
import PrizeGrid from '../components/PrizeGrid';
import { 
  ShoppingBag, Trash2, Plus, Minus, Heart, 
  ArrowLeft, Tag, Truck, Shield, Star,
  Gift, Clock, CreditCard, CheckCircle2, Loader
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getCart, 
  updateCartItem, 
  removeCartItem, 
  clearCart, 
  createOrder // Add this import
} from '../lib/api';
import useAuthUser from '../hooks/useAuthUser';

export default function CartPage() {
  const { isLoading: aha, authUser } = useAuthUser();
  const navigate = useNavigate(); // Add this
  
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [mounted, setMounted] = useState(false);
  const [savedItems, setSavedItems] = useState([]); // Keep local for "save for later"
  const [showPrizeGrid, setShowPrizeGrid] = useState(false);
  const [prizeApplied, setPrizeApplied] = useState(false);

  const queryClient = useQueryClient();

  // Fetch cart dynamically
  const { data: cart, isLoading, error } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  });

  // Mutations
  const updateQuantityMutation = useMutation({
    mutationFn: updateCartItem,
    onSuccess: () => queryClient.invalidateQueries(['cart']),
  });

  const removeItemMutation = useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => queryClient.invalidateQueries(['cart']),
  });

  const clearCartMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: () => queryClient.invalidateQueries(['cart']),
  });

  // Updated checkout mutation
  const checkoutMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (response) => {
      queryClient.invalidateQueries(['cart']);
      clearCartMutation.mutate()
      alert('Order placed successfully!');
      // Redirect to orders page or order confirmation
      navigate(`/orders/${response.order._id}`);
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to place order');
    }
  });

  const shippingOptions = [
    { id: 'standard', name: 'Standard Delivery', time: '5-7 business days', price: 0 },
    { id: 'express', name: 'Express Delivery', time: '2-3 business days', price: 15 },
    { id: 'overnight', name: 'Overnight Delivery', time: 'Next business day', price: 35 }
  ];

  const discountCodes = {
    'WELCOME10': { type: 'percentage', value: 10, description: '10% off your order' },
    'SAVE20': { type: 'fixed', value: 20, description: '$20 off orders over $100' },
    'FREESHIP': { type: 'shipping', value: 0, description: 'Free shipping' }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || prizeApplied || !cart) return;

    const subtotal = cart.products.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Trigger PrizeGrid if subtotal > $50
    if (subtotal > 50) {
      setShowPrizeGrid(true);
    }
  }, [cart, mounted, prizeApplied]);

  const cartItems = cart?.products || [];

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItemMutation.mutate(productId);
      return;
    }
    updateQuantityMutation.mutate({ productId, quantity: newQuantity });
  };

  const removeItem = (productId) => {
    removeItemMutation.mutate(productId);
  };

  const saveForLater = (productId) => {
    const item = cartItems.find(i => i.product._id === productId);
    if (item) {
      setSavedItems(prev => [...prev, { ...item }]);
      removeItem(productId);
    }
  };

  const moveToCart = (productId) => {
    const item = savedItems.find(i => i.product._id === productId);
    if (item) {
      setCartItems(prev => [...prev, item]);
      setSavedItems(prev => prev.filter(i => i.product._id !== productId));
    }
  };

  const applyDiscountCode = () => {
    const discount = discountCodes[discountCode.toUpperCase()];
    if (discount) {
      setAppliedDiscount(discount);
      setDiscountCode('');
    }
  };

  // Updated handleCheckout function
  const handleCheckout = async () => {
    // Check if user is logged in
    if (!authUser) {
      alert('Please login to proceed with checkout');
      return;
    }

    // Check if user has address
    if (!authUser.address ) {
      alert('Please update your address in profile to proceed with checkout');
      return;
    }

    // Transform cart data to order format
    const orderData = {
      products: cartItems.map(item => ({
        productId: item.product._id,
        quantity: item.quantity
      })),
      shippingAddress: authUser.address,
      paymentMethod: 'cod' // Cash on delivery
    };

    checkoutMutation.mutate(orderData);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shippingCost = appliedDiscount?.type === 'shipping' ? 0 : shippingOptions.find(opt => opt.id === selectedShipping)?.price || 0;
  const discountAmount = appliedDiscount?.type === 'percentage' ? (subtotal * appliedDiscount.value / 100) : 
                        appliedDiscount?.type === 'fixed' ? Math.min(appliedDiscount.value, subtotal) : 0;
  const tax = (subtotal - discountAmount) * 0.08; // 8% tax
  const total = subtotal - discountAmount + shippingCost + tax;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div 
          className="text-white text-xl"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading your cart...
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center text-white text-xl">
        Loading cart...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center text-red-400 text-xl">
        Failed to load cart: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Keep all existing background and header code */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.header 
          className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-slate-900/80 via-purple-900/80 to-slate-900/80 border-b border-white/10"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.button
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                  whileHover={{ x: -5 }}
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft size={20} />
                  Continue Shopping
                </motion.button>
              </div>
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-purple-400" size={24} />
                <div>
                  <h1 className="text-xl font-bold text-white">Shopping Cart</h1>
                  <p className="text-white/50 text-sm">{cartItems.length} items</p>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {cartItems.length === 0 ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-8xl mb-6">🛒</div>
              <h2 className="text-3xl font-bold text-white mb-4">Your cart is empty</h2>
              <p className="text-white/60 text-lg mb-8">Looks like you haven't added anything to your cart yet.</p>
              <motion.button
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-8 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
              >
                Start Shopping
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items - Keep existing code */}
              <div className="lg:col-span-2 space-y-6">
                <motion.div 
                  className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <ShoppingBag className="text-purple-400" size={24} />
                    Cart Items ({cartItems.length})
                  </h2>

                  <AnimatePresence>
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={item.product._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all mb-4 last:mb-0"
                      >
                        {/* Product Image */}
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={item.product.images?.[0] || 'https://via.placeholder.com/100'} 
                            alt={item.product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-white font-semibold text-lg">{item.product.title}</h3>
                              <div className="flex items-center gap-2 text-white/60 text-sm">
                                <span>by {item.product.seller?.businessName}</span>
                                {item.product.seller?.verified && (
                                  <CheckCircle2 className="text-green-400" size={14} />
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-bold text-xl">${item.product.price}</div>
                              <div className="flex items-center gap-1">
                                <Star className="fill-yellow-400 text-yellow-400" size={12} />
                                <span className="text-white/60 text-sm">{item.product.rating}</span>
                              </div>
                            </div>
                          </div>

                          {/* Quantity Controls & Actions */}
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center bg-white/10 rounded-lg border border-white/20">
                                <motion.button
                                  onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                  className="p-2 rounded-lg hover:bg-white/10 transition-colors mx-[3px]"
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Minus size={14} className="text-white" />
                                </motion.button>
                                <span className="px-4 py-2 text-white font-semibold">{item.quantity}</span>
                                <motion.button
                                  onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                  className="p-2 hover:bg-white/10 rounded-lg transition-colors mx-[3px]"
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Plus size={14} className="text-white" />
                                </motion.button>
                              </div>
                              <span className="text-white/60 text-sm">
                                Total: ${(item.product.price * item.quantity).toFixed(2)}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <motion.button
                                onClick={() => saveForLater(item.product._id)}
                                className="p-2 text-white/60 hover:text-purple-400 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                title="Save for later"
                              >
                                <Heart size={16} />
                              </motion.button>
                              <motion.button
                                onClick={() => removeItem(item.product._id)}
                                className="p-2 text-white/60 hover:text-red-400 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                title="Remove item"
                              >
                                <Trash2 size={16} />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                <motion.div 
                  className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sticky top-24"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <h3 className="text-2xl font-bold text-white mb-6">Order Summary</h3>

                  {/* User Address Display */}
                  {authUser?.address && (
                    <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                      <h4 className="text-white font-medium mb-2">Shipping Address</h4>
                      <div className="text-white/80 text-sm">
                        <p>{authUser.address}</p>
                      </div>
                    </div>
                  )}

                  {/* Discount Code */}
                  <div className="mb-6">
                    <label className="text-white/80 text-sm font-medium mb-2 block">Promo Code</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter code"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                      />
                      <motion.button
                        onClick={applyDiscountCode}
                        className="bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-600 transition-colors"
                        whileTap={{ scale: 0.95 }}
                      >
                        Apply
                      </motion.button>
                    </div>
                    {appliedDiscount && (
                      <div className="mt-2 text-green-400 text-sm flex items-center gap-1">
                        <Tag size={14} />
                        {appliedDiscount.description} applied!
                      </div>
                    )}
                  </div>

                  {/* Shipping Options */}
                  <div className="mb-6">
                    <label className="text-white/80 text-sm font-medium mb-3 block">Shipping Options</label>
                    <div className="space-y-2">
                      {shippingOptions.map((option) => (
                        <motion.label
                          key={option.id}
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedShipping === option.id 
                              ? 'border-purple-400 bg-purple-500/20' 
                              : 'border-white/20 bg-white/5 hover:bg-white/10'
                          }`}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shipping"
                              value={option.id}
                              checked={selectedShipping === option.id}
                              onChange={(e) => setSelectedShipping(e.target.value)}
                              className="sr-only"
                            />
                            <div className="flex items-center gap-2">
                              <Truck size={16} className="text-purple-400" />
                              <div>
                                <div className="text-white font-medium text-sm">{option.name}</div>
                                <div className="text-white/60 text-xs">{option.time}</div>
                              </div>
                            </div>
                          </div>
                          <div className="text-white font-semibold">
                            {option.price === 0 ? 'Free' : `$${option.price}`}
                          </div>
                        </motion.label>
                      ))}
                    </div>
                  </div>

                  {/* Order Totals */}
                  <div className="space-y-3 border-t border-white/20 pt-4">
                    <div className="flex justify-between text-white/70">
                      <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {appliedDiscount && (
                      <div className="flex justify-between text-green-400">
                        <span>Discount</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-white/70">
                      <span>Shipping</span>
                      <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-white border-t border-white/20 pt-3">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Payment Method Display */}
                  <div className="bg-white/5 rounded-lg p-3 mt-4">
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <CreditCard size={16} />
                      <span>Payment Method: Cash on Delivery</span>
                    </div>
                  </div>

                  {/* Updated Checkout Button */}
                  <motion.button
                    onClick={handleCheckout}
                    disabled={checkoutMutation.isLoading || !authUser}
                    className={`w-full font-bold py-4 rounded-xl mt-6 transition-all shadow-lg flex items-center justify-center gap-2 ${
                      checkoutMutation.isLoading || !authUser
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                    }`}
                    whileHover={!checkoutMutation.isLoading && authUser ? { scale: 1.02, y: -2 } : {}}
                    whileTap={!checkoutMutation.isLoading && authUser ? { scale: 0.98 } : {}}
                  >
                    {checkoutMutation.isLoading ? (
                      <>
                        <Loader className="animate-spin" size={20} />
                        Processing Order...
                      </>
                    ) : !authUser ? (
                      'Login to Checkout'
                    ) : (
                      <>
                        <CreditCard size={20} />
                        Place Order - ${total.toFixed(2)}
                      </>
                    )}
                  </motion.button>

                  {/* Clear Cart Button */}
                  <motion.button
                    onClick={() => clearCartMutation.mutate()}
                    className="w-full text-red-400 font-medium py-3 rounded-xl mt-4 hover:text-red-300 transition-all"
                    whileHover={{ scale: 1.02 }}
                    disabled={clearCartMutation.isLoading}
                  >
                    {clearCartMutation.isLoading ? 'Clearing...' : 'Clear Cart'}
                  </motion.button>

                  {/* Security Badge */}
                  <div className="flex items-center justify-center gap-2 text-white/60 text-sm mt-4">
                    <Shield size={16} />
                    <span>Secure checkout with COD</span>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showPrizeGrid && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <PrizeGrid
            onWin={(discount) => {
              console.log("Prize won:", discount);
              if (discount) setAppliedDiscount(discount);
              setPrizeApplied(true);
            }}
            onClose={() => setShowPrizeGrid(false)}
          />
        </div>
      )}
    </div>
  );
}
