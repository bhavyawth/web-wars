import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Package,
  Truck, 
  CheckCircle2, 
  Clock, 
  X,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  User,
  Calendar,
  DollarSign,
  AlertCircle,
  RefreshCw,
  ChevronDown
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllOrders, updateOrderStatus, deleteOrder } from '../lib/api';
import { BouncingDotsLoader } from "../components/Loading.jsx";

export default function AdminOrderManagement() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState([]);

  // Fetch all orders
  const { data: orders = [], isLoading, error, refetch } = useQuery({
    queryKey: ['allOrders'],
    queryFn: getAllOrders,
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, statusData }) => updateOrderStatus(orderId, statusData),
    onSuccess: () => {
      queryClient.invalidateQueries(['allOrders']);
      alert('Order status updated successfully!');
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to update order status');
    }
  });

  // Delete order mutation
  const deleteOrderMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries(['allOrders']);
      alert('Order deleted successfully!');
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to delete order');
    }
  });

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

  const handleStatusChange = (orderId, field, value) => {
    const statusData = { [field]: value };
    updateStatusMutation.mutate({ orderId, statusData });
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      deleteOrderMutation.mutate(orderId);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  if (isLoading) {
    return <BouncingDotsLoader  />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-2xl mb-2">Failed to Load Orders</h2>
          <p className="text-white/60 mb-6">{error.message}</p>
          <motion.button
            onClick={() => refetch()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Retry
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
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="text-white" size={20} />
                </motion.button>
                <div>
                  <h1 className="text-xl font-bold text-white">Order Management</h1>
                  <p className="text-white/50 text-sm">{filteredOrders.length} orders found</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={() => refetch()}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <RefreshCw className="text-white" size={20} />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Content */}
        <div className="w-full px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Filters */}
            <motion.div 
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-8"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
                  <input
                    type="text"
                    placeholder="Search orders, users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all"
                  />
                </div>

                {/* Order Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all"
                >
                  <option value="all" className="bg-slate-800">All Statuses</option>
                  <option value="pending" className="bg-slate-800">Pending</option>
                  <option value="processing" className="bg-slate-800">Processing</option>
                  <option value="shipped" className="bg-slate-800">Shipped</option>
                  <option value="delivered" className="bg-slate-800">Delivered</option>
                  <option value="cancelled" className="bg-slate-800">Cancelled</option>
                </select>

                {/* Payment Status Filter */}
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all"
                >
                  <option value="all" className="bg-slate-800">All Payments</option>
                  <option value="pending" className="bg-slate-800">Payment Pending</option>
                  <option value="completed" className="bg-slate-800">Payment Completed</option>
                  <option value="failed" className="bg-slate-800">Payment Failed</option>
                </select>

                {/* Clear Filters */}
                <motion.button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setPaymentFilter('all');
                  }}
                  className="bg-white/10 text-white font-medium py-3 px-4 rounded-lg hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Clear Filters
                </motion.button>
              </div>
            </motion.div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-white text-2xl mb-2">No orders found</h3>
                <p className="text-white/60">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order, index) => {
                  const StatusIcon = getOrderStatusIcon(order.orderStatus);
                  return (
                    <motion.div
                      key={order._id}
                      className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.5 }}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 items-center">
                        {/* Order Info */}
                        <div className="lg:col-span-2">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-white font-bold">#{order._id.slice(-8).toUpperCase()}</h4>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${getOrderStatusColor(order.orderStatus)}`}>
                              <StatusIcon size={12} />
                              <span className="capitalize">{order.orderStatus}</span>
                            </div>
                          </div>
                          
                          <div className="text-white/60 text-sm space-y-1">
                            <div className="flex items-center gap-2">
                              <User size={14} />
                              <span>{order.user?.fullName || 'Unknown User'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar size={14} />
                              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign size={14} />
                              <span>${order.totalAmount}</span>
                              <span className={`text-xs ${getPaymentStatusColor(order.paymentStatus)}`}>
                                ({order.paymentStatus})
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Products */}
                        <div className="lg:col-span-1">
                          <div className="text-white/60 text-sm">
                            <span className="font-medium text-white">{order.products.length}</span> items
                          </div>
                          <div className="text-xs text-white/50 mt-1">
                            {order.products.slice(0, 2).map(item => item.product?.title).join(', ')}
                            {order.products.length > 2 && '...'}
                          </div>
                        </div>

                        {/* Order Status Dropdown */}
                        <div className="lg:col-span-1 mb-4 lg:mb-0 mt-2 lg:mt-0">
                            <div className='font-semibold text-white flex justify-center -mt-8 mb-2'><div>Order Status</div></div>
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleStatusChange(order._id, 'orderStatus', e.target.value)}
                            disabled={updateStatusMutation.isLoading}
                            className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all"
                          >
                            <option value="pending" className="bg-slate-800">Pending</option>
                            <option value="processing" className="bg-slate-800">Processing</option>
                            <option value="shipped" className="bg-slate-800">Shipped</option>
                            <option value="delivered" className="bg-slate-800">Delivered</option>
                            <option value="cancelled" className="bg-slate-800">Cancelled</option>
                          </select>
                        </div>

                        {/* Payment Status Dropdown */}
                        <div className="lg:col-span-1">
                            <div className='font-semibold text-white flex justify-center -mt-8 mb-2'><div>Payment Status</div></div>
                          <select
                            value={order.paymentStatus}
                            onChange={(e) => handleStatusChange(order._id, 'paymentStatus', e.target.value)}
                            disabled={updateStatusMutation.isLoading}
                            className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all"
                          >
                            <option value="pending" className="bg-slate-800">Pending</option>
                            <option value="completed" className="bg-slate-800">Completed</option>
                            <option value="failed" className="bg-slate-800">Failed</option>
                          </select>
                        </div>

                        {/* Actions */}
                        <div className="lg:col-span-1 ">
                          <div className="flex items-center justify-center gap-2">
                            
                            
                            <motion.button
                              onClick={() => handleDeleteOrder(order._id)}
                              disabled={deleteOrderMutation.isLoading}
                              className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-all"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              title="Delete Order"
                            >
                              <Trash2 size={16} className="text-red-400" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
