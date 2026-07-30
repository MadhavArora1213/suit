// Razorpay Test Mode Configuration
// Replace with your actual Razorpay Test Key from https://dashboard.razorpay.com/app/keys
export const RAZORPAY_KEY_ID = 'rzp_test_YOUR_KEY_HERE';

export const createRazorpayOrder = async (amount, orderId) => {
  // In test mode, we create a client-side order
  // For production, this should be done on your backend server
  return {
    id: `order_${orderId}`,
    amount: amount * 100, // Razorpay expects amount in paise
    currency: 'INR',
  };
};

export const initiateRazorpayPayment = ({ amount, orderId, customerName, customerEmail, customerPhone, onSuccess, onFailure }) => {
  const options = {
    key: RAZORPAY_KEY_ID,
    amount: amount * 100, // Amount in paise
    currency: 'INR',
    name: 'Gurnaaz',
    description: `Order #${orderId}`,
    order_id: orderId,
    handler: function (response) {
      // Payment successful
      onSuccess({
        razorpayPaymentId: response.razorpay_payment_id,
        razorpayOrderId: response.razorpay_order_id,
        razorpaySignature: response.razorpay_signature,
      });
    },
    prefill: {
      name: customerName,
      email: customerEmail,
      contact: customerPhone,
    },
    theme: {
      color: '#111111',
    },
    modal: {
      ondismiss: function () {
        onFailure('Payment cancelled by user');
      },
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.on('payment.failed', function (response) {
    onFailure(response.error?.description || 'Payment failed');
  });
  rzp.open();
};
