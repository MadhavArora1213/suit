/**
 * adminStore.js — Shared localStorage bridge between Admin Panel and Main Website
 * Admin saves data here → Main website reads from here
 */

import {
  saveReviewToFirestore,
  fetchReviewsFromFirestore,
  saveProductRatingToFirestore,
  isFirebaseConfigured,
  saveOrderToFirestore,
  fetchOrdersFromFirestore,
  saveProductToFirestore,
  deleteProductFromFirestore,
  fetchProductsFromFirestore,
  fetchCollectionFromFirestore,
  saveDocumentToFirestore,
  db,
  auth
} from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const KEYS = {
  products:     'gurnaaz_products_v4',
  categories:   'gurnaaz_categories_v4',
  reviews:      'gurnaaz_reviews_v4',
  orders:       'gurnaaz_orders_v4',
  support:      'gurnaaz_support_v4',
  boutiques:    'gurnaaz_boutiques_v4',
  collections:  'gurnaaz_collections_v4',
  collectionTags: 'gurnaaz_collection_tags_v4'
};

// ── Static Products Definition ────────────────────────────────
export const staticProducts = [
  // ── RAKHI SPECIAL SUIT COMBOS ──
  {
    id: 'rakhi_suit_combo_001',
    name: 'Gulabi Silk Patiala Suit with Silver Rakhi Combo',
    price: '₹8,999',
    priceNum: 8999,
    originalPrice: '₹14,999',
    originalPriceNum: 14999,
    boutique: 'Gurnaaz Heritage',
    badge: 'Festive Bestseller',
    collection: 'Rakhi Special',
    styleCategory: 'Royal Punjabi',
    suitType: 'Patiala',
    type: 'Patiala',
    shortDesc: 'Stunning royal magenta silk suit paired with handcrafted pure silver bhaiya-bhabhi rakhi set.',
    fabricDetails: 'Pure Raw Silk kameez with golden gota patti work. Heavy Patiala salwar with zari embroidery.',
    fabricName: 'Pure Raw Silk',
    fabricDesc: 'Zari and Gota Patti Handwork',
    rating: 4.9,
    igLikes: '4.2K',
    igComments: '310',
    videoUrl: '',
    reelUrl: '',
    sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)'],
    occasions: ['Raksha Bandhan', 'Festive', 'Wedding'],
    care: ['Dry Clean Only'],
    stockQty: { 'S (36)': 12, 'M (38)': 20, 'L (40)': 15, 'XL (42)': 10, 'XXL (44)': 5 },
    image: '/rakhi_suit_hero_shoot.jpg',
    additionalImages: ['/model_maroon_suit_bgless.png', '/rakhi_campaign_hero.png'],
    addedAt: '2026-07-28T10:00:00.000Z',
    source: 'admin',
    totalOrders: 64,
    totalRevenue: '₹5.75L',
    stock: 62,
    category: 'Rakhi Special',
    active: true,
  },
  {
    id: 'suit_kashmiri_001',
    name: 'Kashmiri Tilla Work Velvet Heavy Suit Set',
    price: '₹9,499',
    priceNum: 9499,
    originalPrice: '₹13,999',
    originalPriceNum: 13999,
    boutique: 'Kashmir Silks',
    badge: 'Kashmiri Special',
    collection: 'Designer Suits',
    styleCategory: 'Kashmiri',
    suitType: 'Kashmiri',
    type: 'Patiala',
    shortDesc: 'Royal velvet kameez with intricate gold tilla Kashmiri embroidery on neckline and sleeves.',
    fabricDetails: 'Micro velvet shirt with silk lining and organza dupatta with tilla border.',
    fabricName: 'Micro Velvet',
    fabricDesc: 'Authentic Kashmiri Tilla Handwork',
    rating: 4.9,
    igLikes: '3.8K',
    igComments: '240',
    videoUrl: '',
    reelUrl: '',
    sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)'],
    occasions: ['Festive', 'Wedding', 'Raksha Bandhan'],
    care: ['Dry Clean Only'],
    stockQty: { 'S (36)': 8, 'M (38)': 14, 'L (40)': 10, 'XL (42)': 6 },
    image: '/custom_suit_1.png',
    additionalImages: [],
    addedAt: '2026-07-28T10:30:00.000Z',
    source: 'admin',
    totalOrders: 42,
    totalRevenue: '₹3.98L',
    stock: 38,
    category: 'Designer Suits',
    active: true,
  },
  {
    id: 'suit_patiala_001',
    name: 'Punjabi Patiala Suit with Heavy Phulkari Dupatta',
    price: '₹6,899',
    priceNum: 6899,
    originalPrice: '₹9,999',
    originalPriceNum: 9999,
    boutique: 'Amritsar Textiles',
    badge: 'Traditional Edit',
    collection: 'Designer Suits',
    styleCategory: 'Patiala',
    suitType: 'Patiala',
    type: 'Patiala',
    shortDesc: 'Vibrant yellow and red Punjabi suit set with authentic Amritsari hand-embroidered phulkari dupatta.',
    fabricDetails: 'Chanderi silk kameez with heavy flared Patiala salwar and pure chinon phulkari dupatta.',
    fabricName: 'Chanderi Silk & Chinon',
    fabricDesc: 'Handcrafted Amritsari Phulkari',
    rating: 4.8,
    igLikes: '2.7K',
    igComments: '180',
    videoUrl: '',
    reelUrl: '',
    sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)'],
    occasions: ['Festive', 'Raksha Bandhan', 'Sangeet'],
    care: ['Dry Clean Only'],
    stockQty: { 'S (36)': 10, 'M (38)': 15, 'L (40)': 20, 'XL (42)': 12 },
    image: '/patiala_suit.png',
    additionalImages: [],
    addedAt: '2026-07-28T10:45:00.000Z',
    source: 'admin',
    totalOrders: 58,
    totalRevenue: '₹3.99L',
    stock: 57,
    category: 'Designer Suits',
    active: true,
  },

  // ── RAKHI GIFT BOXES ──
  {
    id: 'rakhi_hamper_001',
    name: 'Royal Kesari Rakhi Gift Box & Audio Hamper',
    price: '₹1,999',
    priceNum: 1999,
    originalPrice: '₹3,499',
    originalPriceNum: 3499,
    boutique: 'Gurnaaz Kraft',
    badge: 'Gift Box',
    collection: 'Gift Boxes',
    styleCategory: 'Gift Box',
    suitType: 'Gift Box',
    type: 'Gift Box',
    shortDesc: 'Premium handcrafted Rakhi Gift hamper containing designer Silver Rakhi, sweets, dry fruits, and scan-to-play QR Audio Card.',
    fabricDetails: 'Velvet padded keepsake box, 925 Silver Rakhi, premium roasted almonds & cashews, custom audio message card.',
    fabricName: 'Keepsake Gift Box',
    fabricDesc: 'Silver Rakhi + Sweets + Audio Card',
    rating: 5.0,
    igLikes: '5.8K',
    igComments: '420',
    videoUrl: '',
    reelUrl: '',
    sizes: ['Standard Box'],
    occasions: ['Raksha Bandhan', 'Gifting'],
    care: ['Store in Cool Dry Place'],
    stockQty: { 'Standard Box': 100 },
    image: '/rakhi_gift_box_hamper.jpg',
    additionalImages: ['/rakhi_poster_banner.png'],
    addedAt: '2026-07-28T11:00:00.000Z',
    source: 'admin',
    totalOrders: 142,
    totalRevenue: '₹2.83L',
    stock: 100,
    category: 'Gift Boxes',
    active: true,
  },
  {
    id: 'rakhi_hamper_002',
    name: 'Imperial Silver Rakhi & Kaju Katli Wooden Box Hamper',
    price: '₹2,499',
    priceNum: 2499,
    originalPrice: '₹3,999',
    originalPriceNum: 3999,
    boutique: 'Gurnaaz Kraft',
    badge: 'Luxury Hamper',
    collection: 'Gift Boxes',
    styleCategory: 'Gift Box',
    suitType: 'Gift Box',
    type: 'Gift Box',
    shortDesc: 'Handcarved wooden keepsake trunk containing Pure 925 Silver Rakhi, Kaju Katli sweets, and saffron almonds.',
    fabricDetails: 'Teakwood box, sterling silver rakhi, certified organic dry fruits and sweets.',
    fabricName: 'Handcarved Wood Trunk',
    fabricDesc: '925 Silver + Kaju Katli + Dry Fruits',
    rating: 4.9,
    igLikes: '4.1K',
    igComments: '310',
    videoUrl: '',
    reelUrl: '',
    sizes: ['Deluxe Trunk'],
    occasions: ['Raksha Bandhan', 'Gifting'],
    care: ['Store in Cool Place'],
    stockQty: { 'Deluxe Trunk': 80 },
    image: '/rakhi_gift_box_hamper.jpg',
    additionalImages: [],
    addedAt: '2026-07-28T11:15:00.000Z',
    source: 'admin',
    totalOrders: 88,
    totalRevenue: '₹2.19L',
    stock: 80,
    category: 'Gift Boxes',
    active: true,
  },
  {
    id: 'rakhi_hamper_003',
    name: 'Royal Bhaiya Bhabhi Lumba & Dry Fruits Keepsake Trunk',
    price: '₹2,999',
    priceNum: 2999,
    originalPrice: '₹4,999',
    originalPriceNum: 4999,
    boutique: 'Gurnaaz Kraft',
    badge: 'Couples Edit',
    collection: 'Gift Boxes',
    styleCategory: 'Gift Box',
    suitType: 'Gift Box',
    type: 'Gift Box',
    shortDesc: 'Luxury brass embossed gift box with Kundan Bhaiya-Bhabhi Lumba set, assorted dry fruit jars, and audio voice card.',
    fabricDetails: 'Brass embossed box, Kundan Pearl Rakhis, 4 glass jars of pistachios, raisins, almonds, cashews.',
    fabricName: 'Embossed Brass Keepsake',
    fabricDesc: 'Bhaiya Bhabhi Rakhi + 4 Dry Fruit Jars',
    rating: 4.9,
    igLikes: '3.5K',
    igComments: '270',
    videoUrl: '',
    reelUrl: '',
    sizes: ['Grand Hamper'],
    occasions: ['Raksha Bandhan', 'Gifting'],
    care: ['Store in Cool Place'],
    stockQty: { 'Grand Hamper': 60 },
    image: '/rakhi_gift_box_hamper.jpg',
    additionalImages: [],
    addedAt: '2026-07-28T11:30:00.000Z',
    source: 'admin',
    totalOrders: 72,
    totalRevenue: '₹2.15L',
    stock: 60,
    category: 'Gift Boxes',
    active: true,
  },
  {
    id: 'rakhi_hamper_004',
    name: 'Signature Velvet Rakhi Hamper with Custom Audio QR Card',
    price: '₹1,799',
    priceNum: 1799,
    originalPrice: '₹2,999',
    originalPriceNum: 2999,
    boutique: 'Gurnaaz Kraft',
    badge: 'Audio QR Card',
    collection: 'Gift Boxes',
    styleCategory: 'Gift Box',
    suitType: 'Gift Box',
    type: 'Gift Box',
    shortDesc: 'Velvet gift box with designer thread Rakhi, handmade chocolates, Roli-Chawal thali, and custom QR voice message card.',
    fabricDetails: 'Red velvet padded box, thread & bead rakhi, gourmet artisan chocolates.',
    fabricName: 'Velvet Padded Box',
    fabricDesc: 'Rakhi + Chocolates + Roli Chawal + QR Card',
    rating: 4.8,
    igLikes: '4.9K',
    igComments: '380',
    videoUrl: '',
    reelUrl: '',
    sizes: ['Compact Box'],
    occasions: ['Raksha Bandhan', 'Gifting'],
    care: ['Store in Cool Place'],
    stockQty: { 'Compact Box': 120 },
    image: '/rakhi_gift_box_hamper.jpg',
    additionalImages: [],
    addedAt: '2026-07-28T11:45:00.000Z',
    source: 'admin',
    totalOrders: 110,
    totalRevenue: '₹1.97L',
    stock: 120,
    category: 'Gift Boxes',
    active: true,
  },

  // ── GIRLS KASHMIRI CHURI ──
  {
    id: 'kashmiri_churi_001',
    name: 'Royal Kashmiri Velvet & Zari Churi Set',
    price: '₹1,499',
    priceNum: 1499,
    originalPrice: '₹2,499',
    originalPriceNum: 2499,
    boutique: 'Kashmir Crafts',
    badge: 'Kashmiri Special',
    collection: 'Kashmiri Churi',
    styleCategory: 'Bangles',
    suitType: 'Churi',
    type: 'Kashmiri Churi',
    shortDesc: 'Exquisite velvet and glass churi set handcrafted with intricate Kashmiri gold thread work and sparkling beads.',
    fabricDetails: 'Handcrafted velvet base bangles reinforced with light metal structure, adorned with tilla zari border.',
    fabricName: 'Velvet & Zari',
    fabricDesc: 'Handcrafted Kashmiri Artisanal Churi',
    rating: 4.8,
    igLikes: '2.9K',
    igComments: '198',
    videoUrl: '',
    reelUrl: '',
    sizes: ['2.4 (Small)', '2.6 (Medium)', '2.8 (Large)'],
    occasions: ['Festive', 'Wedding', 'Raksha Bandhan'],
    care: ['Keep away from direct water'],
    stockQty: { '2.4 (Small)': 25, '2.6 (Medium)': 40, '2.8 (Large)': 20 },
    image: '/kashmiri_churi_bangles.jpg',
    additionalImages: [],
    addedAt: '2026-07-28T12:00:00.000Z',
    source: 'admin',
    totalOrders: 85,
    totalRevenue: '₹1.27L',
    stock: 85,
    category: 'Kashmiri Churi',
    active: true,
  },
  {
    id: 'kashmiri_churi_002',
    name: 'Handmade Tilla Embroidery Velvet Kashmiri Bangle Set',
    price: '₹1,899',
    priceNum: 1899,
    originalPrice: '₹2,999',
    originalPriceNum: 2999,
    boutique: 'Kashmir Crafts',
    badge: 'Handcrafted',
    collection: 'Kashmiri Churi',
    styleCategory: 'Bangles',
    suitType: 'Churi',
    type: 'Kashmiri Churi',
    shortDesc: 'Deep maroon velvet bangles intricately worked with pure golden Kashmiri tilla thread work.',
    fabricDetails: 'Pure velvet over durable brass bangles, real silver & gold tilla thread embroidery.',
    fabricName: 'Velvet & Tilla',
    fabricDesc: 'Pure Kashmiri Artisanal Embroidery',
    rating: 4.9,
    igLikes: '3.2K',
    igComments: '230',
    videoUrl: '',
    reelUrl: '',
    sizes: ['2.4 (Small)', '2.6 (Medium)', '2.8 (Large)'],
    occasions: ['Festive', 'Bridal', 'Raksha Bandhan'],
    care: ['Dry wipe only'],
    stockQty: { '2.4 (Small)': 15, '2.6 (Medium)': 30, '2.8 (Large)': 15 },
    image: '/kashmiri_churi_bangles.jpg',
    additionalImages: [],
    addedAt: '2026-07-28T12:15:00.000Z',
    source: 'admin',
    totalOrders: 64,
    totalRevenue: '₹1.21L',
    stock: 60,
    category: 'Kashmiri Churi',
    active: true,
  },
  {
    id: 'kashmiri_churi_003',
    name: 'Bridal Red Velvet Kashmiri Churi & Gold Mirror Set',
    price: '₹2,199',
    priceNum: 2199,
    originalPrice: '₹3,499',
    originalPriceNum: 3499,
    boutique: 'Kashmir Crafts',
    badge: 'Bridal Edition',
    collection: 'Kashmiri Churi',
    styleCategory: 'Bangles',
    suitType: 'Churi',
    type: 'Kashmiri Churi',
    shortDesc: 'Traditional bridal red velvet churi bangles studded with real glass mirrors and gold bead work.',
    fabricDetails: 'Rich red velvet base, glass mirrors, gold metal kangan separators.',
    fabricName: 'Velvet & Mirror Work',
    fabricDesc: 'Kashmiri Bridal Bangle Set',
    rating: 5.0,
    igLikes: '4.5K',
    igComments: '340',
    videoUrl: '',
    reelUrl: '',
    sizes: ['2.4 (Small)', '2.6 (Medium)', '2.8 (Large)'],
    occasions: ['Bridal', 'Festive', 'Raksha Bandhan'],
    care: ['Store in cloth bag'],
    stockQty: { '2.4 (Small)': 20, '2.6 (Medium)': 35, '2.8 (Large)': 20 },
    image: '/kashmiri_churi_bangles.jpg',
    additionalImages: [],
    addedAt: '2026-07-28T12:30:00.000Z',
    source: 'admin',
    totalOrders: 92,
    totalRevenue: '₹2.02L',
    stock: 75,
    category: 'Kashmiri Churi',
    active: true,
  },
  {
    id: 'kashmiri_churi_004',
    name: 'Emerald Green Kashmiri Silk Velvet Bangle Pack',
    price: '₹1,699',
    priceNum: 1699,
    originalPrice: '₹2,799',
    originalPriceNum: 2799,
    boutique: 'Kashmir Crafts',
    badge: 'Royal Green',
    collection: 'Kashmiri Churi',
    styleCategory: 'Bangles',
    suitType: 'Churi',
    type: 'Kashmiri Churi',
    shortDesc: 'Lush emerald green velvet bangles decorated with antique gold zari lines and stone highlights.',
    fabricDetails: 'Green silk velvet, gold zari threads, synthetic stones.',
    fabricName: 'Silk Velvet & Zari',
    fabricDesc: 'Royal Kashmiri Festive Churi',
    rating: 4.8,
    igLikes: '2.5K',
    igComments: '160',
    videoUrl: '',
    reelUrl: '',
    sizes: ['2.4 (Small)', '2.6 (Medium)', '2.8 (Large)'],
    occasions: ['Festive', 'Raksha Bandhan'],
    care: ['Dry wipe only'],
    stockQty: { '2.4 (Small)': 18, '2.6 (Medium)': 25, '2.8 (Large)': 14 },
    image: '/kashmiri_churi_bangles.jpg',
    additionalImages: [],
    addedAt: '2026-07-28T12:45:00.000Z',
    source: 'admin',
    totalOrders: 51,
    totalRevenue: '₹0.86L',
    stock: 57,
    category: 'Kashmiri Churi',
    active: true,
  },

  // ── GIRLS DESIGNER KADAS ──
  {
    id: 'designer_kada_001',
    name: 'Handcrafted Polki & Meenakari Gold Kadas',
    price: '₹2,299',
    priceNum: 2299,
    originalPrice: '₹3,999',
    originalPriceNum: 3999,
    boutique: 'Jaipur Jewels',
    badge: 'Designer Kada',
    collection: 'Designer Kadas',
    styleCategory: 'Kada',
    suitType: 'Kada',
    type: 'Designer Kadas',
    shortDesc: 'Pair of luxurious gold-plated designer kadda bangles with detailed ruby meenakari and polki crystal stones.',
    fabricDetails: 'Brass base with 24k gold plating, synthetic polki stones, anti-tarnish protective coating.',
    fabricName: '24k Gold Plated Brass',
    fabricDesc: 'Handcrafted Jaipur Polki Work',
    rating: 4.9,
    igLikes: '3.6K',
    igComments: '275',
    videoUrl: '',
    reelUrl: '',
    sizes: ['2.4 (Small)', '2.6 (Medium)', '2.8 (Large)'],
    occasions: ['Festive', 'Bridal', 'Raksha Bandhan'],
    care: ['Wipe with soft cloth after use'],
    stockQty: { '2.4 (Small)': 15, '2.6 (Medium)': 30, '2.8 (Large)': 15 },
    image: '/designer_kadda_bangles.jpg',
    additionalImages: [],
    addedAt: '2026-07-28T13:00:00.000Z',
    source: 'admin',
    totalOrders: 92,
    totalRevenue: '₹2.11L',
    stock: 60,
    category: 'Designer Kadas',
    active: true,
  },
  {
    id: 'designer_kada_002',
    name: 'Antique Openable Kundan Bridal Kada Pair',
    price: '₹2,799',
    priceNum: 2799,
    originalPrice: '₹4,499',
    originalPriceNum: 4499,
    boutique: 'Jaipur Jewels',
    badge: 'Openable Kada',
    collection: 'Designer Kadas',
    styleCategory: 'Kada',
    suitType: 'Kada',
    type: 'Designer Kadas',
    shortDesc: 'Heavy antique gold finish openable kadas set with sparkling Kundan stones and hanging pearl drops.',
    fabricDetails: 'Copper alloy base, 22k antique gold polish, real freshwater pearl droplets.',
    fabricName: 'Antique Gold Polish',
    fabricDesc: 'Jaipur Openable Screw Kundan Kada',
    rating: 5.0,
    igLikes: '4.8K',
    igComments: '390',
    videoUrl: '',
    reelUrl: '',
    sizes: ['Free Size (Openable Screw)'],
    occasions: ['Bridal', 'Festive', 'Raksha Bandhan'],
    care: ['Store in zip lock bag'],
    stockQty: { 'Free Size (Openable Screw)': 50 },
    image: '/designer_kadda_bangles.jpg',
    additionalImages: [],
    addedAt: '2026-07-28T13:15:00.000Z',
    source: 'admin',
    totalOrders: 78,
    totalRevenue: '₹2.18L',
    stock: 50,
    category: 'Designer Kadas',
    active: true,
  },
  {
    id: 'designer_kada_003',
    name: 'Royal Temple Gold Plated Designer Kada Set',
    price: '₹1,999',
    priceNum: 1999,
    originalPrice: '₹3,299',
    originalPriceNum: 3299,
    boutique: 'Jaipur Jewels',
    badge: 'Temple Work',
    collection: 'Designer Kadas',
    styleCategory: 'Kada',
    suitType: 'Kada',
    type: 'Designer Kadas',
    shortDesc: 'South Indian temple style embossed gold kadas featuring intricate peacock and lotus carvings.',
    fabricDetails: 'High-grade brass, matt gold electroplating, ruby red synthetic gemstones.',
    fabricName: 'Matt Gold Temple Polish',
    fabricDesc: 'South Indian Temple Carved Kadas',
    rating: 4.8,
    igLikes: '3.1K',
    igComments: '210',
    videoUrl: '',
    reelUrl: '',
    sizes: ['2.4 (Small)', '2.6 (Medium)', '2.8 (Large)'],
    occasions: ['Festive', 'Wedding', 'Raksha Bandhan'],
    care: ['Keep away from perfumes'],
    stockQty: { '2.4 (Small)': 20, '2.6 (Medium)': 35, '2.8 (Large)': 20 },
    image: '/designer_kadda_bangles.jpg',
    additionalImages: [],
    addedAt: '2026-07-28T13:30:00.000Z',
    source: 'admin',
    totalOrders: 65,
    totalRevenue: '₹1.30L',
    stock: 75,
    category: 'Designer Kadas',
    active: true,
  },
  {
    id: 'designer_kada_004',
    name: 'Ruby Red Meenakari Bridal Kada with Pearls',
    price: '₹2,499',
    priceNum: 2499,
    originalPrice: '₹3,999',
    originalPriceNum: 3999,
    boutique: 'Jaipur Jewels',
    badge: 'Ruby Meenakari',
    collection: 'Designer Kadas',
    styleCategory: 'Kada',
    suitType: 'Kada',
    type: 'Designer Kadas',
    shortDesc: 'Exquisite ruby red enamel meenakari bangles bordered with clusters of tiny white seed pearls.',
    fabricDetails: 'Brass with 24k gold lacquer finish, handcrafted enamel work, pearl strings.',
    fabricName: 'Enamel Meenakari & Pearl',
    fabricDesc: 'Royal Rajasthani Meenakari Craft',
    rating: 4.9,
    igLikes: '3.9K',
    igComments: '290',
    videoUrl: '',
    reelUrl: '',
    sizes: ['2.4 (Small)', '2.6 (Medium)', '2.8 (Large)'],
    occasions: ['Festive', 'Bridal', 'Raksha Bandhan'],
    care: ['Wipe clean with dry cloth'],
    stockQty: { '2.4 (Small)': 12, '2.6 (Medium)': 24, '2.8 (Large)': 14 },
    image: '/designer_kadda_bangles.jpg',
    additionalImages: [],
    addedAt: '2026-07-28T13:45:00.000Z',
    source: 'admin',
    totalOrders: 70,
    totalRevenue: '₹1.75L',
    stock: 50,
    category: 'Designer Kadas',
    active: true,
  },

  // ── BACHEYA KI RAKHI (KIDS RAKHI) ──
  {
    id: 'kids_rakhi_001',
    name: 'Cute Superhero & Cartoon Kids Rakhi Set (Pack of 3)',
    price: '₹499',
    priceNum: 499,
    originalPrice: '₹899',
    originalPriceNum: 899,
    boutique: 'Gurnaaz Kids',
    badge: 'Kids Special',
    collection: 'Kids Rakhi',
    styleCategory: 'Kids',
    suitType: 'Kids Rakhi',
    type: 'Kids Rakhi',
    shortDesc: 'Ultra-soft skin-friendly cartoon and superhero themed Rakhis for little brothers, complete with LED lights.',
    fabricDetails: 'Soft silicone character badge, non-allergic cotton thread band, easy clip lock.',
    fabricName: 'Soft Silicone & Cotton',
    fabricDesc: 'Non-allergic & LED light up effect',
    rating: 4.9,
    igLikes: '6.1K',
    igComments: '540',
    videoUrl: '',
    reelUrl: '',
    sizes: ['Free Size'],
    occasions: ['Raksha Bandhan'],
    care: ['Safe for kids above 3 years'],
    stockQty: { 'Free Size': 150 },
    image: '/kids_rakhi_collection.jpg',
    additionalImages: [],
    addedAt: '2026-07-28T14:00:00.000Z',
    source: 'admin',
    totalOrders: 210,
    totalRevenue: '₹1.04L',
    stock: 150,
    category: 'Kids Rakhi',
    active: true,
  },
  {
    id: 'kids_rakhi_002',
    name: 'Musical Chhota Bheem & Krishna LED Light Kids Rakhi',
    price: '₹399',
    priceNum: 399,
    originalPrice: '₹699',
    originalPriceNum: 699,
    boutique: 'Gurnaaz Kids',
    badge: 'LED & Sound',
    collection: 'Kids Rakhi',
    styleCategory: 'Kids',
    suitType: 'Kids Rakhi',
    type: 'Kids Rakhi',
    shortDesc: 'Fun musical Rakhi that plays playful tunes and flashes colorful LED lights when pressed.',
    fabricDetails: 'Soft plush character face, replaceable mini battery cell, velvet band.',
    fabricName: 'Plush & Electronic LED',
    fabricDesc: 'Plays music + Flashing lights',
    rating: 4.9,
    igLikes: '5.2K',
    igComments: '410',
    videoUrl: '',
    reelUrl: '',
    sizes: ['Free Size'],
    occasions: ['Raksha Bandhan'],
    care: ['Keep away from water immersion'],
    stockQty: { 'Free Size': 200 },
    image: '/kids_rakhi_collection.jpg',
    additionalImages: [],
    addedAt: '2026-07-28T14:15:00.000Z',
    source: 'admin',
    totalOrders: 180,
    totalRevenue: '₹0.71L',
    stock: 200,
    category: 'Kids Rakhi',
    active: true,
  },
  {
    id: 'kids_rakhi_003',
    name: 'Soft Plush Teddy & Doraemon Kids Rakhi Set with Chocolates',
    price: '₹599',
    priceNum: 599,
    originalPrice: '₹999',
    originalPriceNum: 999,
    boutique: 'Gurnaaz Kids',
    badge: 'Rakhi + Chocolates',
    collection: 'Kids Rakhi',
    styleCategory: 'Kids',
    suitType: 'Kids Rakhi',
    type: 'Kids Rakhi',
    shortDesc: 'Adorable plush toy Rakhi combo pack including 2 cartoon Rakhis and Cadbury Celebration chocolate box.',
    fabricDetails: 'Soft stuffed plush toys, silk braided bands, mini chocolate pack.',
    fabricName: 'Plush Toy & Silk Thread',
    fabricDesc: 'Soft plush toy + Cadbury Chocolates',
    rating: 5.0,
    igLikes: '7.4K',
    igComments: '620',
    videoUrl: '',
    reelUrl: '',
    sizes: ['Free Size'],
    occasions: ['Raksha Bandhan'],
    care: ['Non-toxic & washable'],
    stockQty: { 'Free Size': 180 },
    image: '/kids_rakhi_collection.jpg',
    additionalImages: [],
    addedAt: '2026-07-28T14:30:00.000Z',
    source: 'admin',
    totalOrders: 250,
    totalRevenue: '₹1.49L',
    stock: 180,
    category: 'Kids Rakhi',
    active: true,
  },
  {
    id: 'kids_rakhi_004',
    name: 'Superhero Glow-in-the-Dark Kids Rakhi & Toy Band Combo',
    price: '₹649',
    priceNum: 649,
    originalPrice: '₹1,099',
    originalPriceNum: 1099,
    boutique: 'Gurnaaz Kids',
    badge: 'Glow in Dark',
    collection: 'Kids Rakhi',
    styleCategory: 'Kids',
    suitType: 'Kids Rakhi',
    type: 'Kids Rakhi',
    shortDesc: 'Exciting glow-in-the-dark wristband style Rakhi featuring Avengers characters for kids.',
    fabricDetails: 'Luminous silicone band that glows in dark, slap-on magnetic closure.',
    fabricName: 'Luminous Silicone',
    fabricDesc: 'Glow in dark slap wristband',
    rating: 4.8,
    igLikes: '4.6K',
    igComments: '320',
    videoUrl: '',
    reelUrl: '',
    sizes: ['Slap Band Size'],
    occasions: ['Raksha Bandhan'],
    care: ['Durable & waterproof'],
    stockQty: { 'Slap Band Size': 140 },
    image: '/kids_rakhi_collection.jpg',
    additionalImages: [],
    addedAt: '2026-07-28T14:45:00.000Z',
    source: 'admin',
    totalOrders: 160,
    totalRevenue: '₹1.03L',
    stock: 140,
    category: 'Kids Rakhi',
    active: true,
  },

  // ── RAKHI SPECIALS (LUMBA & DESIGNER RAKHIS) ──
  {
    id: 'rakhi_lumba_001',
    name: 'Handmade Kundan & Pearl Bhaiya Bhabhi Lumba Set',
    price: '₹899',
    priceNum: 899,
    originalPrice: '₹1,599',
    originalPriceNum: 1599,
    boutique: 'Royal Rakhis',
    badge: 'Premium Lumba',
    collection: 'Rakhi Special',
    styleCategory: 'Rakhi',
    suitType: 'Rakhi',
    type: 'Rakhi Collection',
    shortDesc: 'Traditional Kundan and real freshwater pearl Bhaiya Bhabhi Rakhi set with silk tassels.',
    fabricDetails: 'Freshwater pearls, Kundan stones, pure silk thread.',
    fabricName: 'Kundan & Pearl',
    fabricDesc: 'Pure handcrafted luxury',
    rating: 4.8,
    igLikes: '3.3K',
    igComments: '210',
    videoUrl: '',
    reelUrl: '',
    sizes: ['Free Size'],
    occasions: ['Raksha Bandhan'],
    care: ['Store in zip pouch'],
    stockQty: { 'Free Size': 90 },
    image: '/rakhi_poster_banner.png',
    additionalImages: [],
    addedAt: '2026-07-28T15:00:00.000Z',
    source: 'admin',
    totalOrders: 115,
    totalRevenue: '₹1.03L',
    stock: 90,
    category: 'Rakhi Special',
    active: true,
  },
  {
    id: 'rakhi_special_002',
    name: 'Pure 925 Sterling Silver Peacock Rakhi Pair',
    price: '₹1,299',
    priceNum: 1299,
    originalPrice: '₹2,199',
    originalPriceNum: 2199,
    boutique: 'Royal Rakhis',
    badge: '925 Silver',
    collection: 'Rakhi Special',
    styleCategory: 'Rakhi',
    suitType: 'Rakhi',
    type: 'Rakhi Collection',
    shortDesc: 'BIS hallmarked 925 Sterling Silver peacock motif Rakhi strung on red silk thread with silver beads.',
    fabricDetails: '925 sterling silver hallmarked centerpiece, pure silk mouli thread.',
    fabricName: '925 Sterling Silver',
    fabricDesc: 'Hallmarked silver peacock pendant',
    rating: 5.0,
    igLikes: '5.6K',
    igComments: '490',
    videoUrl: '',
    reelUrl: '',
    sizes: ['Free Size'],
    occasions: ['Raksha Bandhan'],
    care: ['Includes silver authenticity card'],
    stockQty: { 'Free Size': 110 },
    image: '/rakhi_campaign_hero.png',
    additionalImages: [],
    addedAt: '2026-07-28T15:15:00.000Z',
    source: 'admin',
    totalOrders: 140,
    totalRevenue: '₹1.81L',
    stock: 110,
    category: 'Rakhi Special',
    active: true,
  },
  {
    id: 'rakhi_special_003',
    name: 'Thread & Gemstone Designer Couple Rakhi Pair',
    price: '₹999',
    priceNum: 999,
    originalPrice: '₹1,699',
    originalPriceNum: 1699,
    boutique: 'Royal Rakhis',
    badge: 'Couple Set',
    collection: 'Rakhi Special',
    styleCategory: 'Rakhi',
    suitType: 'Rakhi',
    type: 'Rakhi Collection',
    shortDesc: 'Pair of handcrafted designer Rakhis featuring natural red agate gemstones and gold-plated floral charms.',
    fabricDetails: 'Red agate stones, brass gold charm, silk thread.',
    fabricName: 'Natural Agate & Gold Charm',
    fabricDesc: 'Handcrafted Gemstone Pair',
    rating: 4.8,
    igLikes: '2.9K',
    igComments: '170',
    videoUrl: '',
    reelUrl: '',
    sizes: ['Free Size'],
    occasions: ['Raksha Bandhan'],
    care: ['Store in dry box'],
    stockQty: { 'Free Size': 95 },
    image: '/rakhi_poster_banner.png',
    additionalImages: [],
    addedAt: '2026-07-28T15:30:00.000Z',
    source: 'admin',
    totalOrders: 82,
    totalRevenue: '₹0.81L',
    stock: 95,
    category: 'Rakhi Special',
    active: true,
  }
];

