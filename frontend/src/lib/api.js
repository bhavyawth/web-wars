import { axiosInstance } from './axios';

export const userSignup = async (signupData) => {
  const response = await axiosInstance.post('/user/signup', signupData);
  return response.data;
};
export const sellerSignup = async (signupData) => {
  const response = await axiosInstance.post('/seller/signup', signupData);
  return response.data;
};
export const logout = async () => {
  const response = await axiosInstance.post('/seller/logout',);
  return response.data;
};

export const getAuthUser = async () => {
  try {
    console.log("hi")
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
export const updateProduct = async (id, productData) => {
  const formData = new FormData();

  // Append non-file fields
  Object.keys(productData).forEach(key => {
    if (key !== 'images') {
      if (key === 'tags') {
        productData.tags.forEach(tag => formData.append('tags[]', tag)); // Append as array with 'tags[]'
      } else {
        formData.append(key, productData[key]);
      }
    }
  });

  // Append images (files)
  if (productData.images && productData.images.length > 0) {
    productData.images.forEach(file => formData.append('images', file));
  }

  // For keeping existing images, append as 'images' array (strings)
  if (productData.keepImages) {
    productData.keepImages.forEach(imgUrl => formData.append('images', imgUrl)); // Backend will treat as keep list
  }

  console.log('Sending FormData:', [...formData.entries()]); // Debug
  console.log(formData)
  const response = await axiosInstance.put(`/products/${id}`, {formData,message:"hi"}, {
    headers: { 'Content-Type': 'multipart/form-data' },withCredentials:true
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