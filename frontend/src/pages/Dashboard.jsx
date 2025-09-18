import React, { useState } from 'react';
import { motion,AnimatePresence } from 'framer-motion';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Package, DollarSign, Users, Star, Edit, Trash2, Plus } from 'lucide-react';
import useAuthUser from '../hooks/useAuthUser'; // Assuming this exists for seller details

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

export default function SellerBaby() {
  const { authUser } = useAuthUser(); // Fetch seller details (use dummy if not available)

  // Dummy data for products
  const dummyProducts = [
    { _id: '1', title: 'Handcrafted Vase', price: 45.99, quantity: 15, images: ['https://via.placeholder.com/150'], rating: 4.8 },
    { _id: '2', title: 'Silk Scarf', price: 29.99, quantity: 8, images: ['https://via.placeholder.com/150'], rating: 4.5 },
    { _id: '3', title: 'Wooden Bowl', price: 59.99, quantity: 5, images: ['https://via.placeholder.com/150'], rating: 4.9 },
  ];

  // Dummy data for sales graph (line chart for daily sales)
  const salesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Sales',
        data: [12, 19, 3, 5, 2, 3, 7],
        borderColor: 'rgba(147,51,234,1)',
        backgroundColor: 'rgba(147,51,234,0.2)',
        tension: 0.3,
      },
    ],
  };

  // Dummy data for revenue graph (bar chart for monthly revenue)
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [400, 300, 500, 700, 600, 800],
        backgroundColor: 'rgba(236,72,153,0.6)',
        borderColor: 'rgba(236,72,153,1)',
        borderWidth: 1,
      },
    ],
  };

  // State for add/edit form (overlay)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState('add'); // 'add' or 'edit'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({ title: '', price: '', quantity: '', description: '' });

  // Open form for add or edit
  const openForm = (type, product = null) => {
    setFormType(type);
    setSelectedProduct(product);
    if (product) {
      setFormData({
        title: product.title,
        price: product.price,
        quantity: product.quantity,
        description: '', // Dummy
      });
    } else {
      setFormData({ title: '', price: '', quantity: '', description: '' });
    }
    setIsFormOpen(true);
  };

  // Handle form submit (dummy for now, integrate API later)
  const handleSubmit = (e) => {
    e.preventDefault();
    // API integration point: call createProduct or updateProduct
    setIsFormOpen(false);
  };

  // Dummy delete (integrate deleteProduct API later)
  const handleDelete = (id) => {
    // Call deleteProduct(id)
    alert(`Deleted product ${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden p-8">
      {/* Animated Background */}
      <motion.div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-500/40 to-pink-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-purple-500/20 rounded-full blur-3xl"></div>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-12">
        {/* Profile Details */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10"
        >
          <h1 className="text-3xl font-bold text-white mb-6">Seller Profile</h1>
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <img
              src={authUser?.profilePic || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-2 border-purple-500"
            />
            <div className="space-y-4 text-center md:text-left">
              <p className="text-white text-xl"><strong>Name:</strong> {authUser?.fullName || 'John Doe'}</p>
              <p className="text-white text-xl"><strong>Business Name:</strong> {authUser?.businessName || 'Artisan Crafts'}</p>
              <p className="text-white text-xl"><strong>Email:</strong> {authUser?.email || 'john@example.com'}</p>
              <p className="text-white text-xl"><strong>Followers:</strong> 340</p> {/* Dummy or from API */}
              <p className="text-white text-xl"><strong>Joined:</strong> {new Date(authUser?.createdAt).toLocaleDateString() || 'Jan 2025'}</p>
            </div>
          </div>
        </motion.section>

        {/* Sales Graphs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <DollarSign className="text-pink-400" size={28} /> Daily Sales
            </h2>
            <Line data={salesData} />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <DollarSign className="text-purple-400" size={28} /> Monthly Revenue
            </h2>
            <Bar data={revenueData} />
          </motion.section>
        </div>

        {/* Product List */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Package className="text-blue-400" size={28} /> Your Products
            </h2>
            <motion.button
              onClick={() => openForm('add')}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <Plus size={20} /> Add Product
            </motion.button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dummyProducts.map((product) => (
              <motion.div
                key={product._id}
                className="bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.02 }}
              >
                <img src={product.images[0]} alt={product.title} className="w-full h-40 object-cover rounded-lg mb-4" />
                <h3 className="text-white font-semibold mb-2">{product.title}</h3>
                <p className="text-white/70 mb-2">${product.price.toFixed(2)}</p>
                <p className="text-white/70 mb-4">Quantity: {product.quantity}</p>
                <p className="text-white/70 mb-4 flex items-center gap-2">
                  <Star className="text-yellow-400" size={16} /> {product.rating}
                </p>
                <div className="flex gap-4">
                  <motion.button
                    onClick={() => openForm('edit', product)}
                    className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Edit size={16} /> Edit
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Trash2 size={16} /> Delete
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Overlay Form for Add/Edit Product */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            onClick={() => setIsFormOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-8 max-w-lg w-full m-4 border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white mb-6">{formType === 'add' ? 'Add Product' : 'Edit Product'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-purple-400"
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-purple-400"
                  rows={3}
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-purple-400"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-purple-400"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
                >
                  {formType === 'add' ? 'Add Product' : 'Update Product'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
