import { db } from './firebase-config.js';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where 
} from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';

const goalInput = document.getElementById('goal-input');
const userIdInput = document.getElementById('user-id');
const addGoalBtn = document.getElementById('add-goal-btn');
const goalsList = document.getElementById('goals-list');

// Add a new goal
addGoalBtn.addEventListener('click', async () => {
  const goalText = goalInput.value.trim();
  const userId = userIdInput.value.trim();

  if (goalText && userId) {
    try {
      const goalsRef = collection(db, 'goals');
      const newGoal = {
        title: goalText,
        userId: userId,
        completed: false,
        createdAt: new Date()
      };

      const docRef = await addDoc(goalsRef, newGoal);
      
      // Immediately fetch and display goals
      await fetchGoals(userId);

      // Clear input fields
      goalInput.value = '';
    } catch (error) {
      console.error("Error adding goal: ", error);
    }
  }
});

// Fetch goals for a specific user
async function fetchGoals(userId) {
  try {
    const goalsRef = collection(db, 'goals');
    const q = query(goalsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    // Clear existing list
    goalsList.innerHTML = '';

    querySnapshot.forEach((document) => {
      const goal = document.data();
      goal.id = document.id;
      
      const li = document.createElement('li');
      li.classList.add('goal-item');
      if (goal.completed) li.classList.add('completed');

      li.innerHTML = `
        <span>${goal.title}</span>
        <div class="goal-actions">
          <button class="btn-complete" data-id="${goal.id}">
            ${goal.completed ? 'Undo' : 'Complete'}
          </button>
          <button class="btn-delete" data-id="${goal.id}">Delete</button>
        </div>
      `;

      goalsList.appendChild(li);
    });

    // Add event listeners for complete and delete buttons
    document.querySelectorAll('.btn-complete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const goalId = e.target.dataset.id;
        await toggleGoalCompletion(goalId);
      });
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const goalId = e.target.dataset.id;
        await deleteGoal(goalId);
      });
    });

  } catch (error) {
    console.error("Error fetching goals: ", error);
  }
}

// Toggle goal completion
async function toggleGoalCompletion(goalId) {
  try {
    const goalRef = doc(db, 'goals', goalId);
    const currentGoal = await getDoc(goalRef);
    await updateDoc(goalRef, {
      completed: !currentGoal.data().completed
    });

    // Refresh goals list
    const userId = userIdInput.value.trim();
    if (userId) await fetchGoals(userId);
  } catch (error) {
    console.error("Error toggling goal: ", error);
  }
}

// Delete a goal
async function deleteGoal(goalId) {
  try {
    const goalRef = doc(db, 'goals', goalId);
    await deleteDoc(goalRef);

    // Refresh goals list
    const userId = userIdInput.value.trim();
    if (userId) await fetchGoals(userId);
  } catch (error) {
    console.error("Error deleting goal: ", error);
  }
}

// Optional: Fetch goals when a user ID is entered
userIdInput.addEventListener('change', async () => {
  const userId = userIdInput.value.trim();
  if (userId) {
    await fetchGoals(userId);
  }
});