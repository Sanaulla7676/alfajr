import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc,
  setDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebase";

const productsCol = collection(db, "products");
const categoriesCol = collection(db, "categories");

export async function getAllProducts() {
  const q = query(productsCol, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getProductsByCategory(slug) {
  const q = query(productsCol, where("categorySlug", "==", slug), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getProductById(id) {
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
}

export async function addProduct(data) {
  const docRef = await addDoc(productsCol, {
    ...data,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

export async function updateProduct(id, data) {
  const docRef = doc(db, "products", id);
  await updateDoc(docRef, data);
}

export async function deleteProduct(id) {
  const docRef = doc(db, "products", id);
  await deleteDoc(docRef);
}

export async function toggleStock(id, status) {
  const docRef = doc(db, "products", id);
  await updateDoc(docRef, { inStock: status });
}

export async function getCategories() {
  const snapshot = await getDocs(categoriesCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getSettings() {
  const docRef = doc(db, "settings", "store");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
}

export async function updateSettings(data) {
  const docRef = doc(db, "settings", "store");
  await setDoc(docRef, data, { merge: true });
}
