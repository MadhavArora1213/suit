import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAHXIfyKhoEEymlN31CWqtmqQq7_wxMdPs",
  authDomain: "gurnaaz-928e2.firebaseapp.com",
  projectId: "gurnaaz-928e2",
  storageBucket: "gurnaaz-928e2.firebasestorage.app",
  messagingSenderId: "689724469396",
  appId: "1:689724469396:web:3a8320415a879801210481",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const testProduct = {
  id: 'test_razorpay_001',
  name: 'Razorpay Test Suit',
  price: '₹1',
  priceNum: 1,
  originalPrice: '₹1',
  originalPriceNum: 1,
  boutique: 'Gurnaaz',
  badge: 'Test',
  collection: 'Test',
  styleCategory: 'Casual',
  suitType: 'Anarkali',
  type: 'Anarkali',
  shortDesc: 'Test product for Razorpay payment integration.',
  fabricDetails: 'Test cotton fabric for payment testing.',
  fabricName: 'Cotton',
  fabricDesc: 'Test cotton',
  rating: 4.0,
  igLikes: '0',
  igComments: '0',
  videoUrl: '',
  reelUrl: '',
  sizes: ['M (38)'],
  occasions: ['Casual'],
  care: ['Machine Wash'],
  stockQty: { 'M (38)': 999 },
  image: '/Images/Confused.png',
  additionalImages: [],
  addedAt: new Date().toISOString(),
  source: 'admin',
  totalOrders: 0,
  totalRevenue: '₹0',
  stock: 999,
  category: 'Test',
  active: true,
};

async function addTestProduct() {
  try {
    await setDoc(doc(db, 'products', testProduct.id), testProduct);
    console.log('✅ Test product added to Firestore:', testProduct.id);
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error.message);
    process.exit(1);
  }
}

addTestProduct();
