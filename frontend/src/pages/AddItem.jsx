import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Tag, DollarSign, Layers, FileText, Package, Camera, ImageIcon } from "lucide-react";

export default function SellerAddItemPage() {
  const [mounted, setMounted] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    images: [],
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const orbX = useTransform(mouseX, [0, typeof window !== "undefined" ? window.innerWidth : 1920], [-30, 30]);
  const orbY = useTransform(mouseY, [0, typeof window !== "undefined" ? window.innerHeight : 1080], [-20, 20]);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const handleInput = (field, value) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((f) => URL.createObjectURL(f));
    setProduct((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <motion.div
          className="text-white text-xl"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading seller studio...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Orbs Background */}
      <motion.div className="absolute inset-0 opacity-30" style={{ x: orbX, y: orbY }}>
        <div className="absolute top-10 left-20 w-96 h-96 bg-gradient-to-r from-purple-500/40 to-pink-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-[30rem] h-[30rem] bg-gradient-to-r from-blue-500/30 to-purple-500/20 rounded-full blur-3xl"></div>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Seller Form */}
        <motion.div
          className="bg-white/5 rounded-3xl border border-white/10 p-8 backdrop-blur-sm shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6">List a New Creation</h2>

          <form className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="flex items-center gap-2 text-white/70 mb-2">
                <Tag size={18} /> Product Name
              </label>
              <input
                value={product.name}
                onChange={(e) => handleInput("name", e.target.value)}
                type="text"
                placeholder="e.g. Handwoven Silk Scarf"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 placeholder-white/40"
              />
            </div>

            {/* Category */}
            <div>
              <label className="flex items-center gap-2 text-white/70 mb-2">
                <Layers size={18} /> Category
              </label>
              <select
                value={product.category}
                onChange={(e) => handleInput("category", e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              >
                <option value="">Select a category</option>
                <option value="jewelry">Jewelry</option>
                <option value="pottery">Pottery</option>
                <option value="textiles">Textiles</option>
                <option value="woodwork">Woodwork</option>
                <option value="art">Art & Paintings</option>
                <option value="home">Home Decor</option>
              </select>
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-white/70 mb-2">
                  <DollarSign size={18} /> Price (USD)
                </label>
                <input
                  value={product.price}
                  onChange={(e) => handleInput("price", e.target.value)}
                  type="number"
                  placeholder="e.g. 120"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-white/70 mb-2">
                  <Package size={18} /> Stock
                </label>
                <input
                  value={product.stock}
                  onChange={(e) => handleInput("stock", e.target.value)}
                  type="number"
                  placeholder="e.g. 25"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-white/70 mb-2">
                <FileText size={18} /> Description
              </label>
              <textarea
                value={product.description}
                onChange={(e) => handleInput("description", e.target.value)}
                rows="4"
                placeholder="Tell buyers the story behind this piece..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 placeholder-white/40 backdrop-blur-sm"
              />
            </div>

            {/* Upload Images */}
            <div>
              <label className="flex items-center gap-2 text-white/70 mb-2">
                <ImageIcon size={18} /> Upload Images
              </label>
              <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center cursor-pointer hover:border-purple-400 transition-all">
                <Camera className="mx-auto text-white/50 mb-2" size={28} />
                <p className="text-white/70">Drag & Drop or Click to Upload</p>
                <input type="file" multiple className="hidden" onChange={handleImageUpload} />
              </div>

              {/* Image Previews */}
              {product.images.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {product.images.map((img, i) => (
                    <img key={i} src={img} alt={`Preview ${i}`} className="w-full h-24 object-cover rounded-lg border border-white/20" />
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="w-full py-4 mt-4 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-md relative overflow-hidden"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">🚀 Publish Item</span>
              <motion.div
                className="absolute inset-0 bg-white/10"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.8, repeat: Infinity, repeatType: "loop" }}
              />
            </motion.button>
          </form>
        </motion.div>

        {/* Live Product Preview */}
        <motion.div
          className="bg-white/5 rounded-3xl border border-white/10 p-8 backdrop-blur-sm"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4">Live Preview</h3>
          <div className="bg-white/10 rounded-2xl overflow-hidden border border-white/20">
            {product.images[0] ? (
              <img src={product.images[0]} alt="Preview" className="w-full h-56 object-cover" />
            ) : (
              <div className="w-full h-56 flex items-center justify-center text-white/50">No image</div>
            )}
            <div className="p-4 space-y-2">
              <h4 className="text-white font-semibold text-lg">
                {product.name || "Product Name"}
              </h4>
              <p className="text-white/60 text-sm">
                {product.category || "Category"}
              </p>
              <p className="text-white/80">
                {product.description || "Product description will appear here..."}
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-lg font-bold text-white">
                  {product.price ? `$${product.price}` : "$0"}
                </span>
                <span className="text-white/60 text-sm">{product.stock || 0} in stock</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
