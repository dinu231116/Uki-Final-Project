import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CombinedCartCheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = cart.map(item => ({
      ...item,
      pieces: item.pieces || 1,
    }));
    setCartItems(updatedCart);
  }, []);

  useEffect(() => {
    const totalAmount = cartItems.reduce((acc, item) => {
      const itemTotal = (item.rate || 0) * (item.pieces || 1);
      return acc + itemTotal;
    }, 0);
    setTotal(totalAmount);
  }, [cartItems]);

  const handlePiecesChange = (idx, change) => {
    const updatedItems = [...cartItems];
    let newPieces = (updatedItems[idx].pieces || 1) + change;

    const minQty = updatedItems[idx].minQty || 1;
    const maxQty = updatedItems[idx].maxQty || Infinity;

    if (newPieces < minQty) {
      toast.warn(`Minimum pieces: ${minQty}`);
      newPieces = minQty;
    }
    if (newPieces > maxQty) {
      toast.warn(`Maximum pieces: ${maxQty}`);
      newPieces = maxQty;
    }

    updatedItems[idx].pieces = newPieces;
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  const handleDelete = (idx) => {
    const updatedItems = [...cartItems];
    const deletedItem = updatedItems.splice(idx, 1)[0]; // get deleted item
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));

    toast.info(`${deletedItem.clothType || deletedItem.name || 'Item'} deleted from cart.`);
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(value);

  const handleOrder = () => {
    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];

    if (currentCart.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    const orderDetails = {
      cartItems: currentCart,
      total,
    };

    navigate('/place-order', { state: orderDetails });

    localStorage.removeItem('cart');
    setCartItems([]);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-4xl font-bold text-gray-800 mb-1">
        🛒 Your Cart & Checkout
      </h2>
      <p className="text-gray-500 mb-4">
        Review your selected items and proceed to place your order.
      </p>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-inner border border-gray-200">
          <p className="text-5xl mb-4">🛍️</p>
          <p className="text-xl text-gray-500 mb-2">Your cart is empty.</p>
          <p className="text-gray-400">Add some services to continue.</p>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-gray-300 rounded-lg overflow-hidden shadow">
            {cartItems.map((item, idx) => (
              <li
                key={idx}
                className="py-6 px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-200 transition-all duration-200 ease-in-out"
              >
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-800">
                    {item.clothType || item.name || item.dress || 'Item'}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <label className="font-medium text-gray-600">Pieces:</label>
                  <button
                    onClick={() => handlePiecesChange(idx, -1)}
                    disabled={(item.pieces || 1) <= (item.minQty || 1)}
                    className="w-8 h-8 flex items-center justify-center border rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-100 transition-all"
                  >
                    –
                  </button>
                  <span className="w-10 text-center font-bold text-gray-800">
                    {item.pieces || 1}
                  </span>
                  <button
                    onClick={() => handlePiecesChange(idx, 1)}
                    disabled={(item.pieces || 1) >= (item.maxQty || Infinity)}
                    className="w-8 h-8 flex items-center justify-center border rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-100 transition-all"
                  >
                    +
                  </button>
                </div>

                <div className="text-right min-w-[150px] text-gray-700 font-semibold">
                  <div>
                    Rate:{' '}
                    <span className="text-green-600">
                      {formatCurrency(item.rate || 0)}
                    </span>
                  </div>
                  <div className="mt-1">
                    Total:{' '}
                    <span className="text-green-800">
                      {formatCurrency((item.rate || 0) * (item.pieces || 1))}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(idx)}
                  className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow transition-all"
                >
                  🗑️ <span>Delete</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="text-right text-2xl font-extrabold text-gray-800 border-t pt-6 mt-6">
            Final Total:{' '}
            <span className="text-green-700">{formatCurrency(total)}</span>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleOrder}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-md transition-all"
            >
              ✅ Continue to Place Order
            </button>
          </div>
        </>
      )}

      {/* ✅ ToastContainer */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CombinedCartCheckoutPage;