// ── Seed product with all fields ─────────────────────────────
const seedProduct = {
  id: 'seed_product_001',
  name: 'Royal Banarasi Silk Anarkali Suit Set',
  price: '₹12,999',
  priceNum: 12999,
  originalPrice: '₹18,999',
  originalPriceNum: 18999,
  boutique: 'Rajputana Heritage',
  badge: 'Premium',
  collection: 'Festive Edit',
  styleCategory: 'Royal',
  suitType: 'Anarkali',
  type: 'Anarkali',
  shortDesc: 'Handwoven Banarasi silk anarkali with intricate zari embroidery, perfect for weddings and festive celebrations. Includes matching dupatta and palazzo.',
  fabricDetails: 'Crafted from 100% pure Banarasi silk with real gold zari work. The fabric is handwoven by master artisans from Varanasi. Features traditional Mughal-inspired motifs with modern silhouette. The anarkali has a flowing floor-length flare with detailed thread work on the yoke and hemline.',
  fabricName: 'Pure Banarasi Silk',
  fabricDesc: 'Handwoven with real gold zari',
  rating: 4.9,
  igLikes: '2.4K',
  igComments: '186',
  videoUrl: 'https://www.youtube.com/watch?v=example',
  reelUrl: 'https://www.instagram.com/reel/example',
  sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)'],
  occasions: ['Wedding', 'Festive', 'Engagement', 'Sangeet', 'Reception'],
  care: ['Dry Clean Only', 'Iron on Low Heat'],
  stockQty: { 'S (36)': 5, 'M (38)': 12, 'L (40)': 18, 'XL (42)': 10, 'XXL (44)': 6 },
  image: '/banarasi_suit.png',
  additionalImages: ['/designer_suit_1.png', '/anarkali_suit.png'],
  addedAt: '2026-07-25T10:00:00.000Z',
  source: 'admin',
  totalOrders: 48,
  totalRevenue: '₹6.24L',
  stock: 51,
  category: 'Festive Edit',
  active: true,
  fitOptions: ['Unstitched', 'Stitched'],
};

