import { Route, Routes } from "react-router-dom"
import NavigationBar from "./components/navigationBar.jsx"
import Home from "./pages/Home.jsx"
import ArtisanMarketplace from "./pages/MarketPlace.jsx"
import ProductDetailPage from "./pages/ProductDetail.jsx"
import SellerProfilePage from "./pages/SellerProfile.jsx"
import UserProfilePage from "./pages/UserPofilePage.jsx"
import SellerAddItemPage from "./pages/AddItem.jsx"
import UserSignupPage from "./pages/UserSignup.jsx"
import SellerSignupPage from "./pages/SellerSignup.jsx"

function App() {

  return (
    <>
    <Routes>
    <Route path="/" element={<Home/>}></Route>
    <Route path="/market" element={<ArtisanMarketplace/>}></Route>
    <Route path="/product" element={<ProductDetailPage />}></Route>
    <Route path="/seller" element={<SellerProfilePage />}></Route>
    <Route path="/user" element={<UserProfilePage/>}></Route>
    <Route path="/add-item" element={<SellerAddItemPage/>}></Route>
    <Route path="/user/signup" element={<UserSignupPage/>}></Route>
    <Route path="/seller/signup" element={<SellerSignupPage/>}></Route>
    </Routes>

    <NavigationBar/>
    </>
  )
}

export default App
