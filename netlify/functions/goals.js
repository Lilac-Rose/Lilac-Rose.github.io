const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
  });
}

const db = admin.firestore();

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Authenticate or validate request 
    // In a real-world scenario, you'd validate the user's authentication token
    const userId = event.headers['x-user-id'];
    if (!userId) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized' })
      };
    }

    switch (event.httpMethod) {
      case 'GET':
        return await getGoals(userId, headers);
      
      case 'POST':
        return await createGoal(event, userId, headers);
      
      case 'PUT':
        return await updateGoal(event, userId, headers);
      
      case 'DELETE':
        return await deleteGoal(event, userId, headers);
      
      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }
  } catch (error) {
    console.error('Server error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};

// Get goals for a specific user
async function getGoals(userId, headers) {
  try {
    const goalsSnapshot = await db.collection('goals')
      .where('userId', '==', userId)
      .get();
    
    const goals = goalsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(goals)
    };
  } catch (error) {
    console.error('Error fetching goals:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch goals' })
    };
  }
}

// Create a new goal
async function createGoal(event, userId, headers) {
  try {
    const { title } = JSON.parse(event.body);
    
    if (!title) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Goal title is required' })
      };
    }

    const newGoal = {
      title,
      userId,
      completed: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('goals').add(newGoal);
    
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ 
        id: docRef.id, 
        ...newGoal 
      })
    };
  } catch (error) {
    console.error('Error creating goal:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to create goal' })
    };
  }
}

// Update an existing goal
async function updateGoal(event, userId, headers) {
  try {
    const { id, ...updateData } = JSON.parse(event.body);
    
    if (!id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Goal ID is required' })
      };
    }

    const goalRef = db.collection('goals').doc(id);
    const goalDoc = await goalRef.get();

    // Verify the goal belongs to the user
    if (!goalDoc.exists || goalDoc.data().userId !== userId) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'Unauthorized to update this goal' })
      };
    }

    await goalRef.update(updateData);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        id, 
        ...updateData 
      })
    };
  } catch (error) {
    console.error('Error updating goal:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to update goal' })
    };
  }
}

// Delete a goal
async function deleteGoal(event, userId, headers) {
  try {
    const { id } = JSON.parse(event.body);
    
    if (!id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Goal ID is required' })
      };
    }

    const goalRef = db.collection('goals').doc(id);
    const goalDoc = await goalRef.get();

    // Verify the goal belongs to the user
    if (!goalDoc.exists || goalDoc.data().userId !== userId) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'Unauthorized to delete this goal' })
      };
    }

    await goalRef.delete();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ id })
    };
  } catch (error) {
    console.error('Error deleting goal:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to delete goal' })
    };
  }
}