const seedProduct2 = {
  id: 'seed_product_002',
  name: 'Chikankari Handloom Cotton Suit Set',
  price: '₹7,499',
  priceNum: 7499,
  originalPrice: '₹10,999',
  originalPriceNum: 10999,
  boutique: 'Awadh Kraft',
  badge: 'Artisanal',
  collection: 'Best Sellers',
  styleCategory: 'Traditional',
  suitType: 'Chikankari',
  type: 'Chikankari',
  shortDesc: 'Authentic Lucknowi chikankari on pure cotton, hand-embroidered by women artisans. Lightweight and elegant for daily and semi-formal wear.',
  fabricDetails: 'Made from premium combed cotton with intricate shadow chikankari embroidery. Each piece takes 15-20 days to complete by skilled artisans from Lucknow. Features tepchi, phanda, and murri stitches. Includes cotton lining for comfort.',
  fabricName: 'Pure Combed Cotton',
  fabricDesc: 'Hand-embroidered Lucknowi chikankari',
  rating: 4.8,
  igLikes: '1.8K',
  igComments: '142',
  videoUrl: '',
  reelUrl: '',
  sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)'],
  occasions: ['Casual', 'Daily Wear', 'Office Wear', 'Brunch'],
  care: ['Hand Wash', 'Do Not Bleach', 'Iron on Low Heat'],
  stockQty: { 'S (36)': 8, 'M (38)': 15, 'L (40)': 20, 'XL (42)': 12 },
  image: '/chikankari_suit.png',
  additionalImages: ['/cotton_suit.png'],
  addedAt: '2026-07-24T08:30:00.000Z',
  source: 'admin',
  totalOrders: 39,
  totalRevenue: '₹2.92L',
  stock: 55,
  category: 'Best Sellers',
  active: true,
  fitOptions: ['Unstitched', 'Stitched'],
};

