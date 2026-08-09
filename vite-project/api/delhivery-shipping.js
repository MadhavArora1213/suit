export default async function handler(req, res) {
  const { zip, weight, pt } = req.query;

  if (!zip) {
    return res.status(400).json({ error: 'Zip code is required' });
  }

  const token = process.env.DELHIVERY_API_KEY;

  if (!token) {
    return res.status(500).json({ error: 'Delhivery API key is not configured on the server.' });
  }

  const originPin = '144001'; // Default Jalandhar
  const packageWeight = weight || 500;
  const paymentType = pt === 'cod' ? 'COD' : 'Pre-paid';

  try {
    const response = await fetch(`https://track.delhivery.com/api/kinko/v1/invoice/charges/.json?md=S&ss=Delivered&d_pin=${zip}&o_pin=${originPin}&cgm=${packageWeight}&pt=${paymentType}`, {
      headers: {
        'Authorization': `Token ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Delhivery API responded with status ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Delhivery Serverless Error:", error);
    return res.status(500).json({ error: 'Failed to fetch shipping cost' });
  }
}
