import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firebase from '@react-native-firebase/app';

export const firebaseConfig = {
  apiKey: 'AIzaSyAfewAbi6PgSFBy8bQGd4ZHUFlM0XSetkk',
  appId: '1:318722080358:android:a765463db141e449cab7a7',
  projectId: 'site-measure-app-1d946',
  storageBucket: 'site-measure-app-1d946.firebasestorage.app',
  messagingSenderId: '318722080358',
};

// Export instances for use throughout the app
export const db = firestore();
export const firebaseAuth = auth();
export const firebaseStorage = storage();

// Configure Firestores settings
db.settings({
  persistence: true,
  cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED,
});

// Main Firebase instances are exported above.
// Seeding and user creation will use these directly.

/**
 * Utility to seed the initial admin account.
 * Only use this for initial setup.
 */
export const seedInitialAdmin = async (email: string, password: string) => {
  try {
    // 1. Create user in Auth
    const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
    const { uid } = userCredential.user;

    // 2. Create user doc in Firestore
    await db.collection('users').doc(uid).set({
      uid,
      email: email.toLowerCase(),
      firstName: 'System',
      lastName: 'Admin',
      role: 'admin',
      createdAt: new Date().toISOString(),
      permissions: {
        delete: true,
        modify: true,
        create: true,
      }
    });
    
    return { success: true };
  } catch (error: any) {
    console.error('Seeding error:', error);
    throw error;
  }
};

export default {
  db,
  firebaseAuth,
  firebaseStorage,
};