const seedProduct3 = {
  id: 'seed_product_003',
  name: 'Royal Sharara Suit Set with Heavy Dupatta',
  price: '₹11,499',
  priceNum: 11499,
  originalPrice: '₹15,999',
  originalPriceNum: 15999,
  boutique: 'Rajputana',
  badge: 'Grand Wedding',
  collection: 'Festive Edit',
  styleCategory: 'Royal',
  suitType: 'Sharara',
  type: 'Sharara',
  shortDesc: 'Opulent sharara suit with heavily embroidered kameez and flared sharara pants. Complete with a luxurious net dupatta with cutwork border.',
  fabricDetails: 'Premium georgette base with sequin, mirror, and thread work. The sharara pants feature gold gota patti borders. Kameez has full back and front embroidery with scalloped hemline. Dupatta has 4-side heavy border with pallu design.',
  fabricName: 'Premium Georgette',
  fabricDesc: 'Heavy sequin and mirror work',
  rating: 5.0,
  igLikes: '3.1K',
  igComments: '234',
  videoUrl: 'https://www.youtube.com/watch?v=example2',
  reelUrl: 'https://www.instagram.com/reel/example2',
  sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)'],
  occasions: ['Wedding', 'Bridal', 'Engagement', 'Reception', 'Sangeet'],
  care: ['Dry Clean Only'],
  stockQty: { 'S (36)': 3, 'M (38)': 6, 'L (40)': 8, 'XL (42)': 4 },
  image: '/sharara_suit.png',
  additionalImages: ['/designer_suit_1.png'],
  addedAt: '2026-07-23T12:00:00.000Z',
  source: 'admin',
  totalOrders: 31,
  totalRevenue: '₹3.56L',
  stock: 21,
  category: 'Festive Edit',
  active: true,
  fitOptions: ['Unstitched', 'Stitched'],
};

