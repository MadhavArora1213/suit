export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TJdJXmia1aBwgA';

export const initiateRazorpayPayment = async ({ amount, orderId, customerName, customerEmail, customerPhone, onSuccess, onFailure }) => {
  try {
    // Step 1: Create order via backend
    const res = await fetch('/api/razorpay-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, orderId, customerName, customerEmail, customerPhone }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create order');
    }

    const orderData = await res.json();

    // Step 2: Open Razorpay checkout popup
    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Gurnaaz',
      description: `Order #${orderId}`,
      order_id: orderData.orderId,
      handler: async function (response) {
        try {
          // Step 3: Verify payment via backend
          const verifyRes = await fetch('/api/razorpay-verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.verified) {
            onSuccess({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });
          } else {
            onFailure('Payment verification failed');
          }
        } catch (err) {
          onFailure(err.message);
        }
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
  } catch (err) {
    onFailure(err.message);
  }
};
