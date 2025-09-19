import { axiosInstance } from './axios';
import { GoogleGenAI } from "@google/genai";
import axios from "axios";
const API_BASE_URL="http://localhost:3000/api"
const genai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY // set this in .env
});
export const userSignup = async (signupData) => {
  const response = await axiosInstance.post('/user/signup', signupData);
  return response.data;
};
export const sellerSignup = async (signupData) => {
  const response = await axiosInstance.post('/seller/signup', signupData);
  return response.data;
};


export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get('/user/check');
    return res.data;
  } catch (error) {
    try {
      const res = await axiosInstance.get('/seller/check');
      return res.data;
    } catch (error) {
      console.log('Error fetching seller and user:', error);
      return null;
    }
    console.log('Error fetching user:', error);
    return null;
  }
};

export const getAllProducts = async ()=>{
  try {
    const res=await axiosInstance.get("/products");
    return res.data
  } catch (error) {
    console.log("lawda")
  }
}

export const getProduct = async (id)=>{
  try {
    const res= await axiosInstance.get(`/products/${id}`);
    console.log(res)
    return res.data
  } catch (error) {
    console.log("lawda product",error)
  }
}

export const createProduct = async (productData) => {
  const formData = new FormData();
  Object.keys(productData).forEach(key => {
    if (key === 'images') {
      productData.images.forEach(image => formData.append('images', image));
    } else if (key === 'tags') {
      formData.append(key, productData[key].join(','));
    } else {
      formData.append(key, productData[key]);
    }
  });
  const response = await axiosInstance.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};


export const deleteProduct = async (id) => {
  const response = await axiosInstance.delete(`/products/${id}`);
  return response.data;
};

// Fetch followers for a seller
export const getFollowers = async (sellerId) => {
  const response = await axiosInstance.get(`/seller/${sellerId}/followers`); // Adjust endpoint if needed
  return response.data;
};

export const addToCart = async({productId,quantity})=>{
  try {
      const res=await axiosInstance.post("/cart/add",{productId,quantity});
      console.log(res)
  } catch (error) {
    
  }
}


export const getCart        = ()            => axiosInstance.get   ("/cart").then(r => r.data);

export const updateCartItem = ({productId, quantity})   =>
                              axiosInstance.put  ("/cart/update" , {productId, quantity}).then(r => r.data);
export const removeCartItem =  productId               =>
                              axiosInstance.delete("/cart/remove", {data:{productId}}).then(r => r.data);
export const clearCart      = ()            => axiosInstance.delete("/cart/clear").then(r => r.data);
export const checkoutCart   = body          => axiosInstance.post ("/cart/checkout", body).then(r => r.data);

export const getProductReviews = async (productId) => {
  const response = await axiosInstance.get(`/reviews/product/${productId}`, { withCredentials: true });
  return response.data;
};

// Fetch all reviews for a seller
export const getSellerReviews = async (sellerId) => {
  const response = await axiosInstance.get(`/reviews/seller/${sellerId}`, { withCredentials: true });
  return response.data;
};

// Create a review (user must be logged in, credentials/cookies sent)
export const createReview = async (reviewData) => {
  const response = await axiosInstance.post('/reviews', reviewData, { withCredentials: true });
  return response.data;
};

// Delete a review (user must be logged in)
export const deleteReview = async (reviewId) => {
  const response = await axiosInstance.delete(`/reviews/${reviewId}`, { withCredentials: true });
  return response.data;
};

// Get review summary for a product
export const getProductReviewsSummary = async (productId) => {
  const response = await axiosInstance.get(`/reviews/product/${productId}/summary`, { withCredentials: true });
  return response.data;
};

// Get review summary for a seller
export const getSellerReviewsSummary = async (sellerId) => {
  const response = await axiosInstance.get(`/reviews/seller/${sellerId}/summary`, { withCredentials: true });
  return response.data;
};

const PERPLEXITY_API_KEY = import.meta.env.VITE_PER_API_KEY;
const BASE_URL = "https://api.perplexity.ai";

