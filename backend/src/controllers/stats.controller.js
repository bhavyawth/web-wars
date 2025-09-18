import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Seller from "../models/seller.model.js";

export const getCategoriesStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      { $unwind: "$products" }, 
      {
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      { $unwind: "$productInfo" },
      {
        $group: {
          _id: "$productInfo.category",
          totalSales: { $sum: { $multiply: ["$products.price", "$products.quantity"] } },
          totalQuantity: { $sum: "$products.quantity" }
        }
      },
      { $sort: { totalSales: -1 } }
    ]);

    res.json(stats.map(item => ({
      category: item._id,
      totalSales: item.totalSales,
      totalQuantity: item.totalQuantity
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

export const getSellerStats = async (req, res) => {
  try {
    const { city } = req.query;

    const matchStage = {};
    if (city) {
      const sellersInCity = await Seller.find({ city }).select("_id");
      matchStage["productInfo.seller"] = { $in: sellersInCity.map(s => s._id) };
    }

    const stats = await Order.aggregate([
      { $unwind: "$products" },
      {
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      { $unwind: "$productInfo" },
      {
        $match: matchStage
      },
      {
        $group: {
          _id: "$productInfo.seller",
          totalSales: { $sum: { $multiply: ["$products.price", "$products.quantity"] } },
          totalQuantity: { $sum: "$products.quantity" }
        }
      },
      {
        $lookup: {
          from: "sellers",
          localField: "_id",
          foreignField: "_id",
          as: "sellerInfo"
        }
      },
      { $unwind: "$sellerInfo" },
      { $sort: { totalSales: -1 } }
    ]);

    res.json(stats.map(item => ({
      seller: item.sellerInfo.businessName,
      city: item.sellerInfo.city,
      totalSales: item.totalSales,
      totalQuantity: item.totalQuantity
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
