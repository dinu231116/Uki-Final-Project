import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51RlQJhRx75sIZYHeM7ZOPs0jaEfjWbrB5lpw5Sz3eYiAY6KjEkuAhgWU4RyjezRgjDdpdLuJ8Cb0bDPKNoO1GydH00Wnsn9oFh");


import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import WashingBooking from './pages/WashingBooking';
import IroningBooking from './pages/IroningBooking';
import DryCleaningBooking from './pages/DrycleaningBooking';

import AdminDashboard from './pages/AdminDashboard';
import PlaceOrder from './pages/PlaceOrder';

import PaymentPage from './pages/Payment';
import UsersPage from './pages/UsersPage';
import OrdersPage from "./pages/ OrdersPage";
import PaymentsPage from './pages/PaymentsPage';
import OurServices from "./components/OurServices";
import OrderConfirmation from './pages/ OrderConfirmation';
import MyOrdersPage from './pages/MyOrdersPage';
import ProfilePage from "./pages/ProfilePage";
import OrderDetails from "./pages/OrderDetails";
import FeedbackPage from './pages/FeedbackPage';
import SuccessPage from './pages/paymentSuccess'; 
 
import PrivateRoute from "./components/PrivateRoute";

import CartPage from './pages/CartPage';  // you need to create this component

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminServices from './pages/AdminServices';




function App() {
  return (
    <Router>

      <Navbar />
       <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking/washing" element={<WashingBooking />} />
        <Route path="/booking/ironing" element={<IroningBooking />} />
        <Route path="/booking/dry-cleaning" element={<DryCleaningBooking />} />


        <Route path="/place-order" element={<PlaceOrder />} />

        {/* <Route path="/payment" element={<PaymentPage />} /> */}

 {/* ✅ Payment Route with Elements */}
        <Route
          path="/payment"
          element={
            <Elements stripe={stripePromise}>
              <PaymentPage />
            </Elements>
          }
        />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/orders" element={<OrdersPage />} />
        <Route path="/admin/payments" element={<PaymentsPage />} />
        <Route path="/admin/services" element={<AdminServices />} />
       
       
                                               
      <Route path="/our-services" element={<OurServices />} />
      <Route path="/order-confirmation" element={<OrderConfirmation />} />
      <Route path="/orders" element={<MyOrdersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/orders/:orderId" element={<OrderDetails />} />
           <Route path="/feedback/:orderId" element={<FeedbackPage />} />
        
      <Route path="/cart" element={<CartPage />} />
       
          <Route path="/success" element={<SuccessPage />} />
       


          

      
    
    
          
      </Routes>
    </Router>
  );
}

export default App;
