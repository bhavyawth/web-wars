import { Navigate, Route, Routes } from "react-router-dom";
import NavigationBar from "./components/navigationBar.jsx";
import Home from "./pages/Home.jsx";
import ArtisanMarketplace from "./pages/MarketPlace.jsx";
import ProductDetailPage from "./pages/ProductDetail.jsx";
import SellerProfilePage from "./pages/SellerProfile.jsx";
import UserProfilePage from "./pages/UserPofilePage.jsx"; // Note: Fix typo to UserProfilePage.jsx if needed
import SellerAddItemPage from "./pages/AddItem.jsx";
import UserSignupPage from "./pages/UserSignup.jsx";
import SellerSignupPage from "./pages/SellerSignup.jsx";
import useAuthUser from "./hooks/useAuthUser"; // Adjust path
import SellerCorner from "./pages/SellerCorner.jsx";
import CartPage from "./pages/Cart.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import SellerLoginPage from "./pages/SellerLoginPage.jsx";
import UserLoginPage from "./pages/UserLoginPage.jsx";
import VerifySeller from "./pages/VerifySeller.jsx";
import OrderDetailsPage from "./pages/OrderDetails.jsx";

import { Toaster } from 'react-hot-toast';
import { BouncingDotsLoader } from "./components/Loading.jsx";
import AdminOrderManagement from "./pages/AdminOrderManagement.jsx";
function App() {
  const { isLoading, authUser,type } = useAuthUser();
  const isAuthenticated = Boolean(authUser);
  if (isLoading) {
    return <BouncingDotsLoader/>; // Simple loader
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route
          path="/"
          element={<Home />} // Conditional rendering
        />
        <Route
          path="/market"
          element={
              <ArtisanMarketplace />
          }
        />
        
        <Route path="/orders/:orderId" element={<OrderDetailsPage/>}></Route>

        <Route
          path="/sellermarket"
          element={
            isAuthenticated && type === "seller" ? (
              <Dashboard />
            ) : (
              <Navigate to="/market" /> // homepage for consumers
            )
          } 
        />

        <Route path="/product/:id" element={<ProductDetailPage />} /> {/* Public? Add guard if needed */}
        <Route
          path="/seller/:id"
          element={isAuthenticated ? <SellerProfilePage /> : <Navigate to="/user/signup" />} // Protect seller profile
        />
        <Route
          path="/user"
          element={isAuthenticated ? <UserProfilePage /> : <Navigate to="/user/signup" />} // Protect user profile
        />
        <Route
          path="/add-item"
          element={isAuthenticated ? <SellerAddItemPage /> : <Navigate to="/seller/signup" />} // Protect, assuming seller route
        />
        <Route
          path="/user/signup"
          element={!isAuthenticated ? <UserSignupPage /> : <Navigate to="/market" />} // Redirect if already signed up
        />
        <Route
          path="/seller/signup"
          element={!isAuthenticated ? <SellerSignupPage /> : <Navigate to="/sellermarket" />} // Similar for seller
        />
        <Route
          path="/seller/dashboard"
          element={isAuthenticated && type=="seller"? <SellerCorner /> : <Navigate to="/market" />} // Similar for seller
        />
        <Route path="/cart" element={isAuthenticated && type=="user"?<CartPage/>:<Navigate to={"/"}/>}/>

        <Route path="/seller/login" 
          element={!isAuthenticated ? <SellerLoginPage /> : <Navigate to="/sellermarket" />}
        />

        <Route path="/user/login" 
          element={!isAuthenticated ? <UserLoginPage /> : <Navigate to="/market" />}
        />

        <Route path="/sellermarket/verify" element={<VerifySeller />} />
          <Route path="/admin" element={(type==="seller" && authUser.email==="abhinav@gmail.com") ? <AdminOrderManagement /> :type==="user"?<Navigate to={"/market"}/>:<Navigate to={"/sellerMarket"}/>}></Route>
      </Routes>

          
      <NavigationBar />
    </>
  );
}

export default App;
