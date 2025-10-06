import { sampleMenuItems } from '../data/menuItems.js';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const initializeMenuItems = async () => {
  try {
    // Clear existing menu items (optional)
    const querySnapshot = await getDocs(collection(db, 'menuItems'));
    const deletePromises = querySnapshot.docs.map(docSnapshot => 
      deleteDoc(doc(db, 'menuItems', docSnapshot.id))
    );
    await Promise.all(deletePromises);
    console.log('Cleared existing menu items');

    // Add new menu items
    const addPromises = sampleMenuItems.map(item => 
      addDoc(collection(db, 'menuItems'), {
        ...item,
        createdAt: new Date()
      })
    );
    
    await Promise.all(addPromises);
    console.log('Successfully added menu items to Firestore');
    return true;
  } catch (error) {
    console.error('Error initializing menu items:', error);
    return false;
  }
};

// Run this function once to populate your database
// initializeMenuItems();