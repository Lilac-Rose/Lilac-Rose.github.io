// goals/firebaseService.js
import { 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    updateDoc, 
    deleteDoc,
    query,
    where
  } from 'firebase/firestore';
  import { db } from './firebase-config';
  
  // Add a new goal
  export const addGoal = async (goalData) => {
    try {
      const goalsRef = collection(db, 'goals');
      const docRef = await addDoc(goalsRef, {
        ...goalData,
        createdAt: new Date(),
        completed: false
      });
      return { id: docRef.id, ...goalData };
    } catch (error) {
      console.error("Error adding goal: ", error);
      throw error;
    }
  };
  
  // Get all goals
  export const getGoals = async (userId) => {
    try {
      const goalsRef = collection(db, 'goals');
      const q = query(goalsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting goals: ", error);
      throw error;
    }
  };
  
  // Update a goal
  export const updateGoal = async (goalId, updatedData) => {
    try {
      const goalRef = doc(db, 'goals', goalId);
      await updateDoc(goalRef, updatedData);
      return { id: goalId, ...updatedData };
    } catch (error) {
      console.error("Error updating goal: ", error);
      throw error;
    }
  };
  
  // Delete a goal
  export const deleteGoal = async (goalId) => {
    try {
      const goalRef = doc(db, 'goals', goalId);
      await deleteDoc(goalRef);
      return goalId;
    } catch (error) {
      console.error("Error deleting goal: ", error);
      throw error;
    }
  };