const seedProduct4 = {
  id: 'seed_product_004',
  name: 'Pakistani Straight Suit Set with Digital Print',
  price: '₹4,799',
  priceNum: 4799,
  originalPrice: '₹6,999',
  originalPriceNum: 6999,
  boutique: 'Nazraana',
  badge: 'Verified',
  collection: 'New Arrivals',
  styleCategory: 'Contemporary',
  suitType: 'Pakistani',
  type: 'Pakistani',
  shortDesc: 'Elegant Pakistani straight cut suit with digital floral print on premium lawn fabric. Includes chiffon dupatta with printed borders.',
  fabricDetails: 'Premium Pakistani lawn cotton with reactive digital print that retains color after multiple washes. Features contrast piping on neckline and hem. Straight pants with elasticized waistband for comfort. Chiffon dupatta with matching print.',
  fabricName: 'Premium Lawn Cotton',
  fabricDesc: 'Digital floral print',
  rating: 4.7,
  igLikes: '1.2K',
  igComments: '98',
  videoUrl: '',
  reelUrl: '',
  sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)'],
  occasions: ['Casual', 'Daily Wear', 'Office Wear', 'Travel'],
  care: ['Machine Wash', 'Do Not Bleach', 'Iron on Low Heat'],
  stockQty: { 'S (36)': 10, 'M (38)': 20, 'L (40)': 25, 'XL (42)': 15, 'XXL (44)': 8 },
  image: '/pakistani_suit.png',
  additionalImages: ['/cotton_suit.png'],
  addedAt: '2026-07-22T09:15:00.000Z',
  source: 'admin',
  totalOrders: 27,
  totalRevenue: '₹1.30L',
  stock: 78,
  category: 'New Arrivals',
  active: true,
  fitOptions: ['Unstitched', 'Stitched'],
};

const seedProduct5 = {
  id: 'seed_product_005',
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
  shortDesc: 'Test product for Razorpay integration. ₹1 price.',
  fabricDetails: 'Test fabric for payment testing.',
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
  fitOptions: ['Unstitched', 'Stitched'],
};

// Auto-seed if no products exist
export const seedIfEmpty = () => {
  const existing = get(KEYS.products, []);
  if (existing.length === 0) {
    set(KEYS.products, [seedProduct, seedProduct2, seedProduct3, seedProduct4, seedProduct5]);
    if (isFirebaseConfigured()) {
      [seedProduct, seedProduct2, seedProduct3, seedProduct4, seedProduct5].forEach(p => {
        saveProductToFirestore(p.id, p).catch(() => {});
      });
    }
  }
};

// ── Generic helpers ──────────────────────────────────────────
const get  = (key, fallback = []) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};

const set  = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  
  // Also push to Firestore settings if it's one of the settings keys
  if (isFirebaseConfigured() && db) {
    const settingsKeys = [
      KEYS.categories, KEYS.collections
    ];
    if (settingsKeys.includes(key)) {
      // Find which generic name this key corresponds to
      const objKey = Object.keys(KEYS).find(k => KEYS[k] === key);
      if (objKey && auth && auth.currentUser) {
        setDoc(doc(db, 'settings', 'gurnaaz_store'), {
          [objKey]: value
        }, { merge: true }).catch(err => {
          console.error("Failed to sync setting to Firestore:", objKey, err);
        });
      }
    }
  }
};

// ── Convert image File → base64 (persists in localStorage) ──
export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// ── PRODUCTS ─────────────────────────────────────────────────
export const getProducts   = ()           => get(KEYS.products, []);
export const saveProducts  = (arr)        => set(KEYS.products, arr);

export const addProduct = (product) => {
  const arr = getProducts();
  arr.unshift(product);
  saveProducts(arr);
  if (isFirebaseConfigured()) {
    saveProductToFirestore(product.id, product).catch(err =>
      console.error("Failed to add product to Firestore:", err)
    );
  }
};

export const updateProduct = (id, data) => {
  const updatedList = getProducts().map(p => p.id === id ? { ...p, ...data } : p);
  saveProducts(updatedList);
  
  if (isFirebaseConfigured()) {
    const updatedProd = updatedList.find(p => p.id === id);
    if (updatedProd) {
      saveProductToFirestore(id, updatedProd).catch(err =>
        console.error("Failed to update product in Firestore:", err)
      );
    }
  }
};

export const deleteProduct = (id) => {
  saveProducts(getProducts().filter(p => p.id !== id));
  if (isFirebaseConfigured()) {
    deleteProductFromFirestore(id).catch(err =>
      console.error("Failed to delete product from Firestore:", err)
    );
  }
};

const defaultVideos = [];

const defaultReels = [];

const injectDefaultMedia = (product, index) => {
  return {
    ...product,
    videoUrl: product.videoUrl || '',
    reelUrl: product.reelUrl || '',
    additionalImages: product.additionalImages || [],
    sizes: product.sizes || [],
    fitOptions: product.fitOptions || ['Unstitched', 'Stitched']
  };
};

