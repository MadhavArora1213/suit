const Razorpay = {
  baseUrl: 'https://api.razorpay.com/v1',

  async createOrder({ amount, orderId, customerName, customerEmail, customerPhone }) {
    const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64');

    const res = await fetch(`${this.baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency: 'INR',
        receipt: `order_${orderId}`,
        notes: {
          customerName: customerName || '',
          customerEmail: customerEmail || '',
          customerPhone: customerPhone || '',
        },
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.description || 'Failed to create order');
    }

    return res.json();
  },

  async fetchPayment(paymentId) {
    const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64');

    const res = await fetch(`${this.baseUrl}/payments/${paymentId}`, {
      headers: { 'Authorization': `Basic ${auth}` },
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.description || 'Failed to fetch payment');
    }

    return res.json();
  },
};

export default Razorpay;
