import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft,
  Package,
  Truck, 
  CheckCircle2, 
  Clock, 
  X,
  MapPin,
  CreditCard,
  Calendar,
  Star,
  Eye,
  ShoppingBag,
  Phone,
  Mail,
  Copy,
  ExternalLink,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrderById } from '../lib/api';
import useAuthUser from '../hooks/useAuthUser';

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthUser();
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  // Fetch order details
  const { data: orderData, isLoading, error, refetch } = useQuery({
    queryKey: ['orderDetails', orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
  });

  const order = orderData?.order || orderData;

  const getOrderStatusColor = (status) => {
    const colors = {
      'pending': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
      'processing': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
      'shipped': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
      'delivered': 'text-green-400 bg-green-400/10 border-green-400/20',
      'cancelled': 'text-red-400 bg-red-400/10 border-red-400/20'
    };
    return colors[status] || 'text-gray-400 bg-gray-400/10 border-gray-400/20';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      'pending': 'text-yellow-400',
      'completed': 'text-green-400',
      'failed': 'text-red-400'
    };
    return colors[status] || 'text-gray-400';
  };

  const getOrderStatusIcon = (status) => {
    const icons = {
      'pending': Clock,
      'processing': Package,
      'shipped': Truck,
      'delivered': CheckCircle2,
      'cancelled': X
    };
    return icons[status] || Clock;
  };

  const getOrderProgress = (status) => {
    const statuses = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statuses.indexOf(status);
    if (status === 'cancelled') return { steps: [], progress: 0 };
    
    return {
      steps: statuses.slice(0, currentIndex + 1),
      progress: ((currentIndex + 1) / statuses.length) * 100
    };
  };

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order._id);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  const canCancelOrder = () => {
    return order?.orderStatus === 'pending' && order?.paymentStatus !== 'completed';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div 
          className="text-white text-xl"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading order details...
        </motion.div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-white text-2xl mb-2">Order Not Found</h2>
          <p className="text-white/60 mb-6">This order doesn't exist or you don't have permission to view it.</p>
          <motion.button
            onClick={() => navigate('/profile')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Profile
          </motion.button>
        </div>
      </div>
    );
  }

  const StatusIcon = getOrderStatusIcon(order.orderStatus);
  const orderProgress = getOrderProgress(order.orderStatus);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen">
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
                  onClick={() => navigate('/user')}
                >
                  <ArrowLeft className="text-white" size={20} />
                </motion.button>
                <div>
                  <h1 className="text-xl font-bold text-white">Order Details</h1>
                  <p className="text-white/50 text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={refetch}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <RefreshCw className="text-white" size={20} />
                </motion.button>
                <motion.button
                  className="relative p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate('/cart')}
                >
                  <ShoppingBag size={20} className="text-white" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Content */}
        <div className="w-full px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Order Header */}
            <motion.div 
              className="w-full bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 mb-8"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-3xl font-bold text-white">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </h2>
                    <motion.button
                      onClick={handleCopyOrderId}
                      className="p-2 text-white/60 hover:text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Copy full order ID"
                    >
                      {copiedOrderId ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                    </motion.button>
                  </div>
                  
                  <div className="flex items-center gap-4 text-white/80">
                    <div className="flex items-center gap-2">
                      <Calendar size={18} />
                      <span>Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full border w-fit ml-auto mb-4 ${getOrderStatusColor(order.orderStatus)}`}>
                    <StatusIcon size={20} />
                    <span className="font-medium capitalize">{order.orderStatus}</span>
                  </div>
                  
                  <div className="text-white text-3xl font-bold">${order.totalAmount}</div>
                  <div className={`text-sm ${getPaymentStatusColor(order.paymentStatus)}`}>
                    Payment: {order.paymentStatus}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Order Progress Timeline */}
            {order.orderStatus !== 'cancelled' && (
              <motion.div 
                className="w-full bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 mb-8"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <h3 className="text-xl font-bold text-white mb-6">Order Progress</h3>
                
                <div className="relative">
                  {/* Progress Bar */}
                  <div className="absolute top-6 left-6 right-6 h-1 bg-white/10 rounded-full">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${orderProgress.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  
                  {/* Progress Steps */}
                  <div className="grid grid-cols-4 gap-4">
                    {['pending', 'processing', 'shipped', 'delivered'].map((status, index) => {
                      const isCompleted = orderProgress.steps.includes(status);
                      const isCurrent = order.orderStatus === status;
                      const StepIcon = getOrderStatusIcon(status);
                      
                      return (
                        <div key={status} className="text-center">
                          <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 border-2 transition-all ${
                            isCompleted 
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400' 
                              : 'bg-white/10 border-white/20'
                          } ${isCurrent ? 'ring-4 ring-purple-400/30 scale-110' : ''}`}>
                            <StepIcon 
                              size={20} 
                              className={isCompleted ? 'text-white' : 'text-white/60'} 
                            />
                          </div>
                          <div className={`text-sm font-medium capitalize ${
                            isCompleted ? 'text-white' : 'text-white/60'
                          }`}>
                            {status}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Products Ordered */}
              <div className="lg:col-span-2">
                <motion.div 
                  className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <Package className="text-purple-400" size={24} />
                    Items Ordered ({order.products.length})
                  </h3>
                  
                  <div className="space-y-6">
                    {order.products.map((item, index) => (
                      <motion.div
                        key={index}
                        className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                      >
                        {/* Product Image */}
                        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
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
                              <h4 className="text-white font-semibold text-lg">{item.product.title}</h4>
                              <p className="text-white/60">Price at order: ${item.price}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-bold text-xl">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                              <div className="text-white/60 text-sm">Qty: {item.quantity}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Star className="fill-yellow-400 text-yellow-400" size={16} />
                              <span className="text-white/60 text-sm">{item.product.rating || 'No rating'}</span>
                            </div>
                            
                            <motion.button
                              onClick={() => navigate(`/product/${item.product._id}`)}
                              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                              whileHover={{ scale: 1.05 }}
                            >
                              <Eye size={16} />
                              <span className="text-sm">View Product</span>
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Order Summary & Info */}
              <div className="space-y-8">
                {/* Order Summary */}
                <motion.div 
                  className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <h3 className="text-lg font-bold text-white mb-4">Order Summary</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-white/70">
                      <span>Items ({order.products.reduce((sum, item) => sum + item.quantity, 0)})</span>
                      <span>${order.products.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Tax</span>
                      <span>Included</span>
                    </div>
                    <div className="border-t border-white/20 pt-3">
                      <div className="flex justify-between text-xl font-bold text-white">
                        <span>Total</span>
                        <span>${order.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Payment Information */}
                <motion.div 
                  className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                    <CreditCard className="text-purple-400" size={20} />
                    Payment Details
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/70">Method</span>
                      <span className="text-white font-semibold uppercase">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Status</span>
                      <span className={`font-semibold capitalize ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    {order.paymentMethod === 'cod' && (
                      <div className="mt-3 p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
                        <div className="flex items-center gap-2 text-yellow-400 text-sm">
                          <AlertCircle size={16} />
                          <span>Pay cash upon delivery</span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Shipping Information */}
                <motion.div 
                  className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                    <MapPin className="text-purple-400" size={20} />
                    Shipping Address
                  </h3>
                  
                  <div className="text-white/80">
                    <p>{order.shippingAddress}</p>
                  </div>
                </motion.div>

                {/* Actions */}
                <motion.div 
                  className="space-y-3"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <motion.button
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Truck size={20} />
                    Track Order
                  </motion.button>
                  
                  {canCancelOrder() && (
                    <motion.button
                      className="w-full bg-red-500/20 border-2 border-red-500/30 text-red-400 font-semibold py-3 rounded-xl hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <X size={20} />
                      Cancel Order
                    </motion.button>
                  )}
                  
                  <motion.button
                    onClick={() => navigate('/profile')}
                    className="w-full bg-white/10 text-white font-semibold py-3 rounded-xl hover:bg-white/20 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Back to Orders
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}