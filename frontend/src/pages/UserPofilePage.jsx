import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar,
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  X,
  Edit3,
  Save,
  ArrowLeft,
  Star,
  Eye,
  ShoppingBag,
  Upload,
  Camera
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserOrders, updateUserProfile } from '../lib/api';
import useAuthUser from '../hooks/useAuthUser';

export default function UserProfilePage() {
  const { authUser, isLoading: authLoading } = useAuthUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // Fetch user orders
  const { data: orders = [], isLoading: ordersLoading, error: ordersError } = useQuery({
    queryKey: ['userOrders'],
    queryFn: getUserOrders,
    enabled: !!authUser,
  });

  // Update profile mutation (only for profile pic)
  const updateProfileMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(['authUser']);
      setIsEditing(false);
      setSelectedFile(null);
      setPreviewUrl('');
      alert('Profile picture updated successfully!');
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to update profile picture');
    }
  });

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    if (selectedFile) {
      console.log(selectedFile)
      updateProfileMutation.mutate(selectedFile);
    }
  };

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

  if (authLoading) {
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

  if (!authUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-white text-2xl mb-2">Access Denied</h2>
          <p className="text-white/60 mb-6">Please login to view your profile.</p>
          <motion.button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
        </div>
      </div>
    );
  }

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
                  onClick={() => navigate("/market")}
                >
                  <ArrowLeft className="text-white" size={20} />
                </motion.button>
                <div>
                  <h1 className="text-xl font-bold text-white">My Profile</h1>
                  <p className="text-white/50 text-sm">{authUser.fullName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
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

        {/* Full Width Content */}
        <div className="w-full px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Profile Header - Full Width */}
            <motion.div 
              className="w-full bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 mb-8"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Profile Avatar with Upload */}
                <div className="text-center lg:text-left">
                  <div className="relative group mb-4">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold mx-auto lg:mx-0">
                      {authUser.profilePic ? (
                        <img 
                          src={previewUrl || authUser.profilePic} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        authUser.fullName ? authUser.fullName[0].toUpperCase() : 'U'
                      )}
                    </div>
                    
                    {/* Upload Button */}
                    <motion.button
                      onClick={() => document.getElementById('fileInput').click()}
                      className="absolute inset-0 w-32 h-32 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center mx-auto lg:mx-0"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Camera className="text-white" size={24} />
                    </motion.button>
                    
                    <input
                      id="fileInput"
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>

                  {/* Save Button for Profile Pic */}
                  {selectedFile && (
                    <motion.button
                      onClick={handleSaveProfile}
                      disabled={updateProfileMutation.isLoading}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all mb-4"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {updateProfileMutation.isLoading ? 'Uploading...' : 'Save Photo'}
                    </motion.button>
                  )}

                  <h2 className="text-2xl font-bold text-white mb-2">{authUser.fullName}</h2>
                  <p className="text-white/60">{authUser.email}</p>
                  <div className="flex items-center justify-center lg:justify-start gap-2 mt-2 text-white/60">
                    <Calendar size={16} />
                    <span>Member since {new Date(authUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>

                {/* Stats Grid - Better Layout */}
                <div className="flex-1 w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
                    <div className="bg-white/5 rounded-xl p-6 text-center">
                      <div className="text-3xl font-bold text-purple-400 mb-2">{orders.length}</div>
                      <div className="text-white/60">Total Orders</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-6 text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">
                        {orders.filter(order => order.orderStatus === 'delivered').length}
                      </div>
                      <div className="text-white/60">Delivered</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-6 text-center">
                      <div className="text-3xl font-bold text-yellow-400 mb-2">
                        {orders.filter(order => order.orderStatus === 'pending' || order.orderStatus === 'processing').length}
                      </div>
                      <div className="text-white/60">Active Orders</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Navigation Tabs */}
            <motion.div 
              className="flex justify-center mb-8"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border flex border-white/10 p-2">
                {[
                  { id: 'profile', label: 'Profile Info', icon: User },
                  { id: 'orders', label: 'Order History', icon: Package, count: orders.length }
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                    {tab.count !== undefined && (
                      <span className="bg-white/20 rounded-full px-2 py-1 text-xs">{tab.count}</span>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Tab Content - Full Width */}
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="w-full"
                >
                  <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8">
                    <h3 className="text-2xl font-bold text-white mb-8">Profile Information</h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      {/* Personal Information */}
                      <div className="space-y-6">
                        <h4 className="text-lg font-semibold text-white mb-6">Personal Information</h4>
                        
                        <div className="space-y-6">
                          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                            <User className="text-purple-400" size={24} />
                            <div>
                              <div className="text-white/60 text-sm">Full Name</div>
                              <div className="text-white font-semibold text-lg">{authUser.fullName || 'Not provided'}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                            <Mail className="text-purple-400" size={24} />
                            <div>
                              <div className="text-white/60 text-sm">Email</div>
                              <div className="text-white font-semibold text-lg">{authUser.email}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                            <Phone className="text-purple-400" size={24} />
                            <div>
                              <div className="text-white/60 text-sm">Phone</div>
                              <div className="text-white font-semibold text-lg">{authUser.phone || 'Not provided'}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Address Information - Single Field */}
                      <div className="space-y-6">
                        <h4 className="text-lg font-semibold text-white mb-6">Address Information</h4>
                        
                        <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg">
                          <MapPin className="text-purple-400 mt-1" size={24} />
                          <div>
                            <div className="text-white/60 text-sm">Address</div>
                            <div className="text-white font-semibold text-lg">
                              {authUser.address || 'No address provided'}
                            </div>
                          </div>
                        </div>

                        {/* Account Stats */}
                        <div className="mt-8">
                          <h4 className="text-lg font-semibold text-white mb-6">Account Statistics</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 rounded-lg text-center">
                              <div className="text-2xl font-bold text-purple-400">{orders.length}</div>
                              <div className="text-white/60 text-sm">Total Orders</div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-lg text-center">
                              <div className="text-2xl font-bold text-green-400">
                                ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
                              </div>
                              <div className="text-white/60 text-sm">Total Spent</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="w-full"
                >
                  <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8">
                    <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                      <Package className="text-purple-400" size={28} />
                      Order History ({orders.length})
                    </h3>

                    {ordersLoading ? (
                      <div className="text-center py-20">
                        <motion.div 
                          className="text-white text-xl"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          Loading orders...
                        </motion.div>
                      </div>
                    ) : ordersError ? (
                      <div className="text-center py-20">
                        <div className="text-red-400 text-xl">Failed to load orders</div>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-20">
                        <div className="text-8xl mb-6">📦</div>
                        <h4 className="text-white text-2xl mb-4">No orders yet</h4>
                        <p className="text-white/60 text-lg mb-8">You haven't placed any orders yet.</p>
                        <motion.button
                          onClick={() => navigate('/')}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-8 py-4 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Start Shopping
                        </motion.button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {orders.map((order, index) => {
                          const StatusIcon = getOrderStatusIcon(order.orderStatus);
                          return (
                            <motion.div
                              key={order._id}
                              className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                {/* Order Info */}
                                <div className="lg:col-span-2">
                                  <div className="flex items-center justify-between mb-4">
                                    <div>
                                      <h4 className="text-white font-bold text-lg">
                                        Order #{order._id.slice(-8).toUpperCase()}
                                      </h4>
                                      <p className="text-white/60">
                                        {new Date(order.createdAt).toLocaleDateString('en-US', { 
                                          year: 'numeric', 
                                          month: 'long', 
                                          day: 'numeric' 
                                        })}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-white font-bold text-xl">${order.totalAmount}</div>
                                      <div className={`text-sm ${getPaymentStatusColor(order.paymentStatus)}`}>
                                        {order.paymentMethod.toUpperCase()}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Products */}
                                  <div className="space-y-3">
                                    {order.products.map((item, idx) => (
                                      <div key={idx} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                                        <img
                                          src={item.product.images?.[0] || 'https://via.placeholder.com/60'}
                                          alt={item.product.title}
                                          className="w-12 h-12 rounded-lg object-cover"
                                        />
                                        <div className="flex-1">
                                          <h5 className="text-white font-medium">{item.product.title}</h5>
                                          <div className="flex items-center gap-4 text-sm text-white/60">
                                            <span>Qty: {item.quantity}</span>
                                            <span>${item.price}</span>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Status */}
                                <div className="flex flex-col justify-center">
                                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full border w-fit ${getOrderStatusColor(order.orderStatus)}`}>
                                    <StatusIcon size={16} />
                                    <span className="text-sm font-medium capitalize">{order.orderStatus}</span>
                                  </div>
                                  <div className={`text-sm mt-2 ${getPaymentStatusColor(order.paymentStatus)}`}>
                                    Payment: {order.paymentStatus}
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-3">
                                  <motion.button
                                    onClick={() => navigate(`/orders/${order._id}`)}
                                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium px-4 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <Eye size={16} />
                                    View Details
                                  </motion.button>
                                  
                                  {order.orderStatus === 'delivered' && (
                                    <motion.button
                                      className="flex items-center justify-center gap-2 bg-white/10 text-white font-medium px-4 py-3 rounded-lg hover:bg-white/20 transition-all"
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      <Star size={16} />
                                      Review Products
                                    </motion.button>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
