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

function App() {
  const { isLoading, authUser } = useAuthUser();
  const isAuthenticated = Boolean(authUser);
 
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">Loading...</div>; // Simple loader
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Public */}
        <Route path="/market" element={<ArtisanMarketplace />} /> {/* Public */}
        <Route path="/product" element={<ProductDetailPage />} /> {/* Public? Add guard if needed */}
        <Route
          path="/seller"
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
          element={!isAuthenticated ? <SellerSignupPage /> : <Navigate to="/market" />} // Similar for seller
        />
      </Routes>
      <NavigationBar />
    </>
  );
}

export default App;
