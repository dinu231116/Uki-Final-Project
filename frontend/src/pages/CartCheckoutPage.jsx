import React, { useState, useEffect } from 'react';

const CartCheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [total, setTotal] = useState(0);

  // Page load ஆனவுடன் localStorage-ல் இருந்து cart fetch
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = cart.map(item => ({
      ...item,
      qty: item.qty || 1,
      pieces: item.pieces || 1,
    }));
    setCartItems(updatedCart);
  }, []);

  // Total amount auto update
  useEffect(() => {
    const totalAmount = cartItems.reduce((acc, item) => {
      const itemTotal = (item.rate || 0) * (item.qty || 1) * (item.pieces || 1);
      return acc + itemTotal;
    }, 0);
    setTotal(totalAmount);
  }, [cartItems]);

  // Qty change
  const handleQtyChange = (idx, change) => {
    const updatedItems = [...cartItems];
    let newQty = (updatedItems[idx].qty || 1) + change;
    if (newQty < 1) newQty = 1;
    updatedItems[idx].qty = newQty;
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  // Pieces change
  const handlePiecesChange = (idx, change) => {
    const updatedItems = [...cartItems];
    let newPieces = (updatedItems[idx].pieces || 1) + change;
    if (newPieces < 1) newPieces = 1;
    updatedItems[idx].pieces = newPieces;
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  // Delete item
  const handleDelete = (idx) => {
    const updatedItems = [...cartItems];
    updatedItems.splice(idx, 1);
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  // Currency formatter
 const formatCurrency = (value) =>
  new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(value);


  // ✅ Order Submit → localStorage-ஐ நேரடி-ஆ check பண்ணும் வழி
  const handleOrder = (e) => {
    e.preventDefault();

    // localStorage-ல் இருந்து fresh cart எடுத்துக்கொள்
    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];

    if (currentCart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }

    if (!phone.match(/^[0-9]{10}$/)) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    const orderDetails = {
      name,
      phone,
      cartItems: currentCart,
      total,
    };

    console.log('Order Placed:', orderDetails);
    alert('Order placed successfully!');

    localStorage.removeItem('cart');
    setCartItems([]);
    setName('');
    setPhone('');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold">Laundry Cart & Checkout</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item, idx) => (
            <div
              key={idx}
              className="border p-4 mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <h3 className="text-lg font-semibold">{item.service}</h3>
                <p>Type of Cloth: {item.clothType}</p>
              </div>

              <div className="flex items-center gap-2">
                <label>Qty:</label>
                <button
                  onClick={() => handleQtyChange(idx, -1)}
                  disabled={(item.qty || 1) <= 1}
                  className="px-2 py-1 border disabled:opacity-50"
                >
                  -
                </button>
                <span>{item.qty || 1}</span>
                <button
                  onClick={() => handleQtyChange(idx, 1)}
                  className="px-2 py-1 border"
                >
                  +
                </button>
              </div>

              <div className="flex items-center gap-2">
                <label>Pieces:</label>
                <button
                  onClick={() => handlePiecesChange(idx, -1)}
                  disabled={(item.pieces || 1) <= 1}
                  className="px-2 py-1 border disabled:opacity-50"
                >
                  -
                </button>
                <span>{item.pieces || 1}</span>
                <button
                  onClick={() => handlePiecesChange(idx, 1)}
                  className="px-2 py-1 border"
                >
                  +
                </button>
              </div>

              <div>
                <p>Rate: {formatCurrency(item.rate)}</p>
                <p>
                  Total: {formatCurrency((item.rate || 0) * (item.qty || 1) * (item.pieces || 1))}
                </p>
              </div>

              <button
                onClick={() => handleDelete(idx)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))}

          <div className="text-right font-bold text-xl mb-4">
            Subtotal: {formatCurrency(total)}
          </div>
        </div>
      )}

      {cartItems.length > 0 && (
        <form onSubmit={handleOrder} className="space-y-4 border-t pt-6">
          <h3 className="text-2xl font-semibold mb-4">Checkout Details</h3>

          <div>
            <label className="block mb-1">Customer Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border p-2 w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Phone</label>
            <input
              type="tel"
              pattern="[0-9]{10}"
              title="Please enter a 10-digit phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="border p-2 w-full"
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Place Order
          </button>
        </form>
      )}
    </div>
  );
};

export default CartCheckoutPage;