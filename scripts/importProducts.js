require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, writeBatch, doc, serverTimestamp } = require('firebase/firestore');
const fs = require('fs');

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

async function importData() {
  const products = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));
  const categories = JSON.parse(fs.readFileSync('data/categories.json', 'utf8'));

  console.log(`Starting import: ${products.length} products, ${categories.length} categories.`);

  // Import categories
  const catBatch = writeBatch(db);
  categories.forEach((cat) => {
    const ref = doc(db, 'categories', cat.slug);
    catBatch.set(ref, cat);
  });
  await catBatch.commit();
  console.log('Categories imported successfully.');

  // Import products in batches
  const BATCH_SIZE = 400;
  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    const chunk = products.slice(i, i + BATCH_SIZE);
    
    chunk.forEach((product) => {
      const ref = doc(collection(db, 'products'));
      batch.set(ref, {
        ...product,
        createdAt: serverTimestamp()
      });
    });

    await batch.commit();
    console.log(`Imported products ${i + 1} to ${Math.min(i + BATCH_SIZE, products.length)}`);
  }

  // Import store settings
  const settingsBatch = writeBatch(db);
  const storeRef = doc(db, 'settings', 'store');
  settingsBatch.set(storeRef, {
    storeName: "Alfajr Super Mart",
    whatsappNumber: process.env.WHATSAPP_NUMBER || "+919449546882",
    adminEmail: process.env.ADMIN_EMAIL || "Sanaullaa19@gmail.com"
  });
  await settingsBatch.commit();
  console.log('Store settings imported successfully.');

  console.log('Import complete!');
  process.exit(0);
}

importData().catch((err) => {
  console.error('Import failed:', err);
  process.exit(1);
});
