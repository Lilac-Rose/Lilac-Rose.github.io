// goals/GoalsManager.jsx
import React, { useState, useEffect } from 'react';
import { 
  addGoal, 
  getGoals, 
  updateGoal, 
  deleteGoal 
} from './firebaseService';

const GoalsManager = ({ userId }) => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');

  // Fetch goals on component mount
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const userGoals = await getGoals(userId);
        setGoals(userGoals);
      } catch (error) {
        console.error('Failed to fetch goals', error);
      }
    };

    fetchGoals();
  }, [userId]);

  // Add a new goal
  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      const goal = await addGoal({ 
        title: newGoal, 
        userId 
      });
      setGoals([...goals, goal]);
      setNewGoal('');
    } catch (error) {
      console.error('Failed to add goal', error);
    }
  };

  // Update goal completion status
  const toggleGoalCompletion = async (goal) => {
    try {
      const updatedGoal = await updateGoal(goal.id, { 
        completed: !goal.completed 
      });
      setGoals(goals.map(g => 
        g.id === goal.id ? updatedGoal : g
      ));
    } catch (error) {
      console.error('Failed to update goal', error);
    }
  };

  // Delete a goal
  const handleDeleteGoal = async (goalId) => {
    try {
      await deleteGoal(goalId);
      setGoals(goals.filter(goal => goal.id !== goalId));
    } catch (error) {
      console.error('Failed to delete goal', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleAddGoal}>
        <input 
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="Enter a new goal"
          required
        />
        <button type="submit">Add Goal</button>
      </form>

      <ul>
        {goals.map(goal => (
          <li key={goal.id}>
            <span 
              style={{ 
                textDecoration: goal.completed ? 'line-through' : 'none' 
              }}
            >
              {goal.title}
            </span>
            <button onClick={() => toggleGoalCompletion(goal)}>
              {goal.completed ? 'Undo' : 'Complete'}
            </button>
            <button onClick={() => handleDeleteGoal(goal.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GoalsManager;