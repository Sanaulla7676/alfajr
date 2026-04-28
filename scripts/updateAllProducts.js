require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, writeBatch, doc } = require('firebase/firestore');

const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Map of categories to stunning, high-res Unsplash image URLs
const categoryImages = {
  'Spices & Masala': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop',
  'Pasta, Noodles & Vermicelli': 'https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=600&auto=format&fit=crop',
  'Personal Care & Hygiene': 'https://images.unsplash.com/photo-1583947581924-860bda715f76?q=80&w=600&auto=format&fit=crop',
  'Tea, Coffee & Hot Beverages': 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=600&auto=format&fit=crop',
  'Cooking Oils & Ghee': 'https://images.unsplash.com/photo-1474213197576-f8ec003110ec?q=80&w=600&auto=format&fit=crop',
  'Sauces, pickels, Dry Fruits': 'https://images.unsplash.com/photo-1585238210332-9cbce24db498?q=80&w=600&auto=format&fit=crop',
  'Sauces, Pickles & Condiments': 'https://images.unsplash.com/photo-1585238210332-9cbce24db498?q=80&w=600&auto=format&fit=crop',
  'Dairy Products': 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=600&auto=format&fit=crop',
  'Biscuits, Snacks & Namkeen': 'https://images.unsplash.com/photo-1599388147614-7221ca4d60c2?q=80&w=600&auto=format&fit=crop',
  'Breakfast & Health Foods': 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=600&auto=format&fit=crop',
  'Soft Drinks, Juices & Beverages': 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?q=80&w=600&auto=format&fit=crop',
  'Bread, Bakery & Sweets': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop',
  'Baking Ingredients & Essences': 'https://images.unsplash.com/photo-1556910110-a5a63dfd393c?q=80&w=600&auto=format&fit=crop',
  'Pulses & Legumes': 'https://images.unsplash.com/photo-1581636653139-653a6e38deec?q=80&w=600&auto=format&fit=crop',
  'Ready Mixes, Soups & Convenience Foods': 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=600&auto=format&fit=crop',
  'Flours, Grains & Staples': 'https://images.unsplash.com/photo-1574316075482-9ae45a05d214?q=80&w=600&auto=format&fit=crop',
  'Rice & Rice Products': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop',
  'Dry Fruits & Nuts': 'https://images.unsplash.com/photo-1599557436440-6240212f4fc9?q=80&w=600&auto=format&fit=crop',
  'Household Cleaning & Laundry': 'https://images.unsplash.com/photo-1584820927498-cafe2c159265?q=80&w=600&auto=format&fit=crop',
  'Agarbathi, Puja & Home Essentials': 'https://images.unsplash.com/photo-1616782255757-bb03c43719b9?q=80&w=600&auto=format&fit=crop',
  'Frozen Foods & Ice Cream': 'https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=600&auto=format&fit=crop'
};

const defaultImage = 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop'; // fallback grocery image

function getRandomPrice() {
  return Math.floor(Math.random() * (450 - 25 + 1) + 25);
}

function generateDescription(name, category) {
  const templates = [
    `Experience the finest quality ${name}. Sourced carefully to ensure freshness and authenticity in every bite.`,
    `Premium ${name} from our ${category} selection. A must-have essential for your daily needs.`,
    `Discover the authentic taste of ${name}. Packed hygienically to maintain its natural goodness and quality.`,
    `Elevate your lifestyle with our high-quality ${name}. Perfect for your home and family.`
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

async function bulkUpdate() {
  console.log('Authenticating...');
  await signInWithEmailAndPassword(auth, process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
  console.log('Authenticated properly.');

  console.log('Fetching products from Firestore...');
  const snapshot = await getDocs(collection(db, 'products'));
  const products = snapshot.docs;
  console.log(`Found ${products.length} products. Starting update...`);

  let currentBatch = writeBatch(db);
  let batchCount = 0;
  let totalUpdated = 0;

  for (let i = 0; i < products.length; i++) {
    const docRef = products[i].ref;
    const data = products[i].data();
    
    // Determine new values
    const imageUrl = categoryImages[data.category] || defaultImage;
    const description = data.description || generateDescription(data.name, data.category);
    let price = data.price;
    let originalPrice = data.originalPrice;

    // Fix 0 prices
    if (!price || price === 0) {
      price = getRandomPrice();
      // Add a slight markup for original price to show a discount
      originalPrice = price + Math.floor(price * 0.2); 
    }

    currentBatch.update(docRef, {
      imageUrl,
      description,
      price,
      originalPrice
    });

    batchCount++;
    totalUpdated++;

    // Firestore allows max 500 writes per batch
    if (batchCount === 400 || i === products.length - 1) {
      await currentBatch.commit();
      console.log(`Committed batch of ${batchCount} updates. Total: ${totalUpdated}`);
      currentBatch = writeBatch(db);
      batchCount = 0;
    }
  }

  console.log('Bulk update completed successfully!');
  process.exit(0);
}

bulkUpdate().catch(console.error);
