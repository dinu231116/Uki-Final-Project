import React, { useEffect, useState , useRef} from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { scroller } from 'react-scroll';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileName, setProfileName] = useState('');
  const [cartCount, setCartCount] = useState(0);
    const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);

    const cartRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');
    if (token && name) {
      setProfileName(name);
    } else {
      setProfileName('');
    }

    // Load cart count and items on mount
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartCount(cart.length);
    setCartItems(cart);

    // Listen for cart updates
    const handleCartUpdated = () => {
      const updatedCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartCount(updatedCart.length);
      setCartItems(updatedCart);
    };

    window.addEventListener('cartUpdated', handleCartUpdated);

    // Click outside cart popup to close
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setShowCart(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdated);
      document.removeEventListener('mousedown', handleClickOutside);
    };


  }, [location]);

  const handleScrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        scroller.scrollTo(sectionId, {
          duration: 800,
          delay: 0,
          smooth: 'easeInOutQuart',
          offset: -80,
        });
      }, 300);
    } else {
      scroller.scrollTo(sectionId, {
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart',
        offset: -80,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setProfileName('');
    navigate('/login');
  };

  // Navigate to profile page on click
  const goToProfile = () => {
    navigate('/profile');
  };

  const toggleCart = () => {
    setShowCart((prev) => !prev);
  };

  const goToCartPage = () => {
    navigate('/cart');
    setShowCart(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md flex justify-between items-center px-6 py-4">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <RouterLink to="/" className="flex items-center gap-2">
          <img src="/src/assets/logo.png" alt="Logo" className="h-8 w-8" />
          <span className="text-xl font-bold text-blue-800">
            SPARK <span className="text-gray-700">WASH</span>
          </span>
        </RouterLink>
      </div>

      {/* Menu */}
      <ul className="flex gap-6 items-center">
        <li>
          <RouterLink to="/" className="text-gray-800 hover:text-blue-600">
            Home
          </RouterLink>
        </li>
        <li>
          <button
            onClick={() => handleScrollToSection('about')}
            className="text-gray-800 hover:text-blue-600"
          >
            About
          </button>
        </li>
        <li>
          <button
            onClick={() => handleScrollToSection('services')}
            className="text-gray-800 hover:text-blue-600"
          >
            Services
          </button>
        </li>
        <li>
          <button
            onClick={() => handleScrollToSection('contact')}
            className="text-gray-800 hover:text-blue-600"
          >
            Contact
          </button>
        </li>


        {/* Cart Button */}
        {cartCount > 0 && (
          <li className="relative">
            <button
              onClick={toggleCart}
              className="relative px-3 py-2 bg-green-200 text-dark rounded hover:bg-green-300"
              title="View Cart"
            >
              🛒 ({cartCount})
            </button>

            {/* Cart popup */}
            {showCart && (
              <div
                ref={cartRef}
                className="absolute right-0 mt-2 w-80 max-h-96 overflow-auto bg-white border border-gray-300 rounded shadow-lg z-50 p-4"
              >
                <h4 className="font-semibold mb-2">Your Cart Items</h4>
                {cartItems.length === 0 ? (
                  <p className="text-gray-600">Your cart is empty.</p>
                ) : (
                  <ul className="divide-y divide-gray-200 max-h-64 overflow-auto">
                    {cartItems.map((item, idx) => (
                      <li key={idx} className="py-2 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name || item.dress || "Item"}</p>
                          <p className="text-sm text-gray-600">Qty: {item.qty || item.quantity || 1}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            ₹{item.rate ? (item.rate * (item.qty || 1)).toFixed(2) : "N/A"}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => setShowCart(false)}
                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Close
                  </button>
                  <button
                    onClick={goToCartPage}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Go to Cart
                  </button>
                </div>
              </div>
            )}
          </li>
        )}


        <li>
          {profileName ? (
            <div className="flex items-center gap-2">
              {/* Make profile circle clickable */}
              <div
                onClick={goToProfile}
                className="cursor-pointer w-10 h-10 bg-blue-800 text-white flex items-center justify-center rounded-full uppercase"
                title="View Profile"
              >
                {profileName.charAt(0)}
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 text-sm text-blue-700 underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <RouterLink
              to="/login"
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Login
            </RouterLink>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
