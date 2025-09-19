import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuthUser from '../hooks/useAuthUser';
import { getAllProducts, createProduct, updateProduct, deleteProduct, getFollowers } from '../lib/api';
import { BouncingDotsLoader } from '../components/Loading';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function SellerCorner() {
  const { authUser, isLoading: authLoading, type } = useAuthUser();
  const sellerId = authUser?._id;
  const queryClient = useQueryClient();

  // Fetch seller products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['sellerProducts', sellerId],
    queryFn: () => getAllProducts({ seller: sellerId }), // Filter by seller
    enabled: !!sellerId,
  });

  // Fetch followers count
  const { data: followersData, isLoading: followersLoading } = useQuery({
    queryKey: ['followers', sellerId],
    queryFn: () => getFollowers(sellerId),
    enabled: !!sellerId,
  });

  const followersCount = followersData?.followersCount || 0;

  // Dummy sales data for graph
  const salesChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Sales',
        data: [120, 190, 300, 500, 200, 300, 450], // Dummy values
        backgroundColor: 'rgba(168, 85, 247, 0.6)', // Purple theme
        borderColor: 'rgba(168, 85, 247, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#fff' } },
      title: { display: true, text: 'Weekly Sales', color: '#fff' },
    },
    scales: {
      x: { ticks: { color: '#fff' } },
      y: { ticks: { color: '#fff' } },
    },
  };

  // State for overlay form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    tags: '',
    quantity: '',
    images: [], // New images to upload
    keepImages: [], // Existing images to keep (URLs)
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input for new images
  const handleFileChange = (e) => {
    setFormData({ ...formData, images: Array.from(e.target.files) });
  };

  // Open form for add or edit
  const openForm = (mode, product = null) => {
    setFormMode(mode);
    setSelectedProduct(product);
    if (product) {
      setFormData({
        title: product.title?.replace(/"/g, '').trim() || '',
        description: product.description?.replace(/"/g, '').trim() || '',
        price: product.price || '',
        category: product.category?.replace(/"/g, '').trim() || '',
        tags: product.tags?.join(', ') || '',
        quantity: product.quantity || '',
        images: [], // New images
        keepImages: product.images || [], // Existing images to keep
      });
    } else {
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        tags: '',
        quantity: '',
        images: [],
        keepImages: [],
      });
    }
    setIsFormOpen(true);
  };

  // Mutation for creating product
  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['sellerProducts']);
      setIsFormOpen(false);
    },
  });

  // Mutation for updating product
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['sellerProducts']);
      setIsFormOpen(false);
    },
  });

  // Mutation for deleting product
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => queryClient.invalidateQueries(['sellerProducts']),
  });

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const productToSend = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()),
    };

    if (formMode === 'add') {
      createMutation.mutate(productToSend);
    } else if (selectedProduct) {
      updateMutation.mutate({ id: selectedProduct._id, data: productToSend });
    }
  };

  // Display products (fallback to empty array)
  const displayProducts = products || [];

  if (authLoading || productsLoading) {
    return (
      <BouncingDotsLoader/>
    );
  }

  if (!authUser || type !== 'seller') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center text-white text-xl">
        Access Denied: Sellers Only
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden p-8">
      {/* Animated Background */}
      <motion.div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-500/40 to-pink-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-purple-500/20 rounded-full blur-3xl"></div>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Top Section: Profile (Left) and Sales Graph (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Profile Details (Left) */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10"
          >
            <h1 className="text-3xl font-bold text-white mb-6">Seller Profile</h1>
            <div className="flex flex-col gap-4">
              <img src={authUser.profilePic} alt="Profile" className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0" />
              <div className="space-y-2 text-center md:text-left">
                <p className="text-white text-xl"><strong>Name:</strong> {authUser.fullName}</p>
                <p className="text-white text-xl"><strong>Business Name:</strong> {authUser.businessName || 'N/A'}</p>
                <p className="text-white text-xl"><strong>Email:</strong> {authUser.email}</p>
                <p className="text-white text-xl"><strong>Followers:</strong> {followersCount}</p>
                <p className="text-white text-xl"><strong>Joined:</strong> {new Date(authUser.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </motion.section>

          {/* Sales Graph (Right) */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Sales Overview</h2>
            <Bar data={salesChartData} options={chartOptions} />
          </motion.section>
        </div>

        {/* Products Section (Below) */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Your Products</h2>
            <button
              onClick={() => openForm('add')}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
            >
              Add Product
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayProducts.length > 0 ? (
              displayProducts.map((product) => (
                <motion.div
                  key={product._id}
                  className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all"
                  whileHover={{ scale: 1.02 }}
                >
                  <img src={product.images[0]} alt={product.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                  <h3 className="text-white font-semibold text-lg mb-2">{product.title.replace(/"/g, '').trim()}</h3>
                  <p className="text-white/70 mb-2">${product.price}</p>
                  <p className="text-white/70 mb-4">Quantity: {product.quantity}</p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => openForm('edit', product)}
                      className="flex-1 py-2 bg-blue-500 text-white text-center rounded-lg hover:bg-blue-600 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(product._id)}
                      className="flex-1 py-2 bg-red-500 text-white text-center rounded-lg hover:bg-red-600 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className='col-span-full flex justify-center'>
                <motion.div 
                  className="text-center py-16"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-white text-xl mb-2">No products found</h3>
                  <p className="text-white/60">Add your first product!</p>
                </motion.div>
              </div>
            )}
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
              <h2 className="text-2xl font-bold text-white mb-6">{formMode === 'add' ? 'Add Product' : 'Edit Product'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                />
                <input
                  name="price"
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                />
                <input
                  name="category"
                  placeholder="Category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                />
                <input
                  name="tags"
                  placeholder="Tags (comma separated)"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                />
                <input
                  name="quantity"
                  type="number"
                  placeholder="Quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                />
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                />
                <button
                  type="submit"
                  disabled={createMutation.isLoading || updateMutation.isLoading}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-pink-600"
                >
                  {formMode === 'add' ? 'Create Product' : 'Update Product'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
