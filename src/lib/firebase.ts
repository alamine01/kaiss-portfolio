import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDUyJBYEEJJYmwW9LpG46zfbkeMlNnXhnc",
    authDomain: "kaiss-ab97a.firebaseapp.com",
    projectId: "kaiss-ab97a",
    storageBucket: "kaiss-ab97a.firebasestorage.app",
    messagingSenderId: "169313689987",
    appId: "1:169313689987:web:fc18fbc2b278b2bf2696b6"
};

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore with persistent cache
let db: ReturnType<typeof getFirestore>;
try {
    db = initializeFirestore(app, {
        localCache: persistentLocalCache({
            tabManager: persistentMultipleTabManager()
        })
    });
} catch {
    // Firestore already initialized
    db = getFirestore(app);
}

export const auth = getAuth(app);
export { db };
export const storage = getStorage(app);
export default app;