export const getAllProducts = () => {
  const adminProducts = getProducts();
  const overrides = get('gurnaaz_static_overrides', {});
  const adminIds = new Set(adminProducts.map(p => p.id));
  
  // Merge static products with override values (like rating calculated dynamically)
  const processedStatics = staticProducts.map(p => {
    if (overrides[p.id]) {
      return { ...p, ...overrides[p.id] };
    }
    return p;
  });

  const merged = [...adminProducts, ...processedStatics.filter(p => !adminIds.has(p.id))];
  return merged.map((p, idx) => injectDefaultMedia(p, idx));
};

// ── REVIEWS & RATINGS ─────────────────────────────────────────
export const getReviews = (productId) => {
  const allReviews = get(KEYS.reviews, {});
  return allReviews[productId] || [];
};

export const addReview = (productId, review) => {
  const allReviews = get(KEYS.reviews, {});
  if (!allReviews[productId]) {
    allReviews[productId] = [];
  }
  
  const newReview = {
    id: `rev_${Date.now()}`,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    createdAt: new Date().toISOString(),
    ...review
  };
  
  allReviews[productId].unshift(newReview);
  set(KEYS.reviews, allReviews);

  // Dynamically update product rating average in store
  const reviews = allReviews[productId];
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const formattedAvg = parseFloat(avg.toFixed(1));
  
  const adminProducts = getProducts();
  if (adminProducts.some(p => p.id === productId)) {
    updateProduct(productId, { rating: formattedAvg });
  } else {
    const overrides = get('gurnaaz_static_overrides', {});
    overrides[productId] = { ...overrides[productId], rating: formattedAvg };
    set('gurnaaz_static_overrides', overrides);
  }

  // Trigger Firestore save async
  if (isFirebaseConfigured()) {
    saveReviewToFirestore(productId, newReview).then(() => {
      saveProductRatingToFirestore(productId, formattedAvg, reviews.length);
    }).catch(err => console.error("Async review save failed:", err));
  }
};

/**
 * Bidirectionally syncs reviews between Firestore and localStorage
 */
export const syncProductReviews = async (productId, onSyncComplete) => {
  if (!isFirebaseConfigured()) return;
  
  try {
    // 1. Fetch reviews from Firestore
    const dbReviews = await fetchReviewsFromFirestore(productId);
    
    // 2. Fetch local reviews
    const allReviews = get(KEYS.reviews, {});
    const localReviews = allReviews[productId] || [];
    
    // Create map of ID -> review
    const mergedMap = new Map();
    
    // Add all local reviews to map
    localReviews.forEach(r => mergedMap.set(r.id, r));
    
    // Add Firestore reviews to map (Firestore wins in case of conflicts, or merge new ones)
    dbReviews.forEach(r => {
      if (!mergedMap.has(r.id)) {
        mergedMap.set(r.id, r);
      }
    });
    
    // 3. Upload local reviews to Firestore if they don't exist in Firestore
    const localIdsInDb = new Set(dbReviews.map(r => r.id));
    for (const r of localReviews) {
      if (!localIdsInDb.has(r.id)) {
        await saveReviewToFirestore(productId, r);
      }
    }
    
    // 4. Update local storage with merged list
    const mergedList = Array.from(mergedMap.values());
    
    // Sort descending by date/createdAt/timestamp
    mergedList.sort((a, b) => {
      const timeA = new Date(a.createdAt || a.date || 0).getTime();
      const timeB = new Date(b.createdAt || b.date || 0).getTime();
      return timeB - timeA;
    });
    
    allReviews[productId] = mergedList;
    set(KEYS.reviews, allReviews);
    
    // 5. Update local average rating based on merged list
    if (mergedList.length > 0) {
      const avg = mergedList.reduce((sum, r) => sum + r.rating, 0) / mergedList.length;
      const formattedAvg = parseFloat(avg.toFixed(1));
      
      const adminProducts = getProducts();
      if (adminProducts.some(p => p.id === productId)) {
        updateProduct(productId, { rating: formattedAvg });
      } else {
        const overrides = get('gurnaaz_static_overrides', {});
        overrides[productId] = { ...overrides[productId], rating: formattedAvg };
        set('gurnaaz_static_overrides', overrides);
      }
      
      // Also update Firestore with the average rating
      await saveProductRatingToFirestore(productId, formattedAvg, mergedList.length);
    }
    
    if (onSyncComplete) {
      onSyncComplete(mergedList);
    }
  } catch (error) {
    console.error("Error syncing product reviews with database:", error);
  }
};

// ── GALLERY ──────────────────────────────────────────────────


export const getCategories = () => {
  const dataStr = localStorage.getItem(KEYS.categories);
  let data = dataStr ? JSON.parse(dataStr) : [];
  
  const hasSeeded = localStorage.getItem('gurnaaz_categories_seeded_v3');
  
  if (!hasSeeded) {
    const defaults = [
      { id: 1, name: 'Rakhi Special', subtitle: 'Festive Edition', image: '/rakhi_suit_hero_shoot.jpg', image2: '/rakhi_poster_banner.png', tagline: 'Designer Rakhi & Ethnic Suit Pairing', order: 1, active: true },
      { id: 2, name: 'Gift Boxes', subtitle: 'Keepsake Hampers', image: '/rakhi_gift_box_hamper.jpg', image2: '/rakhi_poster_banner.png', tagline: 'Sweets, Silver Rakhi & Custom Voice QR Card', order: 2, active: true },
      { id: 3, name: 'Kashmiri Churi', subtitle: 'Artisanal Bangles', image: '/kashmiri_churi_bangles.jpg', image2: '/kashmiri_churi_bangles.jpg', tagline: 'Handcrafted Velvet Zari Bangles from Kashmir', order: 3, active: true },
      { id: 4, name: 'Designer Kadas', subtitle: 'Polki & Gold', image: '/designer_kadda_bangles.jpg', image2: '/designer_kadda_bangles.jpg', tagline: 'Bridal Gold & Meenakari Kada Bangles', order: 4, active: true },
      { id: 5, name: 'Kids Rakhi', subtitle: 'Bacheya Ki Special', image: '/kids_rakhi_collection.jpg', image2: '/kids_rakhi_collection.jpg', tagline: 'Cute superhero & soft light-up Rakhis for kids', order: 5, active: true },
      { id: 6, name: 'Anarkali', subtitle: 'The Royal Edit', image: '/anarkali_suit.png', image2: '/designer_suit_1.png', tagline: 'Flowing elegance for every occasion', order: 6, active: true },
      { id: 7, name: 'Sharara', subtitle: 'The Festive Edit', image: '/sharara_suit.png', image2: '/pakistani_suit.png', tagline: 'Modern silhouettes with traditional charm', order: 7, active: true },
      { id: 8, name: 'Banarasi', subtitle: 'Golden Brocades', image: '/banarasi_suit.png', image2: '/cotton_suit.png', tagline: 'Heritage weaves from the holy city', order: 8, active: true },
      { id: 9, name: 'Patiala', subtitle: 'Heritage Weaves', image: '/patiala_suit.png', image2: '/designer_suit_1.png', tagline: 'Comfortable cuts with vibrant prints', order: 9, active: true },
      { id: 10, name: 'Pakistani', subtitle: 'Straight Elegance', image: '/pakistani_suit.png', image2: '/sharara_suit.png', tagline: 'Contemporary styles with rich embroidery', order: 10, active: true },
    ];
    
    let added = false;
    defaults.forEach(def => {
      // Add if category name doesn't exist yet
      if (!data.some(c => c.name.toLowerCase() === def.name.toLowerCase())) {
        data.push(def);
        added = true;
      }
    });

    if (added || data.length === 0) {
      set(KEYS.categories, data);
    }
    
    localStorage.setItem('gurnaaz_categories_seeded_v3', 'true');
  }

  return data;
};

export const saveCategories = (arr) => set(KEYS.categories, arr);

