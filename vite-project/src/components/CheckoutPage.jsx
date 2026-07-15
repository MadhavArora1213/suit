import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, CreditCard, Shield, QrCode, AlertCircle, ShoppingBag, Truck, MessageSquare } from 'lucide-react';
import { addOrder } from '../utils/adminStore';

export default function CheckoutPage({ cart, setView, clearCart }) {
  // Steps: 1 = Address, 2 = Payment, 3 = Completed
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [paymentMode, setPaymentMode] = useState('card'); // card, upi, cod
  const [processingPayment, setProcessingPayment] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  
  // Forms
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });

  const [cardData, setCardData] = useState({
    cardholder: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const [upiId, setUpiId] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const [orderId] = useState(() => 'GN-' + Math.floor(100000 + Math.random() * 900000));
  const [finalOrderCart, setFinalOrderCart] = useState([]);
  const [finalPaymentMode, setFinalPaymentMode] = useState('');

  const getSubtotal = () => cart.reduce((total, item) => {
    const priceNum = parseInt(item.price.replace(/[^\d]/g, ''), 10);
    return total + priceNum * item.quantity;
  }, 0);

  const applyPromoCode = () => {
    if (couponCode.toUpperCase() === 'SUITE15') {
      const subtotal = getSubtotal();
      const discount = Math.round(subtotal * 0.15);
      setAppliedDiscount(discount);
      alert('Promo Code SUITE15 applied! Extra 15% discount loaded.');
    } else {
      alert('Invalid coupon code. Try SUITE15.');
    }
  };

  const getGrandTotal = () => {
    return getSubtotal() - appliedDiscount;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cardNumber') {
      // Formatter for card number space separation
      const val = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
      setCardData(prev => ({ ...prev, [name]: formatted.slice(0, 19) }));
    } else if (name === 'expiry') {
      const val = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      if (val.length >= 2) {
        setCardData(prev => ({ ...prev, [name]: val.slice(0, 2) + '/' + val.slice(2, 4) }));
      } else {
        setCardData(prev => ({ ...prev, [name]: val }));
      }
    } else if (name === 'cvv') {
      setCardData(prev => ({ ...prev, [name]: value.replace(/[^0-9]/g, '').slice(0, 3) }));
    } else {
      setCardData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.zip) {
      alert('Please fill in all required shipping fields.');
      return;
    }
    setCheckoutStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    
    // Validations based on selected method
    if (paymentMode === 'card') {
      if (!cardData.cardholder || cardData.cardNumber.length < 19 || cardData.expiry.length < 5 || cardData.cvv.length < 3) {
        alert('Please fill in valid Card Details (16-digit card number, MM/YY expiry, and 3-digit CVV).');
        return;
      }
    } else if (paymentMode === 'upi') {
      if (!upiId.includes('@')) {
        alert('Please enter a valid UPI ID (e.g. name@upi).');
        return;
      }
    }

    // Trigger simulation loader
    const paymentStr = paymentMode === 'card' ? 'Debit/Credit Card' : paymentMode === 'upi' ? `UPI (${upiId})` : 'Cash on Delivery (COD)';
    setFinalOrderCart([...cart]);
    setFinalPaymentMode(paymentStr);
    setProcessingPayment(true);
    setLoadingMsg('Connecting to secure banking gateway...');

    const subtotal = getSubtotal();
    const grandTotal = getGrandTotal();

    const orderRecord = {
      id: orderId,
      orderId: orderId,
      customer: formData.name,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      address: formData.address,
      amount: `₹${grandTotal.toLocaleString()}`,
      amountNum: grandTotal,
      payment: paymentStr,
      status: 'Pending',
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      createdAt: new Date().toISOString(),
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        size: item.size,
        quantity: item.quantity,
        image: item.image
      })),
      subtotal: subtotal,
      discount: appliedDiscount,
      grandTotal: grandTotal
    };

    setTimeout(() => {
      setLoadingMsg('Verifying payment authentication token...');
      setTimeout(() => {
        setLoadingMsg('Creating secure order database records...');
        setTimeout(() => {
          // Save order to store and DB
          addOrder(orderRecord);
          
          setProcessingPayment(false);
          setCheckoutStep(3);
          clearCart(); // Clear cart after placing order
        }, 1000);
      }, 1000);
    }, 1200);
  };

  // Step 3: Success page
  if (checkoutStep === 3) {
    const totalAmount = finalOrderCart.reduce((total, item) => {
      const priceNum = parseInt(item.price.replace(/[^\d]/g, ''), 10);
      return total + priceNum * item.quantity;
    }, 0) - appliedDiscount;

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-[800px] mx-auto px-6 pt-32 pb-24 text-center min-h-[80vh] text-[#111111]"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="flex flex-col items-center gap-6 border border-[#BCA58A]/20 bg-white p-8 md:p-12 shadow-2xl rounded text-left">
          
          <div className="w-full flex flex-col items-center text-center gap-3">
            <CheckCircle2 size={56} className="text-[#005461]" />
            <h2 className="text-3xl md:text-4xl font-light text-[#111111] tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Order Placed Successfully!
            </h2>
            <p className="text-xs text-[#6B6B6B] uppercase tracking-widest font-bold">Thank you for shopping with Gurnaaz</p>
            <div className="w-16 h-px bg-[#BCA58A]/30 my-2" />
          </div>

          <p className="text-xs text-[#6B6B6B] leading-relaxed text-center w-full max-w-[550px] mx-auto">
            Your transaction has been securely authorized. We have sent a purchase invoice confirmation to <strong>{formData.email || 'your email'}</strong>. Your order is prepared for immediate boutique packaging.
          </p>

          {/* Invoice Summary Card */}
          <div className="w-full border border-[#BCA58A]/15 bg-[#FAF9F6] rounded p-6 md:p-8 space-y-6">
            <div className="flex flex-wrap justify-between items-center border-b border-[#BCA58A]/10 pb-4 gap-4 text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">
              <div>
                <span>Order ID: </span>
                <span className="text-[#111111] font-mono">{orderId}</span>
              </div>
              <div>
                <span>Mode: </span>
                <span className="text-[#005461]">{finalPaymentMode}</span>
              </div>
            </div>

            {/* List items */}
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-widest text-[#BCA58A] font-bold block">Items Invoice</span>
              <div className="divide-y divide-[#BCA58A]/10">
                {finalOrderCart.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="py-3 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-13 overflow-hidden bg-white border border-[#BCA58A]/10">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#111111] line-clamp-1">{item.name}</p>
                        <p className="text-[9px] text-[#6B6B6B] mt-0.5">Size: {item.size} · Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-[#111111]">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price breakdown */}
            <div className="border-t border-[#BCA58A]/10 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-[#6B6B6B]">
                <span>Items Subtotal</span>
                <span>₹{(totalAmount + appliedDiscount).toLocaleString()}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Promo Code Discount (SUITE15)</span>
                  <span>-₹{appliedDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-[#6B6B6B]">
                <span>Boutique Dispatch & Delivery</span>
                <span className="text-emerald-600">FREE</span>
              </div>
              <div className="border-t border-[#BCA58A]/20 pt-3 flex justify-between text-sm font-bold text-[#111111]">
                <span>Grand Total Paid</span>
                <span className="text-[#005461]">₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Delivery address details */}
            <div className="border-t border-[#BCA58A]/10 pt-4 text-xs space-y-1.5">
              <span className="text-[10px] uppercase tracking-widest text-[#BCA58A] font-bold block mb-1">Shipping Destination</span>
              <p className="font-semibold text-[#111111]">{formData.name} · {formData.phone}</p>
              <p className="text-[#6B6B6B] leading-relaxed">{formData.address}, {formData.city}, {formData.state} - {formData.zip}</p>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
            <a 
              href={`https://wa.me/919877275894?text=Hi%20Gurnaaz%20Support,%20I%20have%20placed%20order%20${orderId}%20for%20amount%20Rs.%20${totalAmount.toLocaleString()}.%20Please%20provide%20delivery%20updates.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#25D366] hover:bg-[#20ba59] text-white py-4 rounded text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-colors shadow shadow-emerald-200/50"
            >
              <MessageSquare size={14} />
              <span>Trace on WhatsApp</span>
            </a>

            <button 
              onClick={() => window.location.href = '/sell'}
              className="flex-1 border border-[#BCA58A]/35 hover:border-[#111111] text-[#111111] py-4 rounded text-xs font-bold tracking-widest uppercase transition-all"
            >
              Back to Storefront
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#111111] pt-32 pb-24" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      
      {/* Dynamic Payment Gateways Secure Loader */}
      <AnimatePresence>
        {processingPayment && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex flex-col items-center justify-center gap-6"
          >
            {/* Spinning Loader */}
            <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-[#BCA58A] animate-spin" />
            <div className="space-y-2 text-center px-6">
              <h3 className="text-xl font-light text-white tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Secure Payment Authorization
              </h3>
              <p className="text-xs text-[#BCA58A] font-semibold uppercase tracking-widest animate-pulse">
                {loadingMsg}
              </p>
              <div className="flex items-center gap-1.5 justify-center text-[10px] text-[#6B6B6B] uppercase font-bold pt-4">
                <Shield size={12} className="text-emerald-500" />
                <span>256-bit SSL encrypted transaction gate</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-left">
        
        {/* Navigation back */}
        <button 
          onClick={() => {
            if (checkoutStep === 2) {
              setCheckoutStep(1);
            } else {
              setView('cart');
            }
          }}
          className="inline-flex items-center gap-2 text-xs tracking-widest text-[#BCA58A] hover:text-[#111111] uppercase font-bold transition-colors cursor-pointer mb-8"
        >
          <ArrowLeft size={13} />
          <span>{checkoutStep === 2 ? 'Return to Shipping Address' : 'Return to Cart Bag'}</span>
        </button>

        {/* Header and Step Indicators */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-[#BCA58A]/15 pb-6">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-[#111111]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Checkout Flow
          </h1>

          {/* Stepper bar */}
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
            <span className={`pb-1 border-b-2 transition-all ${checkoutStep >= 1 ? 'border-[#005461] text-[#005461]' : 'border-transparent text-[#6B6B6B]'}`}>1. Shipping</span>
            <span className="text-[#BCA58A]">→</span>
            <span className={`pb-1 border-b-2 transition-all ${checkoutStep >= 2 ? 'border-[#005461] text-[#005461]' : 'border-transparent text-[#6B6B6B]'}`}>2. Payment</span>
            <span className="text-[#BCA58A]">→</span>
            <span className={`pb-1 border-b-2 transition-all ${checkoutStep === 3 ? 'border-[#005461] text-[#005461]' : 'border-transparent text-[#6B6B6B]'}`}>3. Placed</span>
          </div>
        </div>

        {cart.length === 0 && checkoutStep < 3 ? (
          <div className="py-20 text-center border border-[#BCA58A]/15 bg-white p-10 rounded">
            <ShoppingBag size={32} className="mx-auto text-[#BCA58A] mb-4" />
            <h3 className="text-xl font-light mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Your bag is empty</h3>
            <button onClick={() => window.location.href = '/sell'} className="mt-4 bg-[#BCA58A] text-white px-8 py-3 text-xs font-bold tracking-widest uppercase hover:bg-[#9A8268] transition-colors">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 xl:gap-16 items-start">
            
            {/* LEFT / MIDDLE columns: Shipping Address / Payment Gateways */}
            <div className="lg:col-span-2">
              
              {/* STEP 1: Address form */}
              {checkoutStep === 1 && (
                <div className="bg-white border border-[#BCA58A]/15 p-8 rounded shadow-sm">
                  <h3 className="text-2xl font-light border-b border-[#BCA58A]/10 pb-4 mb-6 text-[#111111]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Shipping Destination
                  </h3>
                  
                  <form onSubmit={handleAddressSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] uppercase tracking-widest text-[#6B6B6B] font-bold block">Full Name *</label>
                        <input 
                          type="text" 
                          name="name" 
                          required 
                          value={formData.name} 
                          onChange={handleInputChange}
                          placeholder="e.g. Gurpreet Singh"
                          className="w-full bg-[#FAF9F6] border border-[#BCA58A]/20 focus:border-[#BCA58A] outline-none p-3.5 text-xs transition-colors rounded font-semibold"
                        />
                      </div>
                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] uppercase tracking-widest text-[#6B6B6B] font-bold block">Phone Number *</label>
                        <input 
                          type="tel" 
                          name="phone" 
                          required 
                          value={formData.phone} 
                          onChange={handleInputChange}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full bg-[#FAF9F6] border border-[#BCA58A]/20 focus:border-[#BCA58A] outline-none p-3.5 text-xs transition-colors rounded font-semibold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[9px] uppercase tracking-widest text-[#6B6B6B] font-bold block">Email Address *</label>
                      <input 
                        type="email" 
                        name="email" 
                        required
                        value={formData.email} 
                        onChange={handleInputChange}
                        placeholder="e.g. gurpreet@example.com"
                        className="w-full bg-[#FAF9F6] border border-[#BCA58A]/20 focus:border-[#BCA58A] outline-none p-3.5 text-xs transition-colors rounded font-semibold"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[9px] uppercase tracking-widest text-[#6B6B6B] font-bold block">Street Address *</label>
                      <input 
                        type="text" 
                        name="address" 
                        required 
                        value={formData.address} 
                        onChange={handleInputChange}
                        placeholder="Flat, Villa number, street name"
                        className="w-full bg-[#FAF9F6] border border-[#BCA58A]/20 focus:border-[#BCA58A] outline-none p-3.5 text-xs transition-colors rounded font-semibold"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] uppercase tracking-widest text-[#6B6B6B] font-bold block">City *</label>
                        <input 
                          type="text" 
                          name="city" 
                          required 
                          value={formData.city} 
                          onChange={handleInputChange}
                          placeholder="e.g. Amritsar"
                          className="w-full bg-[#FAF9F6] border border-[#BCA58A]/20 focus:border-[#BCA58A] outline-none p-3.5 text-xs transition-colors rounded font-semibold"
                        />
                      </div>
                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] uppercase tracking-widest text-[#6B6B6B] font-bold block">State *</label>
                        <input 
                          type="text" 
                          name="state" 
                          required 
                          value={formData.state} 
                          onChange={handleInputChange}
                          placeholder="e.g. Punjab"
                          className="w-full bg-[#FAF9F6] border border-[#BCA58A]/20 focus:border-[#BCA58A] outline-none p-3.5 text-xs transition-colors rounded font-semibold"
                        />
                      </div>
                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] uppercase tracking-widest text-[#6B6B6B] font-bold block">ZIP / Postal Code *</label>
                        <input 
                          type="text" 
                          name="zip" 
                          required 
                          value={formData.zip} 
                          onChange={handleInputChange}
                          placeholder="e.g. 143001"
                          className="w-full bg-[#FAF9F6] border border-[#BCA58A]/20 focus:border-[#BCA58A] outline-none p-3.5 text-xs transition-colors rounded font-semibold"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#111111] hover:bg-[#BCA58A] hover:text-[#FAF9F6] text-[#FAF9F6] py-4 text-xs font-bold tracking-widest transition-colors cursor-pointer uppercase rounded mt-4"
                    >
                      PROCEED TO PAYMENT STEP
                    </button>
                  </form>
                </div>
              )}

              {/* STEP 2: Secure Payment Gateways */}
              {checkoutStep === 2 && (
                <div className="bg-white border border-[#BCA58A]/15 p-8 rounded shadow-sm space-y-8">
                  <div>
                    <h3 className="text-2xl font-light border-b border-[#BCA58A]/10 pb-4 text-[#111111]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      Secure Checkout Gateway
                    </h3>
                    <p className="text-xs text-[#6B6B6B] mt-1">Select your preferred payment method. Transactions are 256-bit SSL encrypted.</p>
                  </div>

                  {/* Payment modes selectors */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'card', label: 'Credit Card', icon: <CreditCard size={16} /> },
                      { id: 'upi', label: 'UPI / QR', icon: <QrCode size={16} /> },
                      { id: 'cod', label: 'COD (Cash)', icon: <Truck size={16} /> }
                    ].map(mode => (
                      <button 
                        key={mode.id}
                        onClick={() => setPaymentMode(mode.id)}
                        className={`py-3.5 border flex flex-col items-center gap-1.5 text-[10px] tracking-wider uppercase font-bold transition-all rounded cursor-pointer ${
                          paymentMode === mode.id 
                            ? 'bg-[#E8DDD0]/30 border-[#BCA58A] text-[#005461]' 
                            : 'border-[#BCA58A]/25 hover:border-[#111111] text-[#6B6B6B]'
                        }`}
                      >
                        {mode.icon}
                        <span>{mode.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Form Container based on selected Mode */}
                  <form onSubmit={handlePaymentSubmit} className="space-y-6 pt-4 border-t border-[#BCA58A]/10">
                    
                    {/* CARD OPTION */}
                    {paymentMode === 'card' && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="space-y-1.5 text-left">
                          <label className="text-[9px] uppercase tracking-widest text-[#6B6B6B] font-bold block">Cardholder Name *</label>
                          <input 
                            type="text" 
                            name="cardholder"
                            required={paymentMode === 'card'}
                            value={cardData.cardholder}
                            onChange={handleCardInputChange}
                            placeholder="e.g. Gurpreet Singh"
                            className="w-full bg-[#FAF9F6] border border-[#BCA58A]/20 focus:border-[#BCA58A] outline-none p-3.5 text-xs transition-colors rounded font-semibold"
                          />
                        </div>

                        <div className="space-y-1.5 text-left">
                          <label className="text-[9px] uppercase tracking-widest text-[#6B6B6B] font-bold block">16-Digit Card Number *</label>
                          <input 
                            type="text" 
                            name="cardNumber"
                            required={paymentMode === 'card'}
                            value={cardData.cardNumber}
                            onChange={handleCardInputChange}
                            placeholder="4000 1234 5678 9010"
                            className="w-full bg-[#FAF9F6] border border-[#BCA58A]/20 focus:border-[#BCA58A] outline-none p-3.5 text-xs transition-colors rounded font-semibold font-mono"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5 text-left">
                            <label className="text-[9px] uppercase tracking-widest text-[#6B6B6B] font-bold block">Expiry Date *</label>
                            <input 
                              type="text" 
                              name="expiry"
                              required={paymentMode === 'card'}
                              value={cardData.expiry}
                              onChange={handleCardInputChange}
                              placeholder="MM/YY"
                              className="w-full bg-[#FAF9F6] border border-[#BCA58A]/20 focus:border-[#BCA58A] outline-none p-3.5 text-xs transition-colors rounded font-semibold font-mono"
                            />
                          </div>

                          <div className="space-y-1.5 text-left">
                            <label className="text-[9px] uppercase tracking-widest text-[#6B6B6B] font-bold block">Security CVV *</label>
                            <input 
                              type="password" 
                              name="cvv"
                              required={paymentMode === 'card'}
                              value={cardData.cvv}
                              onChange={handleCardInputChange}
                              placeholder="123"
                              className="w-full bg-[#FAF9F6] border border-[#BCA58A]/20 focus:border-[#BCA58A] outline-none p-3.5 text-xs transition-colors rounded font-semibold font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* UPI OPTION */}
                    {paymentMode === 'upi' && (
                      <div className="space-y-6 animate-fadeIn text-center flex flex-col items-center">
                        <div className="w-full bg-[#FAF9F6] border border-[#BCA58A]/15 p-4 rounded text-left space-y-1.5">
                          <span className="text-[10px] uppercase tracking-widest text-[#BCA58A] font-bold block">Option 1: Scan QR Code</span>
                          <p className="text-xs text-[#6B6B6B] leading-relaxed">Open BHIM, GPay, PhonePe, or Paytm and scan the QR code to proceed.</p>
                          <div className="w-36 h-36 bg-white border border-[#BCA58A]/20 p-2 shadow-inner rounded flex items-center justify-center mx-auto my-3">
                            <img src="/gpay_qr_code.png" alt="Google Pay QR Code" className="w-full h-full object-contain" />
                          </div>
                        </div>

                        <div className="w-full text-left space-y-1.5">
                          <label className="text-[9px] uppercase tracking-widest text-[#6B6B6B] font-bold block">Option 2: Enter UPI ID *</label>
                          <input 
                            type="text" 
                            required={paymentMode === 'upi'}
                            value={upiId}
                            onChange={e => setUpiId(e.target.value)}
                            placeholder="e.g. name@okhdfcbank"
                            className="w-full bg-[#FAF9F6] border border-[#BCA58A]/20 focus:border-[#BCA58A] outline-none p-3.5 text-xs transition-colors rounded font-semibold font-mono"
                          />
                        </div>
                      </div>
                    )}

                    {/* COD OPTION */}
                    {paymentMode === 'cod' && (
                      <div className="space-y-4 animate-fadeIn text-left bg-[#E8DDD0]/15 border border-[#BCA58A]/25 p-5 rounded">
                        <div className="flex gap-3 items-start">
                          <AlertCircle size={18} className="text-[#005461] mt-0.5 flex-shrink-0" />
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider">Cash on Delivery Terms:</h4>
                            <p className="text-xs text-[#6B6B6B] leading-relaxed">
                              You will pay the courier executive in cash or via UPI when the package is delivered. A verification call will be placed by the boutique before packing.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Submit Order */}
                    <button 
                      type="submit"
                      className="w-full bg-[#005461] hover:bg-[#003B44] text-[#FAF9F6] py-4 text-xs font-bold tracking-widest transition-colors cursor-pointer uppercase rounded"
                    >
                      {paymentMode === 'cod' ? 'PLACE CASH ON DELIVERY ORDER' : `PAY ₹${getGrandTotal().toLocaleString()} & AUTHORIZE ORDER`}
                    </button>
                  </form>
                </div>
              )}

            </div>

            {/* RIGHT column: Order Summary & Promo Code */}
            <div className="space-y-6">
              
              {/* Promo Code box */}
              {checkoutStep < 3 && (
                <div className="bg-white border border-[#BCA58A]/15 p-6 rounded shadow-sm space-y-3 text-left">
                  <span className="text-[10px] uppercase tracking-widest text-[#6B6B6B] font-bold block">Apply Discount Code</span>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      placeholder="e.g. SUITE15"
                      className="flex-1 bg-[#FAF9F6] border border-[#BCA58A]/20 focus:border-[#BCA58A] outline-none p-3 text-xs uppercase font-semibold font-mono rounded"
                    />
                    <button 
                      onClick={applyPromoCode}
                      className="bg-[#111111] hover:bg-[#BCA58A] text-white px-5 py-3 text-[10px] font-bold tracking-widest uppercase transition-colors"
                    >
                      APPLY
                    </button>
                  </div>
                  <p className="text-[9px] text-[#6B6B6B] leading-relaxed">Use coupon code <span className="font-bold text-[#BCA58A]">SUITE15</span> to get flat 15% off on your first boutique suit purchase.</p>
                </div>
              )}

              {/* Order Summary box */}
              <div className="border border-[#BCA58A]/15 bg-white p-6 md:p-8 space-y-6 shadow-sm rounded text-left">
                <h3 className="text-xl font-light border-b border-[#BCA58A]/10 pb-4 text-[#111111]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Items Summary
                </h3>

                <div className="divide-y divide-[#BCA58A]/10 max-h-[250px] overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="py-4 flex gap-4 first:pt-0 last:pb-0 text-left">
                      <div className="w-12 h-16 bg-[#E8DDD0] overflow-hidden flex-shrink-0 border border-[#BCA58A]/5">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-[#111111] truncate">{item.name}</h4>
                        <span className="text-[9px] text-[#6B6B6B] block">Size: {item.size} · Qty: {item.quantity}</span>
                        <span className="text-xs font-semibold text-[#BCA58A] block mt-0.5">{item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#BCA58A]/15 pt-4 space-y-2 text-xs uppercase tracking-wider font-semibold text-[#6B6B6B]">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="text-[#111111]">₹{getSubtotal().toLocaleString()}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Promo Discount</span>
                      <span>-₹{appliedDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Boutique Dispatch</span>
                    <span className="text-emerald-600">FREE</span>
                  </div>
                  <div className="border-t border-[#BCA58A]/10 mt-2 pt-2 flex justify-between text-sm text-[#111111] font-bold">
                    <span>Grand Total</span>
                    <span className="text-[#005461]">₹{getGrandTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