export const generateProductDetails = async (product) => {
  try {
    const productInfo = `
Product Title: ${product.title || "Unknown Product"}
Category: ${product.category || "General"}
Description: ${product.description || "No description"}
Tags: ${product.tags ? product.tags.join(", ") : "None"}
Price: $${product.price || 0}
`;

    const prompt = `
You are a product specification expert. Generate realistic and detailed product specifications based on the given product information.

Product Information:
${productInfo}

Generate the following specifications in JSON format:
{
  "material": "specific materials used (be realistic based on category)",
  "dimensions": "realistic dimensions (length x width x height or diameter)",
  "weight": "appropriate weight for the product type",
  "origin": "plausible origin/manufacturing location",
  "craftTime": "realistic time to make/produce this item",
  "packaging": "appropriate packaging description"
}

Rules:
- Be realistic and specific to the product category
- Use appropriate units (inches/cm for dimensions, lbs/kg for weight)
- Make craft time reasonable for the product type
- Don't mention this is AI-generated
- Keep specifications professional and believable
`;

    const response = await axios.post(
      `${BASE_URL}/chat/completions`,
      {
        model: "sonar-pro", // or "sonar-small" if you want lighter
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const generatedText = response.data?.choices?.[0]?.message?.content?.trim();

    try {
      return JSON.parse(generatedText);
    } catch (err) {
      console.error("Failed to parse AI response as JSON:", err);
      return {
        material: "High-quality materials",
        dimensions: "Standard size",
        weight: "Lightweight",
        origin: "Handcrafted",
        craftTime: "Made to order",
        packaging: "Eco-friendly packaging",
      };
    }
  } catch (error) {
    console.error("Error generating product details:", error);
    return {
      material: "Quality materials",
      dimensions: "Standard dimensions",
      weight: "Appropriate weight",
      origin: "Carefully crafted",
      craftTime: "Artisan made",
      packaging: "Protective packaging",
    };
  }
};

export const generateCareGuide = async (product) => {
  try {
    const productInfo = `
Product Title: ${product.title || "Unknown Product"}
Category: ${product.category || "General"}
Description: ${product.description || "No description"}
Tags: ${product.tags ? product.tags.join(", ") : "None"}
`;

    const prompt = `
You are a product care expert. Generate detailed and practical care instructions based on the given product information.

Product Information:
${productInfo}

Generate care instructions in JSON format:
{
  "generalCare": "overall care instructions (2-3 sentences)",
  "cleaning": {
    "title": "Cleaning Instructions",
    "description": "specific cleaning method"
  },
  "storage": {
    "title": "Storage Guidelines", 
    "description": "proper storage instructions"
  },
  "maintenance": {
    "title": "Maintenance Tips",
    "description": "long-term care advice"
  },
  "warnings": {
    "title": "Important Warnings",
    "description": "what to avoid"
  }
}

Rules:
- Be specific to the product category (electronics, textiles, pottery, etc.)
- Provide practical, actionable advice
- Include warnings about what to avoid
- Keep language clear and professional
- Don't mention this is AI-generated
`;

    const response = await axios.post(
      `${BASE_URL}/chat/completions`,
      {
        model: "sonar-pro",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const generatedText = response.data?.choices?.[0]?.message?.content?.trim();

    try {
      return JSON.parse(generatedText);
    } catch (err) {
      console.error("Failed to parse care guide JSON:", err);
      return {
        generalCare: "Handle with care and store in a safe place.",
        cleaning: {
          title: "Cleaning Instructions",
          description: "Clean gently with appropriate methods for the material.",
        },
        storage: {
          title: "Storage Guidelines",
          description: "Store in a cool, dry place away from direct sunlight.",
        },
        maintenance: {
          title: "Maintenance Tips",
          description: "Regular gentle maintenance will extend the product's lifespan.",
        },
        warnings: {
          title: "Important Warnings",
          description: "Avoid harsh chemicals and extreme temperatures.",
        },
      };
    }
  } catch (error) {
    console.error("Error generating care guide:", error);
    return {
      generalCare: "Please handle with care.",
      cleaning: { title: "Cleaning", description: "Clean as appropriate for the material." },
      storage: { title: "Storage", description: "Store in a safe place." },
      maintenance: { title: "Maintenance", description: "Regular care recommended." },
      warnings: { title: "Warnings", description: "Handle carefully." },
    };
  }
};

// Seller Profile API Functions

export const getSellerProducts = async (sellerId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/seller/${sellerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch seller products');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching seller products:', error);
    throw error;
  }
};

// export const getSellerInfo = async (sellerId) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/seller/${sellerId}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       throw new Error('Failed to fetch seller info');
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching seller info:', error);
//     throw error;
//   }
// };

export const getSellerFollowers = async (sellerId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/seller/${sellerId}/followers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch seller followers');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching seller followers:', error);
    throw error;
  }
};


export const checkIsFollowing = async (sellerId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/seller/${sellerId}/is-following`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return { isFollowing: false };
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking follow status:', error);
    return { isFollowing: false };
  }
};
// Get seller info using /seller/check endpoint (uses cookies automatically)
export const getSellerInfo = async () => {
  console.log("hi")
  try {
    const response = await fetch(`${API_BASE_URL}/seller/check`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // This ensures cookies are sent
    });
    if (!response.ok) {
      throw new Error('Failed to fetch seller info');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching seller info:', error);
    throw error;
  }
};


export const followArtisan = async (artisanId) => {
  const res = await fetch(`/api/artisans/${artisanId}/follow`, { method: 'POST', credentials: 'include' });
  if (!res.ok) throw new Error("Failed to follow artisan");
  return res.json();
};

export const followSeller = async (sellerId) => {
  const response = await axiosInstance.post(`/seller/${sellerId}/follow`, {}, { withCredentials: true });
  return response.data;
};
// Add this to your api.js file
export const createOrder = async (orderData) => {
  const response = await axiosInstance.post('/orders', orderData, { withCredentials: true });
  return response.data;
};


// Add this to your api.js file
export const getUserOrders = async () => {
  const response = await axiosInstance.get('/orders', { withCredentials: true });
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await axiosInstance.get(`/orders/${orderId}`, { withCredentials: true });
  return response.data;
};

// Update user profile (if you have this endpoint)
// Update user profile
export const updateUserProfile = async (file) => {
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // Convert file → base64
  const base64Image = await toBase64(file);

  // Send to backend
  const response = await axiosInstance.put(
    "/user/profile",
    { profilePic: base64Image },
    { withCredentials: true }
  );

  return response.data;
};










export const userLogin = async (loginData) => {
  const response = await axiosInstance.post('/user/login', loginData);
  return response.data;
};

// Seller Login
export const sellerLogin = async (loginData) => {
  const response = await axiosInstance.post('/seller/login', loginData);
  return response.data;
};

export const logout = async (type) => {
  try {
    let endpoint = "/user/logout"; // default
    if (type === "seller") {
      endpoint = "/seller/logout";
    }

    const response = await axiosInstance.post(endpoint);
    return response.data;
  } catch (error) {
    console.error("Logout failed:", error.response?.data || error.message);
    throw error;
  }
};




export const updateProduct = async (id, productData) => {
  const formData = new FormData();

  // Append non-file fields
  Object.keys(productData).forEach(key => {
    if (key !== "images" && key !== "keepImages") {
      if (key === "tags" && Array.isArray(productData.tags)) {
        productData.tags.forEach(tag => formData.append("tags[]", tag));
      } else {
        formData.append(key, productData[key]);
      }
    }
  });

  // Append images (files)
  if (productData.images && productData.images.length > 0) {
    productData.images.forEach(file => {
      if (file instanceof File) {
        formData.append("images", file);
      }
    });
  }

  // Append keepImages (for existing ones)
  if (productData.keepImages && productData.keepImages.length > 0) {
    productData.keepImages.forEach(imgUrl => formData.append("keepImages[]", imgUrl));
  }

  console.log("Sending FormData:", [...formData.entries()]);

  const response = await axiosInstance.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });

  return response.data;
};






export const sendVerificationEmail = async () => {
  const response = await axiosInstance.post("/seller/send-verification");
  console.log("Response from sendVerificationEmail:", response);
  return response.data;
};

// Verify seller (called when they click a verification link in email)
export const verifySellerEmail = async (token) => {
  const response = await axiosInstance.get(`/seller/verify?token=${token}`);
  return response.data;
};

// Add these to your api.js file
export const getAllOrders = async () => {
  const response = await axiosInstance.get('/orders/all', { withCredentials: true });
  return response.data;
};

export const updateOrderStatus = async (orderId, statusData) => {
  const response = await axiosInstance.put(`/orders/${orderId}/status`, statusData, { withCredentials: true });
  return response.data;
};

export const deleteOrder = async (orderId) => {
  const response = await axiosInstance.delete(`/orders/${orderId}`, { withCredentials: true });
  return response.data;
};