// ── COLLECTIONS ──────────────────────────────────────────────
export const getCollections = () => {
  const dataStr = localStorage.getItem(KEYS.collections);
  let data = dataStr ? JSON.parse(dataStr) : [];
  
  const hasSeeded = localStorage.getItem('gurnaaz_collections_seeded');
  
  if (!hasSeeded) {
    const defaults = [
      { id: 'summer', title: 'Summer', subtitle: 'Collection', desc: 'Breezy cottons and light georgettes tailored for the warm sun.', story: 'Inspired by sun-drenched Indian gardens and breezy terraces, this collection celebrates the joy of warm-weather dressing with lightweight fabrics and cheerful palettes.', image: '/summer_edit.png', accent: '#D4A574', category: 'All', tag: 'Seasonal', active: true, order: 1 },
      { id: 'monsoon', title: 'Monsoon', subtitle: 'Collection', desc: 'Vibrant hues and fluid silhouettes to brighten gray days.', story: 'When the rains arrive, so does our most colorful collection. Rich jewel tones and flowing fabrics that dance with the monsoon breeze.', image: '/monsoon_edit.png', accent: '#5B9AA0', category: 'All', tag: 'Seasonal', active: true, order: 2 },
      { id: 'wedding', title: 'Wedding', subtitle: 'Collection', desc: 'Heavy, regal bridal ensembles crafted for your biggest day.', story: 'For the most important day of your life, we bring you ensembles that carry centuries of bridal tradition, reimagined for the modern bride.', image: '/wedding_edit.png', accent: '#C77B8A', category: 'All', tag: 'Seasonal', active: true, order: 3 },
      { id: 'pastel', title: 'Pastel', subtitle: 'Collection', desc: 'Soft pinks, mints, and lilacs adorned with delicate threadwork.', story: 'Whisper-soft hues meet intricate hand embroidery in a collection that celebrates understated elegance and feminine grace.', image: '/pastel_edit.png', accent: '#B8A9C9', category: 'All', tag: 'Seasonal', active: true, order: 4 },
      { id: 'black', title: 'Black', subtitle: 'Collection', desc: 'Striking black suits with dramatic silver and gold accents.', story: 'Timeless, powerful, and always in style. Our black collection brings drama and sophistication to every occasion.', image: '/black_edit.png', accent: '#BCA58A', category: 'All', tag: 'Seasonal', active: true, order: 5 },
      { id: 'luxury', title: 'Luxury', subtitle: 'Collection', desc: 'Our most exclusive, hand-embroidered heritage pieces.', story: 'The pinnacle of Indian craftsmanship. Each piece in this collection takes weeks of dedicated handwork by master artisans.', image: '/luxury_edit.png', accent: '#C5A55A', category: 'All', tag: 'Seasonal', active: true, order: 6 },
      { id: 'punjabi', title: 'Punjabi', subtitle: 'Suits', desc: 'Rich Punjabi heritage with vibrant phulkari dupattas and bold silhouettes.', story: 'Bold colors, generous silhouettes, and the exuberant spirit of Punjab come alive in these traditionally crafted suits.', image: '/patiala_suit.png', accent: '#E07A5F', category: 'Patiala', tag: 'By Style', active: true, order: 7 },
      { id: 'anarkali', title: 'Anarkali', subtitle: 'Collection', desc: 'Regal flares and majestic silhouettes inspired by Mughal grandeur.', story: 'Named after the legendary court dancer, Anarkali suits feature voluminous flares that create a regal, princess-like silhouette.', image: '/anarkali_suit.png', accent: '#81B29A', category: 'Anarkali', tag: 'By Style', active: true, order: 8 },
      { id: 'sharara', title: 'Sharara', subtitle: 'Collection', desc: 'Playful tiers and festive drama with traditional three-piece elegance.', story: 'The three-piece ensemble that has been a staple of Indian celebrations for centuries, now reimagined with contemporary flair.', image: '/sharara_suit.png', accent: '#F2CC8F', category: 'Sharara', tag: 'By Style', active: true, order: 9 },
      { id: 'chikankari', title: 'Chikankari', subtitle: 'Collection', desc: 'Delicate shadow embroidery from Lucknow, woven with artisan heritage.', story: 'Born in the royal courts of Lucknow, Chikankari is one of India\'s most refined embroidery traditions, featuring delicate shadow work on sheer fabrics.', image: '/chikankari_suit.png', accent: '#9DB4C0', category: 'Chikankari', tag: 'By Style', active: true, order: 10 },
      { id: 'banarasi', title: 'Banarasi', subtitle: 'Collection', desc: 'Opulent katan silk brocades with golden zari from Varanasi looms.', story: 'Handwoven in the ancient city of Varanasi, Banarasi silk is renowned for its gold and silver brocade, fine silk, and opulent embroidery.', image: '/banarasi_suit.png', accent: '#C9A96E', category: 'Banarasi', tag: 'By Style', active: true, order: 11 },
      { id: 'pakistani', title: 'Pakistani', subtitle: 'Collection', desc: 'Contemporary straight-cut elegance with delicate laces and organza details.', story: 'Clean lines, elegant cuts, and meticulous attention to detail define this collection inspired by cross-border fashion sensibilities.', image: '/pakistani_suit.png', accent: '#7EB8C9', category: 'Pakistani', tag: 'By Style', active: true, order: 12 },
      { id: 'designer', title: 'Designer', subtitle: 'Edit', desc: 'Handpicked designer suits featuring premium fabrics and exclusive craftsmanship.', story: 'Curated from the studios of India\'s most talented designers, each piece is a wearable work of art.', image: '/designer_suit_1.png', accent: '#D4A574', category: 'All', tag: 'Curated', active: true, order: 13 },
      { id: 'festive', title: 'Festive', subtitle: 'Wear', desc: 'Celebratory ensembles with rich embroidery for festivals and puja ceremonies.', story: 'From Diwali to Eid, Navratri to Pongal — celebrate every festival in ensembles that match the joy of the occasion.', image: '/anarkali_suit.png', accent: '#D4574E', category: 'All', tag: 'By Occasion', active: true, order: 14 },
      { id: 'party', title: 'Party', subtitle: 'Wear', desc: 'Statement pieces with contemporary cuts and glamorous embellishments.', story: 'Make an entrance with bold silhouettes, shimmering fabrics, and statement embellishments designed for unforgettable evenings.', image: '/sharara_suit.png', accent: '#9B59B6', category: 'All', tag: 'By Occasion', active: true, order: 15 },
      { id: 'bridal', title: 'Bridal', subtitle: 'Collection', desc: 'Exquisite bridal lehengas and suits with heavy zardozi and danka work.', story: 'For the bride who wants to honor tradition while embracing modernity, our bridal collection features the finest zardozi, danka, and gota patti work.', image: '/wedding_edit.png', accent: '#C0392B', category: 'All', tag: 'By Occasion', active: true, order: 16 },
      { id: 'casual', title: 'Casual', subtitle: '& Daily Wear', desc: 'Comfortable everyday suits in breathable cottons and soft georgettes.', story: 'Elegance doesn\'t need to be reserved for special occasions. Our casual collection brings comfort and style to your everyday wardrobe.', image: '/cotton_suit.png', accent: '#7DCEA0', category: 'Casual', tag: 'By Occasion', active: true, order: 17 },
      { id: 'velvet', title: 'Velvet', subtitle: 'Collection', desc: 'Luxurious micro-velvet suits with heavy hand-applied zardozi work.', story: 'The richness of velvet meets the artistry of traditional Indian embroidery in this winter-perfect collection.', image: '/banarasi_suit.png', accent: '#6C3483', category: 'All', tag: 'By Fabric', active: true, order: 18 },
      { id: 'silk', title: 'Pure Silk', subtitle: 'Collection', desc: 'Handloomed silk suits with natural sheen and royal drape.', story: 'There is nothing quite like the feel of pure silk against skin. Our silk collection celebrates this most regal of fabrics.', image: '/luxury_edit.png', accent: '#B7950B', category: 'All', tag: 'By Fabric', active: true, order: 19 },
      { id: 'cotton', title: 'Cotton', subtitle: 'Collection', desc: 'Breathable handloom cotton suits with block prints and Chikankari.', story: 'India\'s gift to the world, handloom cotton is celebrated for its breathability, durability, and the unique character of handwoven textiles.', image: '/cotton_suit.png', accent: '#45B39D', category: 'All', tag: 'By Fabric', active: true, order: 20 },
      { id: 'georgette', title: 'Georgette', subtitle: 'Collection', desc: 'Flowy georgette suits with delicate threadwork and easy drape.', story: 'Lightweight, flowy, and effortlessly elegant — georgette is the fabric of choice for those who love movement and grace.', image: '/chikankari_suit.png', accent: '#AED6F1', category: 'All', tag: 'By Fabric', active: true, order: 21 },
      { id: 'organza', title: 'Organza', subtitle: 'Collection', desc: 'Sheer organza silk suits with intricate floral embroidery and volume.', story: 'The ethereal sheerness of organza creates a dreamlike quality, perfect for those who love romantic, feminine silhouettes.', image: '/pastel_edit.png', accent: '#F5B7B1', category: 'All', tag: 'By Fabric', active: true, order: 22 },
    ];
    
    let added = false;
    defaults.forEach(def => {
      if (!data.some(c => c.id === def.id)) {
        data.push(def);
        added = true;
      }
    });

    if (added || data.length === 0) {
      set(KEYS.collections, data);
    }
    
    localStorage.setItem('gurnaaz_collections_seeded', 'true');
  }

  return data;
};

export const saveCollections = (arr) => set(KEYS.collections, arr);

// --- COLLECTION TAGS ---
export const getCollectionTags = () => {
  const data = localStorage.getItem(KEYS.collectionTags);
  if (!data) {
    const initialTags = [
      { id: 'seasonal', name: 'Seasonal', icon: '☀', order: 1, active: true },
      { id: 'by-style', name: 'By Style', icon: '✦', order: 2, active: true },
      { id: 'by-occasion', name: 'By Occasion', icon: '♦', order: 3, active: true },
      { id: 'by-fabric', name: 'By Fabric', icon: '◎', order: 4, active: true },
      { id: 'curated', name: 'Curated', icon: '❖', order: 5, active: true },
    ];
    localStorage.setItem(KEYS.collectionTags, JSON.stringify(initialTags));
    
    // Also save to firebase if you want, but local is fine for seeding
    if (auth.currentUser) {
      setDoc(doc(db, 'adminData', KEYS.collectionTags), { data: initialTags });
    }
    
    return initialTags;
  }
  return JSON.parse(data);
};

