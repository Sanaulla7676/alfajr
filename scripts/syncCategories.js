import fs from "fs";
import path from "path";
import { collection, doc, setDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

// Simple env loader
const envPath = path.resolve(process.cwd(), ".env.local");
const envContent = fs.readFileSync(envPath, "utf8");
envContent.split("\n").forEach(line => {
  const [key, value] = line.split("=");
  if (key && value) process.env[key.trim()] = value.trim().replace(/^"|"$/g, '');
});

// Now import firebase
const { db, auth } = await import("../lib/firebase.js");

async function syncCategories() {
  try {
    await signInWithEmailAndPassword(auth, process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
    console.log("Logged in as admin");

    const categories = JSON.parse(fs.readFileSync("./data/categories.json", "utf8"));
    const categoriesCol = collection(db, "categories");

    for (const cat of categories) {
      const docRef = doc(categoriesCol, cat.slug);
      await setDoc(docRef, cat, { merge: true });
      console.log(`Synced category: ${cat.name}`);
    }
  } catch (error) {
    console.error("Error syncing:", error);
  }
}

syncCategories().then(() => console.log("Categories synced successfully!"));
