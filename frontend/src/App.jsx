import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import NewArrivals from "./pages/NewArrivals";
import ProductDetails from "./pages/ProductDetails";
import Collections from "./pages/Collections";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import TrackOrder from "./pages/TrackOrder";
import Success from "./pages/Success";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchBar from "./components/SearchBar";
import Chatbot from "./components/Chatbot";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <ToastContainer />
        <Header />
        <SearchBar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new-arrivals" element={<NewArrivals />} />
            <Route path="/product/:productId" element={<ProductDetails />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/success" element={<Success />} />
          </Routes>
        </main>

        <Chatbot />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
