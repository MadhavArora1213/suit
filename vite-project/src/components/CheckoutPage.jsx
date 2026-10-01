import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, CreditCard, Shield, AlertCircle, ShoppingBag, Truck, MessageSquare, Trash2, Minus, Plus } from 'lucide-react';
import { addOrder, getCoupons, getProducts } from '../utils/adminStore';
import { RAZORPAY_KEY_ID, initiateRazorpayPayment } from '../utils/razorpay';
import { usePageTracking } from '../hooks/usePageTracking';
import { trackCheckoutStart, trackCheckoutStep, trackCheckoutAbandon, trackFormFill, trackFormFocus, trackFormBlur, trackFormSubmit, trackPaymentAttempt, trackPaymentSuccess, trackPaymentFail, trackPaymentAbandon } from '../utils/analytics';

const INTL_SHIPPING_NOTE = 'After you confirm your order, our team will connect with you for your order and let you know the shipping charges and all.';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

export default function CheckoutPage({ cart, setView, clearCart, removeFromCart, updateCartQty, changeCartItemSize }) {
  usePageTracking('Checkout', { cartItemCount: cart.length });

  useEffect(() => {
    trackCheckoutStart({
      cartItemCount: cart.length,
      cartTotal: cart.reduce((s, i) => s + (parseInt(String(i.price).replace(/\D/g, '')) || 0) * i.quantity, 0),
    });
    // Track abandon on unmount (user left checkout without completing)
    return () => {
      trackCheckoutAbandon(checkoutStepRef.current, { reason: 'page_leave' });
    };
  }, []);

  // Steps: 1 = Address, 2 = Payment, 3 = Completed
  const [checkoutStep, setCheckoutStep] = useState(1);
  const checkoutStepRef = useRef(1);
  const stepStartTime = useRef(Date.now());
  const [paymentMode, setPaymentMode] = useState('online'); // online, cod
  const [processingPayment, setProcessingPayment] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [isLocalDelivery, setIsLocalDelivery] = useState(false);
  const [shipRegion, setShipRegion] = useState('india'); // 'india' | 'international'

  // Keep ref in sync with state
  useEffect(() => { checkoutStepRef.current = checkoutStep; }, [checkoutStep]);
  
  // Forms
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'India'
  });

  const [couponCode, setCouponCode] = useState('');
  const [appliedPromoName, setAppliedPromoName] = useState('');
  const [finalDiscount, setFinalDiscount] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [isFetchingShipping, setIsFetchingShipping] = useState(false);

  const [orderId] = useState(() => 'GN-' + Math.floor(100000 + Math.random() * 900000));
  const [finalOrderCart, setFinalOrderCart] = useState([]);
  const [finalPaymentMode, setFinalPaymentMode] = useState('');

  const getSubtotal = () => cart.reduce((total, item) => {
    const priceNum = parseInt(item.price.replace(/[^\d]/g, ''), 10);
    return total + priceNum * item.quantity;
  }, 0);

  const appliedDiscount = useMemo(() => {
    if (!appliedPromoName) return 0;
    const match = getCoupons().find(c => c.code === appliedPromoName);
    if (!match) return 0;
    const subtotal = cart.reduce((total, item) => {
      const priceNum = parseInt(item.price.replace(/[^\d]/g, ''), 10);
      return total + priceNum * item.quantity;
    }, 0);
    return Number((subtotal * (match.discountPercentage / 100)).toFixed(2));
  }, [appliedPromoName, cart]);

  const applyPromoCode = () => {
    const coupons = getCoupons();
    const match = coupons.find(c => c.code === couponCode.toUpperCase().replace(/\s+/g, ''));
    if (match) {
      setAppliedPromoName(match.code);
      alert(`Promo Code ${match.code} applied! Flat ${match.discountPercentage}% discount loaded.`);
    } else {
      alert('Invalid coupon code. Please check and try again.');
    }
  };

  const getGrandTotal = () => {
    return getSubtotal() - appliedDiscount + shippingCost;
  };

  const getSizeOptions = (item) => {
    const liveProduct = getProducts().find(p => p.id === item.id);
    const sizes = liveProduct?.sizes?.length ? liveProduct.sizes : item.sizes;
    if (!sizes || sizes.length < 2) return [];
    const stock = liveProduct?.stockQty || item.stockQty;
    const options = sizes.filter(s => !(stock && typeof stock === 'object' && stock[s] !== undefined && stock[s] <= 0));
    if (!options.includes(item.size)) options.unshift(item.size);
    return options;
  };

  useEffect(() => {
    const fetchShippingCost = async () => {
      if (shipRegion === 'international') {
        setShippingCost(0);
        setIsFetchingShipping(false);
        return;
      }
      if (checkoutStep === 2 && formData.zip) {
        setIsFetchingShipping(true);
        try {
          const liveProducts = getProducts();
          const chargeableCart = cart.filter(item => {
            const liveProduct = liveProducts.find(p => p.id === item.id);
            return (liveProduct ? liveProduct.shippingType : item.shippingType) !== 'Free';
          });
          if (chargeableCart.length === 0) {
            setShippingCost(0);
            setIsFetchingShipping(false);
            return;
          }
          const weight = chargeableCart.reduce((total, item) => total + (item.quantity * (item.weight || 500)), 0) || 500;
          const pt = paymentMode === 'cod' ? 'cod' : 'prepaid';
          const response = await fetch(`/api/delhivery-shipping?zip=${formData.zip}&weight=${weight}&pt=${pt}`);
          if (response.ok) {
            const data = await response.json();
            const cost = (Array.isArray(data) ? data[0]?.total_amount : data?.value?.[0]?.total_amount) || 0;
            setShippingCost(cost);
          }
        } catch (err) {
          console.error("Shipping cost error:", err);
        } finally {
          setIsFetchingShipping(false);
        }
      }
    };
    // We already fetch in handleAddressSubmit initially, so this will primarily catch paymentMode toggles and cart edits.
    fetchShippingCost();
  }, [paymentMode, cart, shipRegion]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Country is locked to India for domestic deliveries.
    if (name === 'country' && shipRegion === 'india') return;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (value && value.length === 1) trackFormFill(name, value);
  };

  const selectRegion = (region) => {
    setShipRegion(region);
    setShippingCost(0);
    setIsFetchingShipping(false);
    setIsLocalDelivery(false);
    setPaymentMode('online');
    // Keep the address fields locked to the selected destination.
    setFormData(prev => ({
      ...prev,
      country: region === 'india' ? 'India' : '',
      state: ''
    }));
  };

  const handleInputFocus = (e) => {
    trackFormFocus(e.target.name);
  };

  const handleInputBlur = (e) => {
    trackFormBlur(e.target.name, !!e.target.value);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.zip || (shipRegion === 'international' && !formData.country)) {
      alert('Please fill in all required shipping fields.');
      return;
    }

    // India: only Indian states / 6-digit PIN codes are accepted.
    if (shipRegion === 'india') {
      if (!INDIAN_STATES.includes(formData.state)) {
        alert('Please select your state from the list.');
        return;
      }
      if (!/^\d{6}$/.test(formData.zip.trim())) {
        alert('Please enter a valid 6-digit Indian PIN code.');
        return;
      }
    }
    
    const filledFields = Object.entries(formData).filter(([, v]) => !!v).map(([k]) => k);
    trackFormSubmit(1, { filledFields, fieldsCount: filledFields.length });

    // International: no Delhivery check — shipping charges are quoted by the team later.
    if (shipRegion === 'international') {
      setShippingCost(0);
      setIsFetchingShipping(false);
      setIsLocalDelivery(false);
      setPaymentMode('online');
      setCheckoutStep(2);
      const intlStepTime = Math.round((Date.now() - stepStartTime.current) / 1000);
      stepStartTime.current = Date.now();
      trackCheckoutStep(2, { destination: 'international', country: formData.country, step1TimeSeconds: intlStepTime });
      return;
    }
    
    setProcessingPayment(true);
    setLoadingMsg('Calculating Shipping & Serviceability...');
    setIsFetchingShipping(true);

    try {
      const liveProducts = getProducts();
      const chargeableCart = cart.filter(item => {
        const liveProduct = liveProducts.find(p => p.id === item.id);
        return (liveProduct ? liveProduct.shippingType : item.shippingType) !== 'Free';
      });
      const weight = chargeableCart.reduce((total, item) => total + (item.quantity * (item.weight || 500)), 0) || 500;
      const pt = paymentMode === 'cod' ? 'cod' : 'prepaid';

      const fetchPromises = [fetch(`/api/delhivery-pincode?zip=${formData.zip}`)];
      if (chargeableCart.length > 0) {
        fetchPromises.push(fetch(`/api/delhivery-shipping?zip=${formData.zip}&weight=${weight}&pt=${pt}`));
      }
      
      const responses = await Promise.all(fetchPromises);
      const data = await responses[0].json();
      
      if (responses.length > 1 && responses[1].ok) {
        const shippingData = await responses[1].json();
        const cost = (Array.isArray(shippingData) ? shippingData[0]?.total_amount : shippingData?.value?.[0]?.total_amount) || 0;
        setShippingCost(cost);
      } else if (chargeableCart.length === 0) {
        setShippingCost(0);
      }
      setIsFetchingShipping(false);
      
      const postalData = data.delivery_codes?.[0]?.postal_code;
      const isDelhiveryCod = postalData?.cod === "Y";
      
      const district = (postalData?.district || "").toLowerCase();
      const city = (postalData?.city || "").toLowerCase();
      
      const validLocalAreas = ['jalandhar', 'hoshiarpur', 'mukerian', 'nawanshahr', 'kapurthala', 'phagwara', 'dasuya', 'tanda', 'adampur', 'bhogpur'];
      const isLocalArea = validLocalAreas.some(area => district.includes(area) || city.includes(area));
      
      const isCodAvailable = isDelhiveryCod && isLocalArea;
      setIsLocalDelivery(isCodAvailable);
      if (!isCodAvailable) {
        setPaymentMode('online');
      }
    } catch (err) {
      console.error("Delhivery API Error:", err);
      setIsLocalDelivery(false);
      setPaymentMode('online');
    }

    setProcessingPayment(false);
    setCheckoutStep(2);
    const stepTime = Math.round((Date.now() - stepStartTime.current) / 1000);
    stepStartTime.current = Date.now();
    trackCheckoutStep(2, { pincode: formData.zip, city: formData.city, step1TimeSeconds: stepTime });
  };

  const buildOrderRecord = (paymentStr, paymentId) => {
    const subtotal = getSubtotal();
    const grandTotal = getGrandTotal();
    return {
      id: orderId,
      orderId: orderId,
      customer: formData.name,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      address: formData.address,
      destination: shipRegion === 'international' ? 'International' : 'India',
      country: shipRegion === 'international' ? formData.country : 'India',
      shippingNote: shipRegion === 'international' ? INTL_SHIPPING_NOTE : '',
      amount: `₹${grandTotal.toLocaleString()}`,
      amountNum: grandTotal,
      payment: paymentStr,
      paymentId: paymentId || '',
      status: 'Processing',
      shippingCost: shippingCost,
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
      promoCode: appliedPromoName,
      grandTotal: grandTotal
    };
  };

  const sendConfirmationEmail = async (orderRecord) => {
    try {
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #1A0008; max-width: 600px; margin: 0 auto; border: 1px solid #D4AF37; padding: 30px; border-radius: 8px;">
          <h2 style="color: #005461; margin-bottom: 5px;">Order Placed Successfully!</h2>
          <p style="font-size: 14px; color: #6B6B6B; margin-top: 0;">Order ID: <strong>${orderRecord.orderId}</strong></p>
          
          <p>Hi ${orderRecord.customer},</p>
          <p>Thank you for shopping with Gurnaaz. Your order has been confirmed and is being prepared for boutique packaging.</p>
          
          <div style="background: #FAF9F6; padding: 15px; margin: 20px 0; border: 1px solid #E8DDD0; border-radius: 4px;">
            <p style="margin: 0 0 10px 0;"><strong>Payment Mode:</strong> ${orderRecord.payment}</p>
            <p style="margin: 0;"><strong>Grand Total:</strong> ₹${orderRecord.grandTotal.toLocaleString()}</p>
          </div>

          <h3 style="border-bottom: 1px solid #D4AF37; padding-bottom: 5px; color: #1A0008;">Delivery Address</h3>
          <p style="color: #444; line-height: 1.5;">
            ${orderRecord.customer} - ${orderRecord.phone}<br/>
            ${orderRecord.address}<br/>
            ${orderRecord.city}, ${orderRecord.state}, ${orderRecord.country} - ${orderRecord.zip}
          </p>
          ${orderRecord.destination === 'International' ? `
            <div style="background: #FAF9F6; padding: 15px; margin: 15px 0; border: 1px solid #E8DDD0; border-radius: 4px;">
              <p style="margin: 0; font-size: 13px; color: #1A0008;"><strong>International Order:</strong> ${INTL_SHIPPING_NOTE}</p>
            </div>
          ` : ''}

          <h3 style="border-bottom: 1px solid #D4AF37; padding-bottom: 5px; color: #1A0008; margin-top: 25px;">Order Summary</h3>
          <ul style="list-style-type: none; padding: 0;">
            ${orderRecord.items.map(item => `
              <li style="padding: 10px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;">
                <div>
                  <strong>${item.name}</strong><br/>
                  <span style="font-size: 12px; color: #666;">Size: ${item.size} | Qty: ${item.quantity}</span>
                </div>
                <strong>${item.price}</strong>
              </li>
            `).join('')}
          </ul>
          
          <p style="margin-top: 30px; font-size: 12px; color: #888; text-align: center;">
            Need help? Reply to this email or contact us on WhatsApp.<br/>
            <strong>Gurnaaz Premium Ethnic Wear</strong>
          </p>
        </div>
      `;

      await fetch('/api/brevo/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toEmail: orderRecord.email,
          subject: `Order Confirmation - ${orderRecord.orderId} from Gurnaaz`,
          htmlContent
        })
      });
    } catch (err) {
      console.error('Failed to send confirmation email', err);
    }
  };

  const finalizeOrder = (paymentStr, paymentId) => {
    const orderRecord = buildOrderRecord(paymentStr, paymentId);
    addOrder(orderRecord);
    setFinalOrderCart([...cart]);
    setFinalPaymentMode(paymentStr);
    setFinalDiscount(appliedDiscount);
    
    // Send confirmation email asynchronously
    sendConfirmationEmail(orderRecord);
    
    const stepTime = Math.round((Date.now() - stepStartTime.current) / 1000);
    setProcessingPayment(false);
    setCheckoutStep(3);
    trackCheckoutStep(3, { orderId, paymentMode: paymentStr, step2TimeSeconds: stepTime, totalCheckoutTimeSeconds: Math.round((Date.now() - stepStartTime.current) / 1000) });
    clearCart();
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    
    const grandTotal = getGrandTotal();

    // COD - no Razorpay needed
    if (paymentMode === 'cod') {
      const paymentStr = 'Cash on Delivery (COD)';
      setFinalOrderCart([...cart]);
      setFinalPaymentMode(paymentStr);
      setProcessingPayment(true);
      setLoadingMsg('Placing your COD order...');
      trackPaymentAttempt('cod', grandTotal);

      setTimeout(() => {
        finalizeOrder(paymentStr, '');
      }, 1500);
      return;
    }

    // Online Payment - Razorpay
    const paymentStr = 'Online Payment (Razorpay)';
    setProcessingPayment(true);
    setLoadingMsg('Redirecting to Razorpay...');
    trackPaymentAttempt('razorpay', grandTotal);

    initiateRazorpayPayment({
      amount: grandTotal,
      orderId: orderId,
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      onSuccess: (paymentResponse) => {
        setLoadingMsg('Payment verified. Creating order...');
        trackPaymentSuccess('razorpay', grandTotal, orderId);
        setTimeout(() => {
          finalizeOrder(paymentStr, paymentResponse.razorpayPaymentId);
        }, 800);
      },
      onFailure: (errorMsg) => {
        setProcessingPayment(false);
        trackPaymentFail('razorpay', grandTotal, errorMsg);
        trackPaymentAbandon('razorpay', grandTotal, 'razorpay_modal_closed', { errorMsg });
        alert(`Payment failed: ${errorMsg}`);
      }
    });
  };

  // Step 3: Success page
  if (checkoutStep === 3) {
    const totalAmount = finalOrderCart.reduce((total, item) => {
      const priceNum = parseInt(item.price.replace(/[^\d]/g, ''), 10);
      return total + priceNum * item.quantity;
    }, 0) - finalDiscount + shippingCost;

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-[800px] mx-auto px-6 pt-32 pb-24 text-center min-h-[80vh] text-[#1A0008]"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="flex flex-col items-center gap-6 border border-[#D4AF37]/20 bg-white p-8 md:p-12 shadow-2xl rounded text-left">
          
          <div className="w-full flex flex-col items-center text-center gap-3">
            <CheckCircle2 size={56} className="text-[#005461]" />
            <h2 className="text-3xl md:text-4xl font-light text-[#1A0008] tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Order Placed Successfully!
            </h2>
            <p className="text-xs text-[#6B6B6B] uppercase tracking-widest font-bold">Thank you for shopping with Gurnaaz</p>
            <div className="w-16 h-px bg-[#D4AF37]/30 my-2" />
          </div>

          <p className="text-xs text-[#6B6B6B] leading-relaxed text-center w-full max-w-[550px] mx-auto">
            Your transaction has been securely authorized. We have sent a purchase invoice confirmation to <strong>{formData.email || 'your email'}</strong>. Your order is prepared for immediate boutique packaging. You will receive your Tracking ID via Email and SMS once your order is dispatched.
          </p>

          {/* Invoice Summary Card */}
          <div className="w-full border border-[#D4AF37]/15 bg-[#FAF9F6] rounded p-6 md:p-8 space-y-6">
            <div className="flex flex-wrap justify-between items-center border-b border-[#D4AF37]/10 pb-4 gap-4 text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">
              <div>
                <span>Order ID: </span>
                <span className="text-[#1A0008] font-mono">{orderId}</span>
              </div>
              <div>
                <span>Mode: </span>
                <span className="text-[#005461]">{finalPaymentMode}</span>
              </div>
            </div>

            {/* List items */}
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block">Items Invoice</span>
              <div className="divide-y divide-[#D4AF37]/10">
                {finalOrderCart.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="py-3 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-13 overflow-hidden bg-white border border-[#D4AF37]/10">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1A0008] line-clamp-1">{item.name}</p>
                        <p className="text-[9px] text-[#6B6B6B] mt-0.5">Size: {item.size} · Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-[#1A0008]">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price breakdown */}
            <div className="border-t border-[#D4AF37]/10 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-[#6B6B6B]">
                <span>Items Subtotal</span>
                <span>₹{(totalAmount + finalDiscount - shippingCost).toLocaleString()}</span>
              </div>
              {finalDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Promo Code Discount ({appliedPromoName})</span>
                  <span>-₹{finalDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-[#6B6B6B]">
                <span>Shipping & Delivery</span>
                <span className="text-[#1A0008] font-bold">{shipRegion === 'international' ? 'TO BE CONFIRMED' : (shippingCost > 0 ? `₹${shippingCost}` : 'FREE')}</span>
              </div>
              {shipRegion === 'international' && (
                <div className="bg-[#E8DDD0]/25 border border-[#D4AF37]/25 p-3 rounded">
                  <p className="text-[10px] text-[#1A0008]/80 leading-relaxed font-medium">
                    <strong className="uppercase tracking-wider">International Order — </strong>
                    {INTL_SHIPPING_NOTE}
                  </p>
                </div>
              )}
              <div className="border-t border-[#D4AF37]/20 pt-3 flex justify-between text-sm font-bold text-[#1A0008]">
                <span>Grand Total Paid</span>
                <span className="text-[#005461]">₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Delivery address details */}
            <div className="border-t border-[#D4AF37]/10 pt-4 text-xs space-y-1.5">
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">Shipping Destination</span>
              <p className="font-semibold text-[#1A0008]">{formData.name} · {formData.phone}</p>
              <p className="text-[#6B6B6B] leading-relaxed">{formData.address}, {formData.city}, {formData.state}{shipRegion === 'international' ? `, ${formData.country}` : ''} - {formData.zip}</p>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="w-full mt-4 flex justify-center">
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full sm:w-auto px-12 border border-[#D4AF37]/35 hover:border-[#1A0008] text-[#1A0008] hover:bg-[#1A0008] hover:text-white py-4 rounded text-xs font-bold tracking-widest uppercase transition-all"
            >
              Back to Storefront
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#1A0008] pt-32 pb-24" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      
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
            <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-[#D4AF37] animate-spin" />
            <div className="space-y-2 text-center px-6">
              <h3 className="text-xl font-light text-white tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Secure Payment Authorization
              </h3>
              <p className="text-xs text-[#D4AF37] font-semibold uppercase tracking-widest animate-pulse">
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
          className="inline-flex items-center gap-2 text-xs tracking-widest text-[#D4AF37] hover:text-[#1A0008] uppercase font-bold transition-colors cursor-pointer mb-8"
        >
          <ArrowLeft size={13} />
          <span>{checkoutStep === 2 ? 'Return to Shipping Address' : 'Return to Cart Bag'}</span>
        </button>

        {/* Header and Step Indicators */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-[#D4AF37]/15 pb-6">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-[#1A0008]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Checkout Flow
          </h1>

          {/* Stepper bar */}
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
            <span className={`pb-1 border-b-2 transition-all ${checkoutStep >= 1 ? 'border-[#005461] text-[#005461]' : 'border-transparent text-[#6B6B6B]'}`}>1. Shipping</span>
            <span className="text-[#D4AF37]">→</span>
            <span className={`pb-1 border-b-2 transition-all ${checkoutStep >= 2 ? 'border-[#005461] text-[#005461]' : 'border-transparent text-[#6B6B6B]'}`}>2. Payment</span>
            <span className="text-[#D4AF37]">→</span>
            <span className={`pb-1 border-b-2 transition-all ${checkoutStep === 3 ? 'border-[#005461] text-[#005461]' : 'border-transparent text-[#6B6B6B]'}`}>3. Placed</span>
          </div>
        </div>

        {cart.length === 0 && checkoutStep < 3 ? (
          <div className="py-20 text-center border border-[#D4AF37]/15 bg-white p-10 rounded">
            <ShoppingBag size={32} className="mx-auto text-[#D4AF37] mb-4" />
            <h3 className="text-xl font-light mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Your bag is empty</h3>
            <button onClick={() => window.location.href = '/'} className="mt-4 bg-[#D4AF37] text-white px-8 py-3 text-xs font-bold tracking-widest uppercase hover:bg-[#9A8268] transition-colors">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 xl:gap-16 items-start">
            
            {/* LEFT / MIDDLE columns: Shipping Address / Payment Gateways */}
            <div className="lg:col-span-2">
              
              {/* STEP 1: Address form */}
              {checkoutStep === 1 && (
                <div className="bg-white border border-[#D4AF37]/15 p-8 rounded shadow-sm">
                  <h3 className="text-2xl font-light border-b border-[#D4AF37]/10 pb-4 mb-6 text-[#1A0008]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Shipping Destination
                  </h3>
                  
                  <form onSubmit={handleAddressSubmit} className="space-y-5">
                    {/* Step 1 first: where should we ship? */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-[9px] uppercase tracking-widest text-[#6B6B6B] font-bold block">Where should we deliver? *</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => selectRegion('india')}
                          className={`py-3.5 px-3 border flex flex-col items-start gap-1 text-left transition-all rounded ${
                            shipRegion === 'india'
                              ? 'bg-[#E8DDD0]/30 border-[#D4AF37] text-[#005461]'
                              : 'border-[#D4AF37]/25 hover:border-[#1A0008] text-[#6B6B6B] cursor-pointer'
                          }`}
                        >
                          <span className="text-[11px] font-bold tracking-wider uppercase">India (Domestic)</span>
                          <span className="text-[9px] normal-case tracking-normal font-normal">Delhivery · 2-5 days · shipping calculated at checkout</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => selectRegion('international')}
                          className={`py-3.5 px-3 border flex flex-col items-start gap-1 text-left transition-all rounded ${
                            shipRegion === 'international'
                              ? 'bg-[#E8DDD0]/30 border-[#D4AF37] text-[#005461]'
                              : 'border-[#D4AF37]/25 hover:border-[#1A0008] text-[#6B6B6B] cursor-pointer'
                          }`}
                        >
                          <span className="text-[11px] font-bold tracking-wider uppercase">International</span>
                          <span className="text-[9px] normal-case tracking-normal font-normal">Our team will confirm shipping charges after your order</span>
                        </button>
                      </div>
                      {shipRegion === 'international' && (
                        <p className="text-[9px] text-[#6B6B6B] leading-relaxed pt-1">{INTL_SHIPPING_NOTE}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] uppercase tracking-widest text-[#6B6B6B] font-bold block">Full Name *</label>
                        <input 
                          type="text" 
                          name="name" 
                          required 
                          value={formData.name} 
                          onChange={handleInputChange}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                          placeholder="e.g. Gurpreet Singh"
                          className="w-full bg-[#FAF9F6] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none p-3.5 text-xs transition-colors rounded font-semibold"
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
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full bg-[#FAF9F6] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none p-3.5 text-xs transition-colors rounded font-semibold"
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
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        placeholder="e.g. gurpreet@example.com"
                        className="w-full bg-[#FAF9F6] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none p-3.5 text-xs transition-colors rounded font-semibold"
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
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        placeholder="Flat, Villa number, street name"
                        className="w-full bg-[#FAF9F6] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none p-3.5 text-xs transition-colors rounded font-semibold"
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
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                          placeholder="e.g. Amritsar"
                          className="w-full bg-[#FAF9F6] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none p-3.5 text-xs transition-colors rounded font-semibold"
                        />
                      </div>
                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] uppercase tracking-widest text-[#6B6B6B] font-bold block">{shipRegion === 'international' ? 'State / Region *' : 'State *'}</label>
                        {shipRegion === 'india' ? (
                          <select
                            name="state"
                            required
                            value={formData.state}
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            className="w-full bg-[#FAF9F6] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none p-3.5 text-xs transition-colors rounded font-semibold cursor-pointer"
                          >
                            <option value="" disabled>Select state</option>
                            {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        ) : (
                          <input 
                            type="text" 
                            name="state" 
                            required 
                            value={formData.state} 
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            placeholder="e.g. California"
                            className="w-full bg-[#FAF9F6] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none p-3.5 text-xs transition-colors rounded font-semibold"
                          />
                        )}
                      </div>
                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] uppercase tracking-widest text-[#6B6B6B] font-bold block">{shipRegion === 'international' ? 'ZIP / Postal Code *' : 'PIN Code *'}</label>
                        <input 
                          type="text" 
                          name="zip" 
                          required 
                          inputMode={shipRegion === 'india' ? 'numeric' : undefined}
                          maxLength={shipRegion === 'india' ? 6 : undefined}
                          value={formData.zip} 
                          onChange={handleInputChange}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                          placeholder={shipRegion === 'india' ? 'e.g. 143001' : 'e.g. 90210'}
                          className="w-full bg-[#FAF9F6] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none p-3.5 text-xs transition-colors rounded font-semibold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[9px] uppercase tracking-widest text-[#6B6B6B] font-bold block">Country *</label>
                      <input 
                        type="text" 
                        name="country" 
                        required
                        readOnly={shipRegion === 'india'}
                        value={shipRegion === 'india' ? 'India' : formData.country} 
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        placeholder={shipRegion === 'india' ? '' : 'e.g. United States'}
                        className={`w-full border border-[#D4AF37]/20 outline-none p-3.5 text-xs transition-colors rounded font-semibold ${
                          shipRegion === 'india' ? 'bg-gray-100 text-[#6B6B6B] cursor-not-allowed' : 'bg-[#FAF9F6] focus:border-[#D4AF37]'
                        }`}
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#1A0008] hover:bg-[#D4AF37] hover:text-[#FAF9F6] text-[#FAF9F6] py-4 text-xs font-bold tracking-widest transition-colors cursor-pointer uppercase rounded mt-4"
                    >
                      {shipRegion === 'international' ? 'CONTINUE TO CONFIRM ORDER' : 'PROCEED TO PAYMENT STEP'}
                    </button>
                  </form>
                </div>
              )}

              {/* STEP 2: Secure Payment Gateways */}
              {checkoutStep === 2 && (
                <div className="bg-white border border-[#D4AF37]/15 p-8 rounded shadow-sm space-y-8">
                        <div>
                          <h3 className="text-2xl font-light border-b border-[#D4AF37]/10 pb-4 text-[#1A0008]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      Secure Checkout Gateway
                    </h3>
                    <p className="text-xs text-[#6B6B6B] mt-1">Pay securely via Razorpay. Card, UPI, Netbanking & more.</p>
                  </div>

                  {shipRegion === 'international' && (
                    <div className="bg-[#E8DDD0]/25 border border-[#D4AF37]/30 p-4 rounded flex items-start gap-2.5">
                      <MessageSquare size={16} className="text-[#005461] mt-0.5 flex-shrink-0" />
                      <p className="text-[11px] text-[#1A0008]/80 leading-relaxed font-medium">
                        <strong className="uppercase tracking-wider text-[10px]">International Order — </strong>
                        {INTL_SHIPPING_NOTE} We do not ship via Delhivery for international orders.
                      </p>
                    </div>
                  )}

                  {/* Payment mode selectors */}
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      type="button"
                      onClick={() => setPaymentMode('online')}
                      className={`py-4 border flex flex-col items-center gap-1.5 text-[10px] tracking-wider uppercase font-bold transition-all rounded cursor-pointer ${
                        paymentMode === 'online' 
                          ? 'bg-[#E8DDD0]/30 border-[#D4AF37] text-[#005461]' 
                          : 'border-[#D4AF37]/25 hover:border-[#1A0008] text-[#6B6B6B]'
                      }`}
                    >
                      <CreditCard size={16} />
                      <span>Pay Online</span>
                      <span className="text-[8px] normal-case tracking-normal font-normal text-[#999]">Card / UPI / Netbanking</span>
                    </button>

                    <div className="relative">
                      <button 
                        type="button"
                        onClick={() => { if (isLocalDelivery) setPaymentMode('cod'); }}
                        disabled={!isLocalDelivery}
                        className={`w-full h-full py-4 border flex flex-col items-center gap-1.5 text-[10px] tracking-wider uppercase font-bold transition-all rounded ${
                          !isLocalDelivery ? 'opacity-40 cursor-not-allowed bg-gray-50' : 'cursor-pointer'
                        } ${
                          paymentMode === 'cod' 
                            ? 'bg-[#E8DDD0]/30 border-[#D4AF37] text-[#005461]' 
                            : 'border-[#D4AF37]/25 hover:border-[#1A0008] text-[#6B6B6B]'
                        }`}
                      >
                        <Truck size={16} />
                        <span>COD (Cash)</span>
                        <span className="text-[8px] normal-case tracking-normal font-normal text-[#999]">Pay on delivery</span>
                      </button>
                      {!isLocalDelivery && (
                         <div className="absolute top-2 right-2 text-red-500 opacity-60" title="Not available in your area">
                           <AlertCircle size={14}/>
                         </div>
                      )}
                    </div>
                  </div>
                  
                  {!isLocalDelivery && (
                    <div className="bg-red-50/50 border border-red-100 p-3 rounded flex items-start gap-2.5">
                      <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-[10px] text-red-700/80 font-bold tracking-wide uppercase leading-relaxed">
                        {shipRegion === 'international'
                          ? 'Cash on Delivery is not available for international orders. Shipping charges will be confirmed by our team after you confirm your order.'
                          : 'Cash on Delivery is currently only available for local deliveries within Jalandhar, Hoshiarpur, and Mukerian regions.'}
                      </p>
                    </div>
                  )}

                  <form onSubmit={handlePaymentSubmit} className="space-y-6 pt-4 border-t border-[#D4AF37]/10">
                    
                    {/* ONLINE PAYMENT — Razorpay */}
                    {paymentMode === 'online' && (
                      <div className="space-y-4 animate-fadeIn text-center">
                        <div className="bg-[#FAF9F6] border border-[#D4AF37]/15 p-5 rounded space-y-3">
                          <div className="flex items-center justify-center gap-2 text-[#1A0008]">
                            <Shield size={16} className="text-[#005461]" />
                            <span className="text-xs font-bold uppercase tracking-wider">Razorpay Secure</span>
                          </div>
                          <p className="text-[11px] text-[#6B6B6B] leading-relaxed">
                            You will be redirected to Razorpay's secure payment page.<br/>
                            Supports: Credit/Debit Card, UPI, Netbanking, Wallets, EMI.
                          </p>
                          <div className="flex items-center justify-center gap-4 pt-2">
                            <span className="text-[10px] text-[#999] tracking-wider uppercase">Powered by Razorpay</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* COD OPTION */}
                    {paymentMode === 'cod' && (
                      <div className="space-y-4 animate-fadeIn text-left bg-[#E8DDD0]/15 border border-[#D4AF37]/25 p-5 rounded">
                        <div className="flex gap-3 items-start">
                          <AlertCircle size={18} className="text-[#005461] mt-0.5 flex-shrink-0" />
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-[#1A0008] uppercase tracking-wider">Cash on Delivery Terms:</h4>
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
                      {paymentMode === 'cod' ? 'PLACE CASH ON DELIVERY ORDER' : `PAY ₹${getGrandTotal().toLocaleString()} VIA RAZORPAY`}
                    </button>
                  </form>
                </div>
              )}

            </div>

            {/* RIGHT column: Order Summary & Promo Code */}
            <div className="space-y-6">
              
              {/* Promo Code box */}
              {checkoutStep < 3 && (
                <div className="bg-white border border-[#D4AF37]/15 p-6 rounded shadow-sm space-y-3 text-left">
                  <span className="text-[10px] uppercase tracking-widest text-[#6B6B6B] font-bold block">Apply Discount Code</span>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      placeholder="e.g. SUITE15"
                      className="flex-1 bg-[#FAF9F6] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none p-3 text-xs uppercase font-semibold font-mono rounded"
                    />
                    <button 
                      onClick={applyPromoCode}
                      className="bg-[#1A0008] hover:bg-[#D4AF37] text-white px-5 py-3 text-[10px] font-bold tracking-widest uppercase transition-colors"
                    >
                      APPLY
                    </button>
                  </div>
                  <p className="text-[9px] text-[#6B6B6B] leading-relaxed">Enter your valid promo code below to claim your discount.</p>
                </div>
              )}

              {/* Order Summary box */}
              <div className="border border-[#D4AF37]/15 bg-white p-6 md:p-8 space-y-6 shadow-sm rounded text-left">
                <h3 className="text-xl font-light border-b border-[#D4AF37]/10 pb-4 text-[#1A0008]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Items Summary
                </h3>

                <div className="divide-y divide-[#D4AF37]/10 max-h-[320px] overflow-y-auto pr-2">
                  {cart.map((item) => {
                    const sizeOptions = getSizeOptions(item);
                    return (
                      <div key={`${item.id}-${item.size}`} className="py-4 flex gap-3 first:pt-0 last:pb-0 text-left relative">
                        <div className="w-12 h-16 bg-[#E8DDD0] overflow-hidden flex-shrink-0 border border-[#D4AF37]/5">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                        </div>
                        <div className="flex-1 min-w-0 pr-6">
                          <h4 className="text-xs font-semibold text-[#1A0008] truncate">{item.name}</h4>
                          <span className="text-xs font-semibold text-[#D4AF37] block mt-0.5">{item.price}</span>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            {sizeOptions.length > 1 ? (
                              <select
                                value={item.size}
                                onChange={(e) => changeCartItemSize(item.id, item.size, e.target.value)}
                                aria-label={`Size for ${item.name}`}
                                className="bg-[#FAF9F6] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-2 py-1 text-[10px] font-semibold rounded cursor-pointer"
                              >
                                {sizeOptions.map(s => <option key={s} value={s}>Size: {s}</option>)}
                              </select>
                            ) : (
                              <span className="text-[9px] text-[#6B6B6B]">Size: <span className="text-[#1A0008] font-semibold">{item.size}</span></span>
                            )}
                            <div className="flex items-center border border-[#D4AF37]/20 bg-[#FAF9F6]">
                              <button
                                type="button"
                                onClick={() => updateCartQty(item.id, item.size, item.quantity - 1)}
                                className="px-2 py-1 text-[#6B6B6B] hover:text-[#D4AF37] cursor-pointer"
                                title="Decrease quantity"
                              >
                                <Minus size={11} />
                              </button>
                              <span className="text-[11px] font-semibold px-1.5 text-[#1A0008]">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateCartQty(item.id, item.size, item.quantity + 1)}
                                className="px-2 py-1 text-[#6B6B6B] hover:text-[#D4AF37] cursor-pointer"
                                title="Increase quantity"
                              >
                                <Plus size={11} />
                              </button>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="absolute top-3 right-0 text-[#6B6B6B] hover:text-red-500 transition-colors p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-[#D4AF37]/15 pt-4 space-y-2 text-xs uppercase tracking-wider font-semibold text-[#6B6B6B]">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="text-[#1A0008]">₹{getSubtotal().toLocaleString()}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Promo Discount</span>
                      <span>-₹{appliedDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  {shipRegion === 'international' ? (
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Shipping Charges</span>
                        <span className="text-[#1A0008] font-bold">TO BE CONFIRMED</span>
                      </div>
                      <p className="text-[9px] normal-case tracking-normal font-medium text-[#6B6B6B] leading-relaxed">
                        {INTL_SHIPPING_NOTE}
                      </p>
                    </div>
                  ) : (
                  <div className="flex justify-between">
                    <span>Shipping Charges</span>
                    <span className="text-[#1A0008] font-bold">
                      {cart.length > 0 && cart.every(item => {
                          const liveProduct = getProducts().find(p => p.id === item.id);
                          return (liveProduct ? liveProduct.shippingType : item.shippingType) === 'Free';
                        })
                        ? 'FREE'
                        : checkoutStep === 1 
                          ? 'PENDING...' 
                          : (isFetchingShipping ? 'CALCULATING...' : (shippingCost === 0 ? 'FREE' : `₹${shippingCost.toLocaleString()}`))
                      }
                    </span>
                  </div>
                  )}
                  <div className="border-t border-[#D4AF37]/10 mt-2 pt-2 flex justify-between text-sm text-[#1A0008] font-bold">
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