export const saveCollectionTags = async (tags) => {
  localStorage.setItem(KEYS.collectionTags, JSON.stringify(tags));
  if (auth.currentUser) {
    await setDoc(doc(db, 'adminData', KEYS.collectionTags), { data: tags });
  }
  notifyWebsite();
};



// ── ORDERS ───────────────────────────────────────────────────
export const getOrders = () => get(KEYS.orders, []);
export const saveOrders = (arr) => set(KEYS.orders, arr);



// ── SUPPORT TICKETS (CONTACTS) ──────────────────────────────
export const getSupportTickets = () => get(KEYS.support, []);
export const saveSupportTickets = (arr) => set(KEYS.support, arr);

export const addSupportTicket = async (ticket) => {
  const arr = getSupportTickets();
  const ticketId = `ticket_${Date.now()}`;
  const newTicket = {
    id: ticketId,
    createdAt: new Date().toISOString(),
    status: 'new', // new, in-progress, closed
    ...ticket
  };
  arr.unshift(newTicket);
  saveSupportTickets(arr);

  if (isFirebaseConfigured()) {
    try {
      await saveDocumentToFirestore('contacts', ticketId, newTicket);
    } catch (err) {
      console.error("Failed to save contact to Firestore:", err);
    }
  }
};

export const updateSupportTicketStatus = async (id, newStatus) => {
  const arr = getSupportTickets();
  const updated = arr.map(t => t.id === id ? { ...t, status: newStatus } : t);
  saveSupportTickets(updated);

  if (isFirebaseConfigured()) {
    try {
      const ticket = updated.find(t => t.id === id);
      if (ticket) {
        await saveDocumentToFirestore('contacts', id, ticket);
      }
    } catch (err) {
      console.error("Failed to update contact in Firestore:", err);
    }
  }
};

export const syncSupportTickets = async () => {
  if (!isFirebaseConfigured()) return;
  try {
    const contacts = await fetchCollectionFromFirestore('contacts');
    if (contacts && contacts.length > 0) {
      contacts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      saveSupportTickets(contacts);
      window.dispatchEvent(new Event('admin-data-updated'));
    }
  } catch (err) {
    console.error("Failed to sync contacts:", err);
  }
};

export const addOrder = (order) => {
  const arr = getOrders();
  arr.unshift(order);
  saveOrders(arr);
  
  if (isFirebaseConfigured()) {
    saveOrderToFirestore(order.orderId || order.id, order).catch(err => 
      console.error("Failed to save order to Firestore:", err)
    );
  }
};

/**
 * Syncs orders between Firestore and localStorage
 */
export const syncOrders = async (onSyncComplete) => {
  if (!isFirebaseConfigured()) return;
  
  try {
    const dbOrders = await fetchOrdersFromFirestore();
    const localOrders = getOrders();
    
    const mergedMap = new Map();
    localOrders.forEach(o => mergedMap.set(o.orderId || o.id, o));
    
    dbOrders.forEach(o => {
      const key = o.orderId || o.id;
      if (!mergedMap.has(key)) {
        mergedMap.set(key, o);
      }
    });
    
    // Upload local orders if not in db
    const dbIds = new Set(dbOrders.map(o => o.orderId || o.id));
    for (const o of localOrders) {
      const key = o.orderId || o.id;
      if (!dbIds.has(key)) {
        await saveOrderToFirestore(key, o);
      }
    }
    
    const mergedList = Array.from(mergedMap.values());
    mergedList.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    
    saveOrders(mergedList);
    
    if (onSyncComplete) {
      onSyncComplete(mergedList);
    }
  } catch (error) {
    console.error("Error syncing orders:", error);
  }
};

export const updateOrderStatus = (id, status) => {
  const arr = getOrders();
  const index = arr.findIndex(o => (o.orderId || o.id) === id);
  if (index > -1) {
    arr[index] = { ...arr[index], status: status };
    saveOrders(arr);
    
    if (isFirebaseConfigured()) {
      saveOrderToFirestore(id, arr[index]).catch(err =>
        console.error("Failed to update order status in Firestore:", err)
      );
    }
  }
};

// ── Notify main website of data change ───────────────────────
export const notifyWebsite = () => {
  window.dispatchEvent(new CustomEvent('admin-data-updated'));
};

export const staticBoutiques = {
  'Awadh Kraft': {
    id: 'b1',
    name: 'Awadh Kraft',
    logo: '/chikankari_suit.png',
    coverImage: '/chikankari_suit.png',
    rating: 4.9,
    reviews: 124,
    location: 'Lucknow, UP'
  },
  'Rajputana Heritage': {
    id: 'b2',
    name: 'Rajputana Heritage',
    logo: '/banarasi_suit.png',
    coverImage: '/banarasi_suit.png',
    rating: 4.8,
    reviews: 89,
    location: 'Varanasi, UP'
  },
  'Nazraana': {
    id: 'b3',
    name: 'Nazraana',
    logo: '/pakistani_suit.png',
    coverImage: '/pakistani_suit.png',
    rating: 4.7,
    reviews: 210,
    location: 'Delhi'
  },
  'Rajputana': {
    id: 'b4',
    name: 'Rajputana',
    logo: '/sharara_suit.png',
    coverImage: '/sharara_suit.png',
    rating: 5.0,
    reviews: 312,
    location: 'Jaipur, RJ'
  }
};

// ── BOUTIQUES ────────────────────────────────────────────────
export const getBoutiques = () => get(KEYS.boutiques, []);
export const saveBoutiques = (arr) => set(KEYS.boutiques, arr);

export const addBoutique = async (boutique) => {
  const arr = getBoutiques();
  arr.push(boutique);
  saveBoutiques(arr);
  if (isFirebaseConfigured()) {
    try {
      await saveDocumentToFirestore('boutiques', boutique.id, boutique);
    } catch (err) {
      console.error("Failed to save boutique to Firestore:", err);
    }
  }
};

export const updateBoutique = async (id, data) => {
  const updatedList = getBoutiques().map(b => b.id === id ? { ...b, ...data } : b);
  saveBoutiques(updatedList);
  if (isFirebaseConfigured()) {
    try {
      const boutique = updatedList.find(b => b.id === id);
      if (boutique) await saveDocumentToFirestore('boutiques', id, boutique);
    } catch (err) {
      console.error("Failed to update boutique in Firestore:", err);
    }
  }
};

export const deleteBoutique = async (id) => {
  saveBoutiques(getBoutiques().filter(b => b.id !== id));
  // Note: deletion from firestore can be handled if a deleteDocumentFromFirestore function is added later.
};

export const syncBoutiques = async () => {
  if (!isFirebaseConfigured()) return;
  try {
    const dbBoutiques = await fetchCollectionFromFirestore('boutiques');
    if (dbBoutiques && dbBoutiques.length > 0) {
      saveBoutiques(dbBoutiques);
      window.dispatchEvent(new Event('admin-data-updated'));
    }
  } catch (err) {
    console.error("Failed to sync boutiques:", err);
  }
};

export const getBoutiqueProfile = (boutiqueName) => {
  if (!boutiqueName) return null;
  const name = boutiqueName.trim().toLowerCase();
  const allBoutiques = getBoutiques();
  
  // Try to find a dynamic match first
  const match = allBoutiques.find(b => {
    const bn = (b.name || '').toLowerCase();
    const slug = bn.replace(/ /g, '-');
    return bn.includes(name) || name.includes(bn) || slug === name;
  });

  if (match) return match;

  return {
    name: boutiqueName.trim(),
    description: "",
    contact: "",
    address: "",
    coverImage: "",
    logo: "",
    rating: 0
  };
};

export const syncProducts = async (onSyncComplete) => {
  if (!isFirebaseConfigured()) return;
  try {
    const dbProducts = await fetchProductsFromFirestore();
    saveProducts(dbProducts);

    try {
      const data = await fetchCollectionFromFirestore('settings');
      const storeData = data.find(d => d.id === 'gurnaaz_store');
      if (storeData) {
          const collectionsDoc = await getDoc(doc(db, 'adminData', KEYS.collections));
          if (collectionsDoc.exists()) {
            localStorage.setItem(KEYS.collections, JSON.stringify(collectionsDoc.data().data));
          }

          const tagsDoc = await getDoc(doc(db, 'adminData', KEYS.collectionTags));
          if (tagsDoc.exists()) {
            localStorage.setItem(KEYS.collectionTags, JSON.stringify(tagsDoc.data().data));
          }
          
          notifyWebsite();
          
          for (const [key, value] of Object.entries(storeData)) {
            if (key !== 'id' && KEYS[key]) {
              set(KEYS[key], value);
            }
          }
      }
    } catch (e) {
      console.error("Failed to fetch settings:", e);
    }

    await syncBoutiques();

    if (onSyncComplete) {
      onSyncComplete(dbProducts);
    }
  } catch (error) {
    console.error("Error syncing products and collections:", error);
  }
};
