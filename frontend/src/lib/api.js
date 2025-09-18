import { axiosInstance } from './axios';

export const userSignup = async (signupData) => {
  const response = await axiosInstance.post('/user/signup', signupData);
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get('/user/check');
    return res.data;
  } catch (error) {
    console.log('Error fetching user:', error);
    return null;
  }
};

export const getAllProducts = async ()=>{
  try {
    const res=await axiosInstance.get("/products");
    console.log(res.data);
    return res.data
  } catch (error) {
    console.log("lawda")
  }
}