require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, writeBatch, doc } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const categoryImages = {

  "Spices & Masala": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  "Pasta, Noodles & Vermicelli": "https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  "Personal Care & Hygiene": "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  "Tea, Coffee & Hot Beverages": "https://images.unsplash.com/photo-1541167760496-1628856ab772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  "Cooking Oils & Ghee": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  "Sauces, Pickles & Condiments": "https://images.unsplash.com/photo-1585241936939-bf8532f8b5f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  "Dairy Products": "https://images.unsplash.com/photo-1628088062854-d1870b4553da?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  "Biscuits, Snacks & Namkeen": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  "Breakfast & Health Foods": "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  "Soft Drinks, Juices & Beverages": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  "Bread, Bakery & Sweets": "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  "Baking Ingredients & Essences": "https://images.unsplash.com/photo-1556910110-a5a63dfd393c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  "Pulses & Legumes": "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  "Ready Mixes, Soups & Convenience Foods": "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  "Flours, Grains & Staples": "https://images.unsplash.com/photo-1586201375761-83865001e8ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  "Rice & Rice Products": "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  "Dry Fruits & Nuts": "https://images.unsplash.com/photo-1599557008139-33b66444c9b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  "Household Cleaning & Laundry": "https://images.unsplash.com/photo-1585421514738-01798e348b17?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  "Agarbathi, Puja & Home Essentials": "https://images.unsplash.com/photo-1600862085350-058097b83ec6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  "Frozen Foods & Ice Cream": "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
};

const defaultImage = "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";

async function updateProducts() {
  console.log('Authenticating...');
  try {
    await signInWithEmailAndPassword(auth, process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
    console.log('Authentication successful.');
  } catch (error) {
    console.error('Authentication failed:', error);
    process.exit(1);
  }

  console.log('Fetching all products from Firestore...');
  const snapshot = await getDocs(collection(db, 'products'));
  const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  console.log(`Found ${products.length} products. Updating records...`);

  // Firestore allows up to 500 writes per batch. 
  // We'll process them in chunks of 400.
  const BATCH_SIZE = 400;
  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    const chunk = products.slice(i, i + BATCH_SIZE);
    
    chunk.forEach((product) => {
      const ref = doc(db, 'products', product.id);
      
      const imageUrl = categoryImages[product.category] || defaultImage;
      const description = `Discover the finest quality ${product.name}, carefully sourced and packed to ensure optimum freshness and taste. Perfect for your everyday needs at Alfajr Super Mart.`;

      // Update the product, preserving existing data (except if overriding empty strings)
      batch.update(ref, {
        imageUrl: product.imageUrl || imageUrl, // only overwrite if empty
        description: product.description || description
      });
    });

    await batch.commit();
    console.log(`Updated products ${i + 1} to ${Math.min(i + BATCH_SIZE, products.length)}`);
  }

  console.log('Update complete!');
  process.exit(0);
}

updateProducts().catch((err) => {
  console.error('Update failed:', err);
  process.exit(1);
});
